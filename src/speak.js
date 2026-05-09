export function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.pitch = 1.15;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
