let lastRun = 0;

export function canRun() {
  const now = Date.now();
  const diff = now - lastRun;

  // حد أدنى 10 دقائق بين التشغيل
  if (diff < 10 * 60 * 1000) {
    return false;
  }

  lastRun = now;
  return true;
}
