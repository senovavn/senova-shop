import { expect, test, type Page } from '@playwright/test'

const sheet = (page: Page) => page.locator('dialog[open]')

test.describe('home (SPEC_UX › Trang chủ)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('super header: greeting, occasion countdown, delivery province', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/^Chào buổi (sáng|trưa|chiều|tối), bạn/)
    await expect(page.getByText(/Còn \d+ ngày tới/).first()).toBeVisible()
    await page.getByRole('button', { name: /Giao tới:/ }).click()
    await expect(sheet(page)).toContainText('Hỏa tốc 2 giờ')
    await sheet(page).getByRole('combobox').selectOption('Huế')
    await expect(sheet(page)).toContainText('Khu vực này giao tiêu chuẩn')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Giao tới: Huế ▾' })).toBeVisible()
  })

  test('banner: dots and arrow keys switch slides', async ({ page }) => {
    const carousel = page.getByRole('region', { name: 'Ưu đãi nổi bật' })
    const dots = carousel.getByRole('button', { name: /^Banner \d/ })
    await expect(dots).toHaveCount(4)
    await dots.nth(2).click()
    await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true')
    await carousel.press('ArrowRight')
    await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true')
  })

  test('banner rotates after interaction and can be paused', async ({ page }) => {
    test.slow()
    const carousel = page.getByRole('region', { name: 'Ưu đãi nổi bật' })
    const first = carousel.getByRole('button', { name: /^Banner 1/ })
    await page.waitForTimeout(5600)
    await expect(first).toHaveAttribute('aria-current', 'true') // no rotation before engagement (protects LCP)
    await page.mouse.wheel(0, 40)
    await expect(first).toHaveAttribute('aria-current', 'false', { timeout: 7000 })
    await carousel.getByRole('button', { name: 'Tạm dừng tự chuyển banner' }).click()
    const current = await carousel.locator('button[aria-current="true"]').getAttribute('aria-label')
    await page.mouse.move(0, 0)
    await page.waitForTimeout(5600)
    await expect(carousel.locator('button[aria-current="true"]')).toHaveAttribute('aria-label', current!)
    await expect(carousel.getByRole('button', { name: 'Tiếp tục tự chuyển banner' })).toBeVisible()
  })

  test('every enabled utility opens a sheet with a usable primary action', async ({ page }) => {
    const tiles = page.getByRole('list', { name: 'Tiện ích' }).getByRole('button')
    const n = await tiles.count()
    expect(n).toBe(9)
    for (let i = 0; i < n; i++) {
      await tiles.nth(i).click()
      const s = sheet(page)
      await expect(s).toBeVisible()
      await expect(s.getByRole('heading', { level: 2 })).toBeVisible()
      await expect(s.locator('a[href], button:not([aria-label="Đóng"]), select').first()).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(s).toBeHidden()
    }
  })

  test('stories: viewer advances, Esc closes, ring marked as seen', async ({ page }) => {
    await page.getByRole('list', { name: 'Story' }).getByRole('button').first().click()
    const viewer = page.getByRole('dialog', { name: /^Story / })
    await expect(viewer).toBeVisible()
    await expect(viewer.getByRole('link', { name: 'Mua ngay' })).toBeVisible()
    await viewer.getByRole('button', { name: 'Khung sau' }).click()
    await page.keyboard.press('Escape')
    await expect(viewer).toBeHidden()
    await expect(page.getByRole('list', { name: 'Story' }).getByRole('button').first()).toContainText('(đã xem)')
  })

  test('for-you cards: at most 6, one action each, cart card appears after adding', async ({ page }) => {
    const section = page.locator('section', { has: page.getByRole('heading', { name: 'Dành cho bạn' }) })
    await expect(section.getByRole('listitem')).toHaveCount(3)
    await expect(section.getByRole('listitem').first()).toContainText(/Còn \d+ ngày tới/)
    await page.evaluate(() => localStorage.setItem('senova:cart', JSON.stringify([{ sku: 'SN-001-SAGE', productId: 'sn-001', slug: 'ly-giu-nhiet-900ml-co-quai-ong-hut', qty: 1 }])))
    await page.reload()
    await expect(section.getByRole('listitem').first()).toContainText('Còn 1 món trong giỏ')
    await expect(section.getByRole('listitem').first()).toContainText('thiếu 10.000₫ để freeship')
    for (const card of await section.getByRole('listitem').all()) await expect(card.locator('a, button')).toHaveCount(1)
  })

  test('voucher wallet: save then use', async ({ page }) => {
    const wallet = page.locator('section', { has: page.getByRole('heading', { name: 'Kho voucher' }) })
    const ticket = wallet.getByRole('listitem').filter({ hasText: 'SENOVA10' })
    await ticket.getByRole('button', { name: 'Lưu mã' }).click()
    await expect(ticket.getByRole('button', { name: 'Dùng ngay' })).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'Đã lưu mã SENOVA10' })).toBeVisible()
  })

  test('gift finder count matches the suggestion page', async ({ page }) => {
    const finder = page.locator('section', { has: page.getByRole('heading', { name: 'Tìm quà trong 3 chạm' }) })
    await finder.getByRole('button', { name: 'Gia đình' }).click()
    await finder.getByRole('button', { name: 'Dưới 150K' }).click()
    await expect(finder.locator('p[aria-busy="false"]')).toHaveText(/^\d+ món phù hợp$/)
    const count = Number((await finder.getByText(/món phù hợp/).textContent())!.match(/\d+/)![0])
    await finder.getByRole('link', { name: 'Xem gợi ý' }).click()
    await expect(page).toHaveURL(/\/finder\?rec=gia-dinh&budget=duoi-150k/)
    await expect(page.getByRole('status').filter({ hasText: 'sản phẩm' })).toHaveText(`${count} sản phẩm`)
    await expect(page.getByText('Dành cho: Gia đình · Dưới 150K')).toBeVisible()
  })

  test('hot ranking is ordered by sales and flash sale counts down', async ({ page }) => {
    const hot = page.getByRole('list', { name: 'Đang hot tuần này' })
    await expect(hot.getByRole('heading', { level: 3 }).first()).toContainText('Hạng 1:')
    const sold = await hot.locator('text=/đã bán/').allTextContents()
    const nums = sold.map((t) => Number(t.replace(/\D/g, '')))
    expect([...nums].sort((a, b) => b - a)).toEqual(nums)
    const timer = page.getByRole('timer')
    await expect(timer).toHaveAttribute('aria-label', /^Còn \d+ giờ \d+ phút$/)
  })
})
