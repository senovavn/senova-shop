export function Stars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating)
  return (
    <span className="text-[12.5px] text-muted">
      <span className="tracking-[1px] text-rating" aria-hidden>
        {'★'.repeat(full)}
        {'☆'.repeat(5 - full)}
      </span>{' '}
      <span className="sr-only">Đánh giá </span>
      {rating.toLocaleString('vi-VN')}
      <span className="sr-only">/5</span>
      {count !== undefined ? ` (${count.toLocaleString('vi-VN')})` : ''}
    </span>
  )
}
