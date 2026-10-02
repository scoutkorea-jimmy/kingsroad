// Worker의 dailySeries/hourlySeries 키는 UTC다. 브라우저 시간대와 무관하게 집계한다.
export function pageViewSeries(summary, days, now = Date.now()) {
  const hourly = days === 1;
  const step = hourly ? 3600000 : 86400000;
  const length = hourly ? 24 : days;
  const end = Math.floor(now / step) * step;
  const start = end - (length - 1) * step;
  const counts = Array(length).fill(0);
  for (const row of (hourly ? summary.hourlySeries : summary.dailySeries) || []) {
    const stamp = Date.parse(hourly ? `${row.hour}:00:00Z` : `${row.day}T00:00:00Z`);
    const index = Math.floor((stamp - start) / step);
    if (Number.isFinite(stamp) && index >= 0 && index < length) counts[index] += Number(row.views) || 0;
  }
  const labels = counts.map((_, index) => {
    const stamp = start + index * step;
    if (hourly) return index === length - 1 ? '지금' : `${new Date(stamp + 9 * 3600000).getUTCHours()}시`;
    const date = new Date(stamp);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  });
  return { counts, labels };
}
