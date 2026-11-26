import confetti from 'canvas-confetti';

export function celebrate(big = false) {
  const colors = ['#ff7aa2', '#ffc93c', '#6ec6ff', '#9b7bff', '#3cc47c'];
  confetti({ particleCount: big ? 160 : 60, spread: big ? 100 : 70, origin: { y: 0.6 }, colors, scalar: 1.1 });
  if (big) {
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 400);
  }
}

export function pawBurst() {
  const paw = confetti.shapeFromText({ text: '🐾', scalar: 2 });
  confetti({ shapes: [paw], scalar: 2, particleCount: 24, spread: 90, origin: { y: 0.55 } });
}
