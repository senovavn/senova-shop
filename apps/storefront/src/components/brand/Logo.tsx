import { LOGO_INNER, LOGO_VIEWBOX } from './brand-svg'

/** SENOVA wordmark; letters follow `currentColor`, the spark stays Sunbeam. `uid` keeps mask ids unique per page. */
export function Logo({ uid, className, title = 'SENOVA' }: { uid: string; className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role="img"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: LOGO_INNER.replaceAll('__ID__', `senova-logo-${uid}`) }}
    />
  )
}
