export function formatNumber(value: string, decimals: number): string {
  return (parseFloat(value) || 0).toFixed(decimals);
}
