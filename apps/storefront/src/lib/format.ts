const vnd = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })

/** Integer VND → "149.000₫" (SENOVA convention, no space before the sign). */
export function formatVnd(amount: number): string {
  return `${vnd.format(Math.round(amount))}₫`
}
