import Link from 'next/link'
import { t } from '@/i18n/t'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-3 text-muted">{t('notFound.body')}</p>
      <Link href="/" className="mt-6 inline-flex rounded-chip bg-plum px-6 py-3 font-semibold text-white hover:bg-plum-deep">
        {t('notFound.cta')}
      </Link>
    </div>
  )
}
