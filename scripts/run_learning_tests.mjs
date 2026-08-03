#!/usr/bin/env node
/**
 * Drive the PondScope learning HTML demos and report held-out teach results.
 * Maps outcomes to glossary concepts the demos can actually demonstrate.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const path = join(ROOT, decodeURIComponent((req.url || '/').split('?')[0]));
      const file = path.endsWith('/') ? join(path, 'index.html') : path;
      if (!existsSync(file) || !file.startsWith(ROOT)) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'text/plain' });
      res.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

async function waitTeachDone(page, selector, timeout = 120000) {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const t = el.textContent || '';
      return /\d+%/.test(t) && !/teaching/i.test(t) && !/—/.test(t);
    },
    selector,
    { timeout }
  );
}

async function testPondVsAttention(page, base) {
  const rows = [];
  for (const K of [4, 12, 20, 30]) {
    await page.goto(`${base}/pond-vs-attention.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#kd').fill(String(K));
    await page.locator('#fit').click();
    await waitTeachDone(page, '#pacc');
    await page.waitForFunction(() => {
      const a = document.querySelector('#aacc')?.textContent || '';
      return /\d+%/.test(a);
    });
    const pond = await page.locator('#pacc').innerText();
    const note = await page.locator('#aacc').innerText();
    const progress = await page.locator('#progress').innerText();
    rows.push({
      demo: 'pond-vs-attention',
      K,
      pond_heldout: pond.trim(),
      notebook_heldout: note.trim(),
      status: progress.trim(),
    });
    console.log(`  K=${K}: pond ${pond.trim()} | notebook ${note.trim()}`);
  }
  return rows;
}

async function testMultiHead(page, base) {
  const rows = [];
  for (const H of [1, 2, 3, 4]) {
    await page.goto(`${base}/multi-head.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#hd').fill(String(H));
    // trigger input handlers
    await page.locator('#hd').evaluate((el, h) => {
      el.value = String(h);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, H);
    await page.locator('#fit').click();
    await page.waitForFunction(
      () => {
        const t = document.querySelector('#progress')?.textContent || '';
        return /back:\s*\d+%/.test(t) && !/teaching/i.test(t);
      },
      null,
      { timeout: 120000 }
    );
    const progress = (await page.locator('#progress').innerText()).replace(/\s+/g, ' ').trim();
    rows.push({ demo: 'multi-head', heads: H, result: progress });
    console.log(`  heads=${H}: ${progress}`);
  }
  return rows;
}

async function fitPondContinuous(page, modeSel, label) {
  await page.locator(`#modeseg div[data-m="${modeSel}"]`).click();
  await page.waitForFunction(
    (m) => document.querySelector(`#modeseg div[data-m="${m}"]`)?.classList.contains('on'),
    modeSel
  );
  // Clear prior status so we don't resolve on a stale result.
  await page.evaluate(() => {
    const el = document.getElementById('trainstat');
    if (el) el.textContent = 'fitting…';
  });
  await page.locator('#trainbtn').click();
  await page.waitForFunction(
    () => {
      const t = document.querySelector('#trainstat')?.textContent || '';
      return /held-out recall\s+\d+/i.test(t);
    },
    null,
    { timeout: 180000 }
  );
  const stat = (await page.locator('#trainstat').innerText()).replace(/\s+/g, ' ').trim();
  console.log(`  ${label}: ${stat}`);
  return { demo: 'pond-continuous', mode: label, result: stat };
}

async function testPondContinuous(page, base) {
  await page.goto(`${base}/pond-continuous.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('.tab[data-p="learn"]').click();
  await page.evaluate(() => {
    document.getElementById('panel')?.classList.remove('min');
  });
  await page.locator('#pane-learn').waitFor({ state: 'visible' });
  const rows = [];
  rows.push(await fitPondContinuous(page, 'readout', 'C only'));
  rows.push(await fitPondContinuous(page, 'full', 'A, B, C, Δ'));
  return rows;
}

function glossaryMap(report) {
  return {
    demonstrated: [
      'State-space model (SSM) / recurrent hidden state — pond-continuous + pond side',
      'Attention / KV-style notebook memory — pond-vs-attention notebook side',
      'Multi-head attention — multi-head demo specialization',
      'Hybrid motivation — pond fades with K, notebook stays high',
      'Context window / growing memory cost — notebook memory counter grows',
    ],
    not_tested_by_learning_tool: [
      'Token overconsumption, TTFT, cold start, KV-cache memory pressure (serving)',
      'Jailbreak / prompt injection, data leakage, toxic output, bias, sycophancy',
      'Agent cascades, tool-use errors, over/underrefusal',
      'Catastrophic forgetting, reward hacking, distribution shift',
    ],
    note:
      'The learning tool verifies pedagogical memory claims with tiny 4-symbol tasks. It is not a production issues harness.',
    raw: report,
  };
}

async function main() {
  const { server, base } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  const report = { pond_continuous: [], pond_vs_attention: [], multi_head: [] };

  console.log('\n=== 01 pond-continuous (Learn → Fit) ===');
  try {
    report.pond_continuous = await testPondContinuous(page, base);
  } catch (e) {
    console.error('  FAIL:', e.message);
    report.pond_continuous = [{ error: e.message }];
  }

  console.log('\n=== 02 pond-vs-attention (Teach both @ K) ===');
  try {
    report.pond_vs_attention = await testPondVsAttention(page, base);
  } catch (e) {
    console.error('  FAIL:', e.message);
    report.pond_vs_attention = [{ error: e.message }];
  }

  console.log('\n=== 03 multi-head (Teach @ H heads) ===');
  try {
    report.multi_head = await testMultiHead(page, base);
  } catch (e) {
    console.error('  FAIL:', e.message);
    report.multi_head = [{ error: e.message }];
  }

  await browser.close();
  server.close();

  const mapped = glossaryMap(report);
  console.log('\n=== Glossary mapping ===');
  console.log('Demonstrated:');
  mapped.demonstrated.forEach((x) => console.log('  ✓', x));
  console.log('Not tested by this tool:');
  mapped.not_tested_by_learning_tool.forEach((x) => console.log('  ·', x));
  console.log('\n' + mapped.note);

  const out = join(ROOT, 'results_learning_tests.json');
  await import('node:fs/promises').then((fs) =>
    fs.writeFile(out, JSON.stringify(mapped, null, 2))
  );
  console.log('\nWrote', out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
