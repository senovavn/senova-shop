import { expect, test } from '@playwright/test'

const prices = async (page: import('@playwright/test').Page) =>
  (await page.locator('main ul li article p span.font-bold').allTextContents()).map((t) => Number(t.replace(/\D/g, '')))

test.describe('catalog & search (SPEC_UX › Danh mục & tìm kiếm)', () => {
  test('search suggests up to 5 accent-insensitive matches plus "see all"', async ({ page }, info) => {
    test.skip(info.project.name === 'phone', 'Header search box is hidden on phones; phones search from home')
    await page.goto('/')
    const box = page.getByRole('combobox', { name: 'Tìm kiếm' })
    await box.fill('ly giu nhiet')
    const options = page.getByRole('listbox', { name: 'Gợi ý tìm kiếm' }).getByRole('option')
    await expect(options.first()).toContainText('Ly giữ nhiệt')
    expect(await options.count()).toBeLessThanOrEqual(6)
    await expect(options.last()).toHaveText('Xem tất cả kết quả')
    await box.press('Enter')
    await expect(page).toHaveURL(/\/search\?q=ly(\+|%20)giu(\+|%20)nhiet/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kết quả cho “ly giu nhiet”')
  })

  test('phone search from the home header', async ({ page }, info) => {
    test.skip(info.project.name !== 'phone')
    await page.goto('/')
    await page.locator('#home-q').fill('nen thom')
    await page.locator('#home-q').press('Enter')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kết quả cho “nen thom”')
    await expect(page.getByRole('heading', { level: 3 }).first()).toContainText('Nến thơm')
  })

  test('category filters by budget and sorts by price', async ({ page }) => {
    await page.goto('/c/nha-cua?budget=150k-300k&sort=price_asc')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nhà cửa')
    const p = await prices(page)
    expect(p.length).toBeGreaterThan(0)
    expect(p.every((x) => x >= 150000 && x < 300000)).toBe(true)
    expect([...p].sort((a, b) => a - b)).toEqual(p)
  })

  test('filters apply from the UI (sidebar on desktop, dialog elsewhere)', async ({ page }, info) => {
    await page.goto('/collection/hot')
    if (info.project.name === 'desktop') {
      await page.getByRole('form', { name: 'Bộ lọc' }).getByLabel('Dưới 150K').check()
    } else {
      await page.getByRole('button', { name: 'Bộ lọc' }).click()
      const dialog = page.getByRole('dialog', { name: 'Bộ lọc' })
      await dialog.getByLabel('Dưới 150K').check()
      await dialog.getByRole('button', { name: 'Áp dụng bộ lọc' }).click()
    }
    await expect(page).toHaveURL(/budget=duoi-150k/)
    expect((await prices(page)).every((x) => x < 150000)).toBe(true)
  })

  test('empty results offer a way out', async ({ page }) => {
    await page.goto('/search?q=khong-co-mon-nay')
    await expect(page.getByRole('heading', { name: 'Chưa có món phù hợp' })).toBeVisible()
    await page.getByRole('button', { name: 'Tìm quà trong 3 chạm' }).click()
    await expect(page.locator('dialog[open]')).toContainText('Chọn người nhận, dịp và ngân sách')
  })

  test('unknown category is a 404', async ({ page }) => {
    const res = await page.goto('/c/khong-ton-tai')
    expect(res?.status()).toBe(404)
  })

  test('quick view opens from a card on desktop', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'Quick view buttons show on hover-capable desktops')
    await page.goto('/collection/hot')
    const card = page.locator('article').first()
    const dialog = page.getByRole('dialog', { name: /^Xem nhanh:/ })
    // Retry until hydrated and the lazily loaded QuickView chunk has arrived.
    await expect(async () => {
      await card.hover()
      await card.getByRole('button', { name: 'Xem nhanh' }).click()
      await expect(dialog).toBeVisible({ timeout: 2000 })
    }).toPass({ timeout: 20_000 })
    await expect(dialog.getByRole('link', { name: 'Xem chi tiết' })).toBeVisible()
    await dialog.getByRole('button', { name: 'Thêm vào giỏ' }).click()
    await expect(page.getByRole('banner').getByRole('link', { name: /Giỏ hàng/ })).toContainText('1')
  })
})
