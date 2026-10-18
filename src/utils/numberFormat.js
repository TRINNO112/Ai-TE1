/**
 * Format large numbers compactly to prevent text overflow in dashboards
 * e.g. 328649.989 -> '328.6k', 1250000 -> '1.3M'
 */
export function formatCompactNumber(val) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  const num = Number(val);
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return Math.round(num).toLocaleString();
}
