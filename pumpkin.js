(() => {
  "use strict";

  const pumpkins = [...document.querySelectorAll(".pumpkin-trigger")];
  const title = document.querySelector("h1");
  if (!pumpkins.length || !title) return;

  let taps = [];
  let bursting = false;
  const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";
  const random = (min, max) => min + Math.random() * (max - min);

  function fly(piece, origin, velocity, box, reducedMotion) {
    let { x, y } = origin;
    let { x: vx, y: vy } = velocity;
    let angle = 0;
    let spin = random(-800, 800);
    const frames = [];
    const duration = reducedMotion ? 240 : 2300;
    const steps = reducedMotion ? 1 : 70;
    const dt = duration / steps / 1000;
    const floor = innerHeight - box.height;

    // Solve once, then let the compositor play the fall, spin and soft bounces.
    for (let frame = 0; frame <= steps; frame++) {
      frames.push({
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`,
        opacity: reducedMotion ? 1 - frame / steps : 1,
        offset: frame / steps,
      });
      if (reducedMotion) continue;
      x += vx * dt;
      y += vy * dt;
      vy += innerHeight * 2.3 * dt;
      angle += spin * dt;
      if (x < 0 || x > innerWidth - box.width) {
        x = Math.max(0, Math.min(innerWidth - box.width, x));
        vx *= -0.45;
        spin *= 0.7;
      }
      if (y >= floor) {
        y = floor;
        vy = Math.abs(vy) < 100 ? 0 : -Math.abs(vy) * 0.27;
        vx *= 0.66;
        spin *= 0.42;
      }
    }
    piece.animate(frames, { duration, easing: "linear", fill: "forwards" });
  }

  function splatter(burstX, burstY, reducedMotion) {
    const heading = title.getBoundingClientRect();
    const count = reducedMotion ? 5 : innerWidth <= 600 ? 16 : 24;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement("i");
      drop.className = "blood-drop";
      drop.setAttribute("aria-hidden", "true");
      const size = random(3, 9);
      drop.style.width = `${size}px`;
      drop.style.height = `${size * random(1, 2.4)}px`;
      document.body.append(drop);
      const x = random(heading.left + 8, heading.right - 8);
      const y = random(
        heading.top + heading.height * 0.25,
        heading.bottom + 16,
      );
      const start = reducedMotion
        ? `translate(${x}px, ${y}px)`
        : `translate(${burstX}px, ${burstY}px) scale(0.6)`;
      drop.animate(
        [
          { transform: start, opacity: 0.9 },
          { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0.85 },
        ],
        {
          duration: reducedMotion ? 160 : random(200, 400),
          easing: easeOut,
          fill: "forwards",
        },
      );
    }
    // The stain belongs to the lettering, so it stays aligned after a phone rotates.
    title.classList.add("bloodied");
  }

  function shatter(pumpkin, reducedMotion) {
    const box = pumpkin.querySelector("img").getBoundingClientRect();
    const scale = box.width / 320;
    const burstX = box.left + box.width / 2;
    const burstY = box.top + box.height * 0.55;
    const fragment = document.createDocumentFragment();
    const pieces = [];
    const columns = innerWidth <= 600 ? 5 : 6;
    const rows = 4;
    const cellW = 280 / columns;
    const cellH = 205 / rows;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        for (let half = 0; half < 2; half++) {
          const piece = document.createElement("i");
          piece.className = "pumpkin-shard";
          piece.setAttribute("aria-hidden", "true");
          const x = 20 + column * cellW;
          const y = 70 + row * cellH;
          const width = cellW * scale;
          const height = cellH * scale;
          piece.style.width = `${width}px`;
          piece.style.height = `${height}px`;
          piece.style.clipPath = half
            ? "polygon(0 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 100%)";
          const image = document.createElement("img");
          image.src = "./assets/pumpkin-shell.svg";
          image.alt = "";
          image.style.width = `${box.width}px`;
          image.style.left = `${-x * scale}px`;
          image.style.top = `${-y * scale}px`;
          piece.append(image);
          fragment.append(piece);
          const dx = (column + 0.5) / columns - 0.5;
          const dy = (row + 0.5) / rows - 0.5;
          pieces.push({
            piece,
            origin: { x: box.left + x * scale, y: box.top + y * scale },
            velocity: {
              x: dx * innerWidth * random(2, 3.3) + random(-90, 90),
              y: dy * innerHeight * 0.7 - innerHeight * random(0.45, 0.9),
            },
            box: { width, height },
          });
        }
      }
    }

    // The stem and the solitary tooth are real pieces, not orange confetti.
    for (const [kind, x, y, width, height] of [
      ["tooth", 177, 149, 27, 37],
      ["stem", 148, 25, 39, 59],
    ]) {
      const piece = document.createElement("i");
      piece.className = `pumpkin-shard pumpkin-${kind}`;
      piece.setAttribute("aria-hidden", "true");
      piece.style.width = `${width * scale}px`;
      piece.style.height = `${height * scale}px`;
      fragment.append(piece);
      pieces.push({
        piece,
        origin: { x: box.left + x * scale, y: box.top + y * scale },
        velocity: {
          x: random(-0.8, 0.8) * innerWidth,
          y: -innerHeight * random(0.8, 1.15),
        },
        box: { width: width * scale, height: height * scale },
      });
    }
    document.body.append(fragment);
    pumpkin.classList.add("is-burst");
    for (const piece of pieces)
      fly(piece.piece, piece.origin, piece.velocity, piece.box, reducedMotion);

    const pressure = document.createElement("i");
    pressure.className = "pressure-ring";
    pressure.setAttribute("aria-hidden", "true");
    pressure.style.left = `${burstX}px`;
    pressure.style.top = `${burstY}px`;
    document.body.append(pressure);
    pressure.animate(
      reducedMotion
        ? [{ opacity: 0.12 }, { opacity: 0 }]
        : [
            { transform: "translate(-50%, -50%) scale(0.7)", opacity: 0.35 },
            { transform: "translate(-50%, -50%) scale(3.2)", opacity: 0 },
          ],
      {
        duration: reducedMotion ? 160 : 380,
        easing: easeOut,
        fill: "forwards",
      },
    );

    return { x: burstX, y: burstY };
  }

  function explode() {
    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const centers = pumpkins.map((pumpkin) => shatter(pumpkin, reducedMotion));
    splatter(
      centers.reduce((sum, center) => sum + center.x, 0) / centers.length,
      centers.reduce((sum, center) => sum + center.y, 0) / centers.length,
      reducedMotion,
    );
    // Start the five-second clock at the burst, including the time the pieces fall.
    setTimeout(() => location.reload(), 5000);
  }

  function onTap() {
    if (bursting) return;
    const now = performance.now();
    taps = taps.filter((time) => now - time <= 1000);
    taps.push(now);
    if (taps.length < 6) return;
    bursting = true;
    pumpkins.forEach((pumpkin) =>
      pumpkin.setAttribute("aria-disabled", "true"),
    );
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      explode();
      return;
    }
    // A short pressure swell makes the fracture come from inside.
    Promise.all(
      pumpkins.map(
        (pumpkin) =>
          pumpkin.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.12, 1.07)" }],
            {
              duration: 140,
              easing: "cubic-bezier(0.77, 0, 0.175, 1)",
              fill: "forwards",
            },
          ).finished,
      ),
    ).then(explode);
  }

  pumpkins.forEach((pumpkin) => pumpkin.addEventListener("click", onTap));
})();
