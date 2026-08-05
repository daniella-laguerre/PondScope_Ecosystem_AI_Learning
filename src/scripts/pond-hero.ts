/**
 * Interactive pond digital twin (Phase 2 hero).
 * Sediment = pre-trained weights · Water = runtime state · Drops = tokens.
 */

type Ripple = {
  x: number;
  y: number;
  r: number;
  max: number;
  strength: number;
  born: number;
};

export type PondHeroOptions = {
  canvas: HTMLCanvasElement;
  viscosityEl: HTMLInputElement;
  pollutionEl: HTMLInputElement;
  viscosityOut: HTMLElement;
  pollutionOut: HTMLElement;
  tokenInput: HTMLInputElement;
  dropBtn: HTMLButtonElement;
};

export function initPondHero(opts: PondHeroOptions) {
  const { canvas } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let t0 = performance.now();
  let viscosity = Number(opts.viscosityEl.value) / 100;
  let pollution = Number(opts.pollutionEl.value) / 100;
  const ripples: Ripple[] = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drop(x: number, y: number, strength = 1) {
    ripples.push({
      x,
      y,
      r: 2,
      max: 90 + strength * 140,
      strength,
      born: performance.now(),
    });
    if (ripples.length > 28) ripples.shift();
  }

  function drawSediment() {
    const g = ctx!.createLinearGradient(0, height * 0.55, 0, height);
    g.addColorStop(0, "rgba(28, 22, 16, 0)");
    g.addColorStop(0.35, "rgba(58, 44, 30, 0.55)");
    g.addColorStop(1, "rgba(36, 28, 20, 0.95)");
    ctx!.fillStyle = g;
    ctx!.fillRect(0, height * 0.52, width, height * 0.48);

    // Dense weight grains
    ctx!.fillStyle = "rgba(90, 70, 48, 0.35)";
    for (let i = 0; i < 120; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(i * 78.233) * 12345.6789) % 1;
      const px = Math.abs(x) * width;
      const py = height * 0.62 + Math.abs(y) * height * 0.35;
      ctx!.fillRect(px, py, 1.5 + (i % 3), 1.5 + (i % 2));
    }
  }

  function drawWater(now: number) {
    const murk = 0.12 + pollution * 0.55;
    const clarity = 1 - pollution * 0.75;
    const base = ctx!.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0, `rgba(18, 56, 64, ${0.35 + murk * 0.2})`);
    base.addColorStop(0.45, `rgba(22, 90, 96, ${0.45 + murk * 0.25})`);
    base.addColorStop(1, `rgba(10, 40, 46, ${0.7 + murk * 0.2})`);
    ctx!.fillStyle = base;
    ctx!.fillRect(0, 0, width, height);

    // Bioluminescent sheen
    const sheen = ctx!.createRadialGradient(
      width * 0.35,
      height * 0.28,
      10,
      width * 0.4,
      height * 0.35,
      width * 0.55
    );
    sheen.addColorStop(0, `rgba(62, 201, 195, ${0.22 * clarity})`);
    sheen.addColorStop(0.55, `rgba(47, 150, 160, ${0.08 * clarity})`);
    sheen.addColorStop(1, "rgba(7, 15, 20, 0)");
    ctx!.fillStyle = sheen;
    ctx!.fillRect(0, 0, width, height);

    // Slow caustic bands (viscosity slows them)
    const speed = 0.00035 / (0.35 + viscosity * 1.8);
    const phase = now * speed;
    ctx!.save();
    ctx!.globalCompositeOperation = "lighter";
    for (let i = 0; i < 5; i++) {
      const y = height * (0.18 + i * 0.12) + Math.sin(phase + i) * (8 + i * 2);
      const band = ctx!.createLinearGradient(0, y - 18, 0, y + 18);
      band.addColorStop(0, "rgba(62, 201, 195, 0)");
      band.addColorStop(0.5, `rgba(94, 220, 210, ${0.05 * clarity})`);
      band.addColorStop(1, "rgba(62, 201, 195, 0)");
      ctx!.fillStyle = band;
      ctx!.fillRect(0, y - 20, width, 40);
    }
    ctx!.restore();

    // Pollution haze
    if (pollution > 0.05) {
      ctx!.fillStyle = `rgba(70, 62, 40, ${pollution * 0.28})`;
      ctx!.fillRect(0, 0, width, height);
    }
  }

  function drawRipples(now: number) {
    const decay = 0.55 + viscosity * 1.6;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      const age = (now - rip.born) / 1000;
      rip.r += (1.8 + rip.strength) / decay;
      const life = 1 - rip.r / rip.max - age * 0.08 * decay;
      if (life <= 0 || rip.r > rip.max) {
        ripples.splice(i, 1);
        continue;
      }
      const alpha = Math.max(0, life) * (0.55 - pollution * 0.25);
      ctx!.beginPath();
      ctx!.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(228, 241, 237, ${alpha})`;
      ctx!.lineWidth = 1.5 + rip.strength * 0.8;
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.arc(rip.x, rip.y, rip.r * 0.55, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(62, 201, 195, ${alpha * 0.7})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }
  }

  function frame(now: number) {
    drawWater(now - t0);
    drawSediment();
    if (!reduceMotion) drawRipples(now);
    else if (ripples.length) drawRipples(now);
    raf = requestAnimationFrame(frame);
  }

  function onPointer(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    drop(e.clientX - rect.left, e.clientY - rect.top, 1.1);
  }

  function syncLabels() {
    viscosity = Number(opts.viscosityEl.value) / 100;
    pollution = Number(opts.pollutionEl.value) / 100;
    const lat = Math.round(40 + viscosity * 420);
    opts.viscosityOut.textContent = `${lat} ms TTFT feel`;
    opts.pollutionOut.textContent =
      pollution < 0.33 ? "clear context" : pollution < 0.66 ? "token noise" : "context flood";
  }

  function dropToken() {
    const text = opts.tokenInput.value.trim() || "token";
    const rect = canvas.getBoundingClientRect();
    const x = rect.width * (0.25 + Math.random() * 0.5);
    const y = rect.height * (0.25 + Math.random() * 0.35);
    drop(x, y, 0.8 + Math.min(2, text.length / 8));
    // Extra ripples = bloat
    const extras = Math.min(6, Math.floor(text.split(/\s+/).length));
    for (let i = 0; i < extras; i++) {
      drop(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 40, 0.5);
    }
  }

  resize();
  syncLabels();
  // Ambient starter ripple
  drop(width * 0.55, height * 0.4, 0.9);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  canvas.addEventListener("pointerdown", onPointer);
  opts.viscosityEl.addEventListener("input", syncLabels);
  opts.pollutionEl.addEventListener("input", syncLabels);
  opts.dropBtn.addEventListener("click", dropToken);
  opts.tokenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dropToken();
    }
  });

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    canvas.removeEventListener("pointerdown", onPointer);
  };
}
