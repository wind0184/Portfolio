const starCanvas = document.getElementById("starfield");
const starContext = starCanvas.getContext("2d");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const pointer = { x: 0, y: 0 };
const stars = [];
let frameHandle = 0;
let lastFrame = 0;
let elapsed = 0;
let width = 0;
let height = 0;

function prepareStars() {
  const ratio = Math.min(devicePixelRatio, 2);
  width = innerWidth;
  height = innerHeight;
  starCanvas.width = width * ratio;
  starCanvas.height = height * ratio;
  starContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars.length = 0;
  let seed = 1741;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const count = Math.min(330, Math.round((width * height) / 4000));
  for (let index = 0; index < count; index++) {
    stars.push({
      x: random() * width,
      y: random() * height,
      radius: 0.3 + random() * 0.85,
      alpha: 0.17 + random() * 0.52,
      phase: random() * Math.PI * 2,
      depth: random(),
    });
  }
  drawStars();
}

function drawStars() {
  starContext.clearRect(0, 0, width, height);
  for (const star of stars) {
    const brightness =
      star.alpha * (0.82 + Math.sin(elapsed * 0.35 + star.phase) * 0.18);
    starContext.fillStyle = `rgba(200,220,255,${brightness})`;
    starContext.beginPath();
    starContext.arc(
      star.x + pointer.x * star.depth * 6,
      star.y + pointer.y * star.depth * 6,
      star.radius,
      0,
      Math.PI * 2,
    );
    starContext.fill();
  }
}

function drawFrame(time) {
  const delta = Math.min((time - lastFrame) / 1000, 0.05);
  lastFrame = time;
  elapsed += delta;
  drawStars();
  if (!motionPreference.matches && !document.hidden)
    frameHandle = requestAnimationFrame(drawFrame);
}

function restartAnimation() {
  cancelAnimationFrame(frameHandle);
  if (document.hidden) return;
  lastFrame = performance.now();
  drawFrame(lastFrame);
}

prepareStars();
restartAnimation();
addEventListener("resize", prepareStars);
addEventListener("pointermove", (event) => {
  if (motionPreference.matches || event.pointerType !== "mouse") return;
  pointer.x = event.clientX / innerWidth - 0.5;
  pointer.y = event.clientY / innerHeight - 0.5;
});
motionPreference.addEventListener("change", restartAnimation);
document.addEventListener("visibilitychange", restartAnimation);
