import * as THREE from "three";

/** Draw into a 2D canvas and wrap it as an sRGB texture. */
export function makeTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Deterministic pseudo-random generator so textures look the same on every load. */
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Monitor idle wallpaper: moody grey sky, dark sea, white surf line, black-sand beach, dock bar. */
export function makeMonitorWallpaper() {
  return makeTexture(1024, 614, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    sky.addColorStop(0, "#8e979f");
    sky.addColorStop(1, "#d3d8db");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.5);
    // Distant headland
    ctx.fillStyle = "#4e545a";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(0, h * 0.44);
    ctx.lineTo(w * 0.18, h * 0.42);
    ctx.lineTo(w * 0.34, h * 0.45);
    ctx.lineTo(w * 0.42, h * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#5b6167";
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.5);
    ctx.lineTo(w * 0.63, h * 0.455);
    ctx.lineTo(w * 0.66, h * 0.5);
    ctx.closePath();
    ctx.fill();
    // Sea
    const sea = ctx.createLinearGradient(0, h * 0.5, 0, h * 0.72);
    sea.addColorStop(0, "#3e5f70");
    sea.addColorStop(1, "#203541");
    ctx.fillStyle = sea;
    ctx.fillRect(0, h * 0.5, w, h * 0.25);
    // Surf line
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y = h * 0.66 + Math.sin(x / 60) * 6 + x * 0.04;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 16;
    ctx.stroke();
    // Beach
    ctx.fillStyle = "#16161a";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.68);
    ctx.lineTo(w, h * 0.72);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    // Dock
    roundRect(ctx, w * 0.3, h * 0.9, w * 0.4, h * 0.07, 14);
    ctx.fillStyle = "rgba(20,22,30,0.85)";
    ctx.fill();
    const dots = ["#4f8df5", "#e4433b", "#36c26a", "#f4b63f", "#8e6bd8", "#f06ca4", "#39c5cf", "#e9e9e9"];
    dots.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(w * 0.33 + i * (w * 0.345) / 7 + 6, h * 0.935, 10, 0, Math.PI * 2);
      ctx.fill();
    });
    // Top bar
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, w, 16);
  });
}

/** Dark code editor. Coloured bars stand in for code; nothing real is reproduced. */
export function makeEditorScreen() {
  return makeTexture(1024, 640, (ctx, w, h) => {
    const rand = seeded(7);
    ctx.fillStyle = "#1e1e2e";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#181825";
    ctx.fillRect(0, 0, w, 28);
    ctx.fillRect(0, 28, 150, h);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(18 + i * 18, 14, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    // Sidebar entries
    for (let i = 0; i < 12; i += 1) {
      ctx.fillStyle = "#3a3a52";
      roundRect(ctx, 16 + (i % 3) * 8, 48 + i * 22, 70 + rand() * 50, 8, 4);
      ctx.fill();
    }
    const palette = ["#c792ea", "#82aaff", "#c3e88d", "#89ddff", "#f78c6c", "#ffcb6b", "#cdd6f4"];
    const lineH = 26;
    let indent = 0;
    for (let i = 0; i < 22; i += 1) {
      const y = 50 + i * lineH;
      ctx.fillStyle = "#4c5270";
      ctx.font = "14px monospace";
      ctx.fillText(String(i + 1).padStart(2, " "), 162, y + 12);
      if (rand() < 0.25) indent = Math.max(0, indent + (rand() < 0.5 ? -1 : 1));
      let x = 200 + indent * 28;
      const segments = 1 + Math.floor(rand() * 4);
      for (let s = 0; s < segments; s += 1) {
        const width = 30 + rand() * 120;
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
        roundRect(ctx, x, y + 2, width, 12, 5);
        ctx.fill();
        x += width + 12;
        if (x > w - 80) break;
      }
    }
    ctx.fillStyle = "#89b4fa";
    ctx.fillRect(200, 50 + 21 * lineH + 2, 2, 14);
    ctx.fillStyle = "#181825";
    ctx.fillRect(150, h - 24, w - 150, 24);
  });
}

/** Silver laptop deck with a key grid and touchpad. */
export function makeLaptopDeck() {
  return makeTexture(720, 480, (ctx, w, h) => {
    ctx.fillStyle = "#c9ccd1";
    ctx.fillRect(0, 0, w, h);
    const cols = 15;
    const rows = 5;
    const keyW = 40;
    const keyH = 36;
    const x0 = (w - cols * (keyW + 4)) / 2;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const wide = r === rows - 1 && c > 3 && c < 9;
        if (r === rows - 1 && c > 4 && c < 9) continue;
        roundRect(ctx, x0 + c * (keyW + 4), 30 + r * (keyH + 4), wide ? keyW * 5 + 16 : keyW, keyH, 5);
        ctx.fillStyle = "#b1b5bb";
        ctx.fill();
      }
    }
    roundRect(ctx, w / 2 - 95, 250, 190, 120, 10);
    ctx.fillStyle = "#bcc0c6";
    ctx.fill();
    ctx.strokeStyle = "#a7abb2";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

/** Purple-pink paisley wrap for the pen holder. */
export function makePaisley() {
  return makeTexture(512, 256, (ctx, w, h) => {
    const rand = seeded(42);
    ctx.fillStyle = "#5a2a6e";
    ctx.fillRect(0, 0, w, h);
    const colors = ["#e05aa8", "#f28ac8", "#b48ad6", "#ff9ad5", "#8a4fb0"];
    for (let i = 0; i < 70; i += 1) {
      const x = rand() * w;
      const y = rand() * h;
      const size = 10 + rand() * 22;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand() * Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size, -size, size, size * 0.6, 0, size);
      ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.6, -size * 0.4, 0, -size);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    for (let i = 0; i < 160; i += 1) {
      ctx.fillStyle = "rgba(255,220,245,0.5)";
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** Certificate paper with the degree and school. */
export function makeCertificate({ degree, school }) {
  return makeTexture(600, 440, (ctx, w, h) => {
    ctx.fillStyle = "#f7f1e2";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#8a7a52";
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, w - 56, h - 56);
    ctx.fillStyle = "#3b332e";
    ctx.textAlign = "center";
    ctx.font = "bold 26px Georgia, serif";
    ctx.fillText("Certificate", w / 2, 90);
    ctx.font = "16px Georgia, serif";
    ctx.fillStyle = "#6a625c";
    ctx.fillText("This certifies that", w / 2, 130);
    ctx.font = "bold 22px Georgia, serif";
    ctx.fillStyle = "#3b332e";
    ctx.fillText("Saffron Dionysius T", w / 2, 170);
    ctx.font = "15px Georgia, serif";
    ctx.fillStyle = "#6a625c";
    ctx.fillText("has been awarded the degree of", w / 2, 205);
    ctx.font = "bold 17px Georgia, serif";
    ctx.fillStyle = "#3b332e";
    ctx.fillText(degree, w / 2, 240);
    ctx.font = "15px Georgia, serif";
    ctx.fillStyle = "#6a625c";
    ctx.fillText(school, w / 2, 272);
    // Seal
    ctx.fillStyle = "#d9a441";
    ctx.beginPath();
    ctx.arc(w - 110, h - 95, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff3cf";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w - 110, h - 95, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#b8433f";
    ctx.beginPath();
    ctx.moveTo(w - 122, h - 70);
    ctx.lineTo(w - 118, h - 30);
    ctx.lineTo(w - 110, h - 40);
    ctx.lineTo(w - 102, h - 30);
    ctx.lineTo(w - 98, h - 70);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#3b332e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(90, h - 80);
    ctx.lineTo(260, h - 80);
    ctx.stroke();
    ctx.font = "12px Georgia, serif";
    ctx.fillStyle = "#6a625c";
    ctx.fillText("Principal", 175, h - 62);
  });
}

/** Printed resume: name, title and grey text lines. */
export function makeResumeSheet({ name, title }) {
  return makeTexture(420, 594, (ctx, w, h) => {
    const rand = seeded(3);
    ctx.fillStyle = "#fbfaf6";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2b2521";
    ctx.font = "bold 24px Inter, Arial, sans-serif";
    ctx.fillText(name, 36, 60);
    ctx.font = "15px Inter, Arial, sans-serif";
    ctx.fillStyle = "#4f7f72";
    ctx.fillText(title, 36, 84);
    ctx.fillStyle = "#4f7f72";
    ctx.fillRect(36, 96, w - 72, 2);
    let y = 124;
    for (let section = 0; section < 4; section += 1) {
      ctx.fillStyle = "#3b332e";
      roundRect(ctx, 36, y, 90, 9, 4);
      ctx.fill();
      y += 20;
      const lines = 4 + Math.floor(rand() * 3);
      for (let i = 0; i < lines; i += 1) {
        ctx.fillStyle = "#c9c4ba";
        roundRect(ctx, 36, y, (w - 72) * (0.55 + rand() * 0.45), 6, 3);
        ctx.fill();
        y += 14;
      }
      y += 16;
    }
  });
}

/** Deskpulse dashboard. Static here; Phase 6 redraws it every minute with live data. */
function drawWeatherIcon(ctx, x, y, state, isDay) {
  ctx.save();
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  if (state === "clear" && isDay) {
    ctx.fillStyle = "#f2b45a";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f2b45a";
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 34, y + Math.sin(a) * 34);
      ctx.lineTo(x + Math.cos(a) * 42, y + Math.sin(a) * 42);
      ctx.stroke();
    }
  } else if (state === "clear") {
    ctx.fillStyle = "#f5efd6";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0b0f17";
    ctx.beginPath();
    ctx.arc(x + 12, y - 8, 22, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Cloud base for cloudy / rain / thunder / fog
    ctx.fillStyle = state === "fog" ? "#9aa3ad" : "#c7ced4";
    ctx.beginPath();
    ctx.arc(x - 14, y + 4, 16, 0, Math.PI * 2);
    ctx.arc(x + 2, y - 8, 20, 0, Math.PI * 2);
    ctx.arc(x + 18, y + 4, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 14, y + 4, 32, 16);
    if (state === "rain") {
      ctx.strokeStyle = "#7fb3ff";
      [-12, 0, 12].forEach((dx) => {
        ctx.beginPath();
        ctx.moveTo(x + dx, y + 28);
        ctx.lineTo(x + dx - 4, y + 42);
        ctx.stroke();
      });
    } else if (state === "thunderstorm") {
      ctx.fillStyle = "#ffd54f";
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 20);
      ctx.lineTo(x - 8, y + 40);
      ctx.lineTo(x + 2, y + 40);
      ctx.lineTo(x - 4, y + 56);
      ctx.lineTo(x + 12, y + 34);
      ctx.lineTo(x + 2, y + 34);
      ctx.closePath();
      ctx.fill();
    } else if (state === "fog") {
      ctx.strokeStyle = "#c7ced4";
      [30, 40, 50].forEach((dy, i) => {
        ctx.beginPath();
        ctx.moveTo(x - 26 + i * 4, y + dy);
        ctx.lineTo(x + 26 - i * 4, y + dy);
        ctx.stroke();
      });
    }
  }
  ctx.restore();
}

export function makeDeskpulseScreen({ time, temperature = "--°", condition = "clear", state = "clear", isDay = true }) {
  return makeTexture(480, 320, (ctx, w, h) => {
    ctx.fillStyle = "#0b0f17";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffd98a";
    ctx.font = "bold 96px Inter, Arial, sans-serif";
    ctx.fillText(time, 32, 128);
    ctx.fillStyle = "#7fa89a";
    ctx.font = "22px Inter, Arial, sans-serif";
    ctx.fillText("Chennai", 34, 164);
    drawWeatherIcon(ctx, w - 90, 80, state, isDay);
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "bold 34px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(temperature, w - 90, 160);
    ctx.font = "16px Inter, Arial, sans-serif";
    ctx.fillStyle = "#8a93a6";
    ctx.fillText(condition, w - 90, 186);
    ctx.textAlign = "left";
    ctx.fillStyle = "#1b2230";
    roundRect(ctx, 32, 220, w - 64, 60, 12);
    ctx.fill();
    ctx.fillStyle = "#8a93a6";
    ctx.font = "18px Inter, Arial, sans-serif";
    ctx.fillText("Now building", 52, 246);
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "bold 24px Inter, Arial, sans-serif";
    ctx.fillText("Svik", 52, 272);
  });
}
