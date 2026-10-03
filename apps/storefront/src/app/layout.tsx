import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro, Bricolage_Grotesque } from 'next/font/google'
import { getConfig } from '@/api/client'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Marquee } from '@/components/layout/Marquee'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { t } from '@/i18n/t'
import tokens from '@senova/tokens/senova.json'
import './globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})
const body = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL('https://senovagifts.com'),
  title: { default: 'SENOVA · Little Things, Better Days.', template: '%s · SENOVA' },
  description: 'SENOVA: phụ kiện và quà tặng nhỏ xinh, gói quà miễn phí, khắc tên, giao nhanh toàn quốc.',
  openGraph: {
    siteName: 'SENOVA',
    locale: 'vi_VN',
    type: 'website',
    description: 'Món nhỏ đẹp, hữu ích và đáng tặng, được SENOVA chọn kỹ.',
  },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: tokens.color.bg },
    { media: '(prefers-color-scheme: dark)', color: tokens.colorDark.bg },
  ],
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const config = await getConfig()
  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body className="pb-16 sm:pb-0">
        <a
          href="#main"
          className="sr-only z-50 rounded-chip bg-plum px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {t('a11y.skip')}
        </a>
        <Marquee items={config.marquee} />
        <Header nav={config.nav} />
        <main id="main">{children}</main>
        <Footer footer={config.footer} />
        <BottomNav />
        <MobileMenu nav={config.nav} />
      </body>
    </html>
  )
}
