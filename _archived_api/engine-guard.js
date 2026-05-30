let lastRun = 0;

export function canRun(interval = 300000) {
  const now = Date.now();

  if (now - lastRun < interval) {
    return false;
  }

  lastRun = now;
  return true;
}
