// H2V pipeline Version - 1

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  // Load local file ( Relative path is added, you can use absolute paths as well )
  const filePath = `file://${path.resolve("./index.html")}`;
  await page.goto(filePath, { waitUntil: "networkidle0" });

  // Expand all <details>
  await page.$$eval("details", (details) => details.forEach((d) => (d.open = true)));

  // Setup frames directory
  const framesDir = "./frames";
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);

  let frameCount = 0;
  const captureFrame = async (pause = 200) => {
    await page.screenshot({
      path: `${framesDir}/frame-${String(frameCount).padStart(5, "0")}.png`,
    });
    frameCount++;
    await new Promise((r) => setTimeout(r, pause));
  };

  // Inject overlays and animations
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes circuitPulse {
        0% { opacity: 0.2; }
        50% { opacity: 0.6; }
        100% { opacity: 0.2; }
      }
    `;
    document.head.appendChild(style);

    // Background gradient
    const bg = document.createElement("div");
    bg.id = "bg-overlay";
    Object.assign(bg.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #0f0f23, #1a1a40, #292973)",
      backgroundSize: "400% 400%",
      animation: "gradientShift 15s ease infinite",
      opacity: "0",
      transition: "opacity 1s ease",
      zIndex: "8000",
    });
    document.body.appendChild(bg);

    // Circuit grid
    const circuit = document.createElement("div");
    circuit.id = "circuit-overlay";
    Object.assign(circuit.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundImage:
        "radial-gradient(circle, rgba(0,255,255,0.2) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      animation: "circuitPulse 4s infinite",
      opacity: "0",
      transition: "opacity 1s ease",
      zIndex: "8500",
    });
    document.body.appendChild(circuit);

    // Fade overlay
    const overlay = document.createElement("div");
    overlay.id = "fade-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "black",
      opacity: "0",
      transition: "opacity 1s ease",
      pointerEvents: "none",
      zIndex: "9999",
    });
    document.body.appendChild(overlay);

    // Banner text
    const banner = document.createElement("div");
    banner.id = "banner-overlay";
    Object.assign(banner.style, {
      position: "fixed",
      top: "40%",
      width: "100%",
      textAlign: "center",
      color: "white",
      fontFamily: "Orbitron, sans-serif",
      fontSize: "60px",
      fontWeight: "bold",
      textShadow: "0px 0px 20px rgba(0,255,255,0.8)",
      opacity: "0",
      transition: "opacity 1s ease",
      zIndex: "9000",
    });
    document.body.appendChild(banner);
  });

  // Fade helpers
  const fadeInOverlay = async () => {
    await page.evaluate(() => {
      document.getElementById("fade-overlay").style.opacity = "1";
    });
    for (let i = 0; i < 5; i++) await captureFrame(200);
  };

  const fadeOutOverlay = async () => {
    await page.evaluate(() => {
      document.getElementById("fade-overlay").style.opacity = "0";
    });
    for (let i = 0; i < 5; i++) await captureFrame(200);
  };

  const showBackground = async () => {
    await page.evaluate(() => {
      document.getElementById("bg-overlay").style.opacity = "1";
      document.getElementById("circuit-overlay").style.opacity = "1";
    });
    for (let i = 0; i < 5; i++) await captureFrame(200);
  };

  const hideBackground = async () => {
    await page.evaluate(() => {
      document.getElementById("bg-overlay").style.opacity = "0";
      document.getElementById("circuit-overlay").style.opacity = "0";
    });
    for (let i = 0; i < 5; i++) await captureFrame(200);
  };

  const showBanner = async (text) => {
    await page.evaluate((txt) => {
      const banner = document.getElementById("banner-overlay");
      banner.innerText = txt;
      banner.style.opacity = "1";
    }, text);
    for (let i = 0; i < 10; i++) await captureFrame(300);
  };

  const hideBanner = async () => {
    await page.evaluate(() => {
      document.getElementById("banner-overlay").style.opacity = "0";
    });
    for (let i = 0; i < 5; i++) await captureFrame(300);
  };

  // Smooth zoom highlight
  const zoomSection = async (section) => {
    await page.evaluate((el) => {
      el.style.transition = "transform 2s ease-in-out, background 2s ease-in-out";
      el.style.transform = "scale(1.25)";
      el.style.background = "rgba(0,255,255,0.2)";
    }, section);

    for (let j = 0; j < 12; j++) await captureFrame(250);

    await page.evaluate((el) => {
      el.style.transform = "scale(1)";
      el.style.background = "transparent";
    }, section);

    for (let j = 0; j < 8; j++) await captureFrame(250);
  };

  // Ken Burns effect: pan & zoom across the whole viewport
  const kenBurns = async () => {
    await page.evaluate(() => {
      document.body.style.transition = "transform 6s ease-in-out";
      document.body.style.transformOrigin = "center center";
      document.body.style.transform = "scale(1.1) translate(-20px, -10px)";
    });
    for (let j = 0; j < 20; j++) await captureFrame(300);

    await page.evaluate(() => {
      document.body.style.transform = "scale(1) translate(0,0)";
    });
    for (let j = 0; j < 10; j++) await captureFrame(300);
  };

  // === INTRO ===
  await fadeInOverlay();
  await showBackground();
  await showBanner("🚀 The Rust Adventure");
  await showBanner("A Curriculum for Fearless Coders");
  await hideBanner();
  await hideBackground();
  await fadeOutOverlay();

  // === MAIN ===
  const daySections = await page.$$("summary .day-info h3");

  for (let i = 0; i < daySections.length; i++) {
    const section = daySections[i];

    await fadeInOverlay();
    await page.evaluate((el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, section);
    await new Promise((r) => setTimeout(r, 1500));
    await fadeOutOverlay();

    await zoomSection(section);

    // After highlighting, do a Ken Burns transition pan before next Day
    if (i < daySections.length - 1) {
      await kenBurns();
    }
  }

  // === OUTRO ===
  await fadeInOverlay();
  await showBackground();
  await showBanner("🎉 Thanks for Watching!");
  await showBanner("👉 Subscribe for More Rust Adventures!");
  await hideBanner();
  await hideBackground();
  await fadeOutOverlay();

  console.log(`✅ Captured ${frameCount} frames`);
  await browser.close();
})();
