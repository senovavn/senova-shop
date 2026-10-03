import { expect, test } from '@playwright/test'

const NECKLACE = '/p/day-chuyen-mat-the-khac-ten' // sn-009: engravable, "Vàng" out of stock, "Bạc" 7 left

test.describe('product page (SPEC_UX › Trang sản phẩm)', () => {
  test('variants, engraving preview, quantity capped by stock, add to cart', async ({ page }, info) => {
    await page.goto(NECKLACE)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dây chuyền mặt thẻ khắc tên')
    await expect(page.getByRole('button', { name: /Vàng \(hết\)/ })).toBeDisabled()
    await expect(page.getByRole('button', { name: /Bạc/ })).toHaveAttribute('aria-pressed', 'true')

    const engrave = page.getByLabel(/Khắc chữ miễn phí/)
    await engrave.fill('HA 20.10 extra')
    await expect(engrave).toHaveValue('HA 20.10')
    await expect(page.locator('#engrave-preview')).toContainText('Xem trước: HA 20.10')

    const plus = page.getByRole('button', { name: 'Tăng số lượng' })
    for (let i = 0; i < 10; i++) if (await plus.isEnabled()) await plus.click()
    await expect(page.getByRole('status', { name: 'Số lượng' }).or(page.locator('output[aria-label="Số lượng"]'))).toHaveText('7')
    await expect(plus).toBeDisabled()

    const add = info.project.name === 'phone' ? page.getByRole('button', { name: 'Thêm', exact: true }) : page.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).first()
    await add.click()
    await expect(page.getByRole('status').filter({ hasText: 'Đã thêm' })).toBeVisible()
    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('senova:cart') ?? '[]'))
    expect(cart).toEqual([{ sku: 'SN-009-BAC', productId: 'sn-009', slug: 'day-chuyen-mat-the-khac-ten', qty: 7, engrave: 'HA 20.10' }])
  })

  test('engraving adds a processing day to the ETA; province changes it', async ({ page }) => {
    await page.goto(NECKLACE)
    const eta = page.locator('p[aria-live="polite"]').filter({ hasText: /Hỏa tốc|Nhận dự kiến/ })
    await expect(eta).toContainText('Hỏa tốc 2 giờ')
    await page.getByRole('combobox', { name: /Giao tới/ }).selectOption('Huế')
    const before = await eta.textContent()
    await page.getByLabel(/Khắc chữ miễn phí/).fill('MK')
    await expect(eta).not.toHaveText(before!)
    await expect(eta).toContainText('Nhận dự kiến')
  })

  test('tabs work with the keyboard', async ({ page }) => {
    await page.goto(NECKLACE)
    const desc = page.getByRole('tab', { name: 'Mô tả' })
    await desc.click()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Thông số' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toContainText('Đổi trả')
    await page.keyboard.press('End')
    await expect(page.getByRole('tabpanel')).toContainText('Có gói quà sẵn không?')
  })

  test('bundle adds every item; related products listed', async ({ page }) => {
    await page.goto('/p/ly-giu-nhiet-900ml-co-quai-ong-hut')
    await page.getByRole('button', { name: 'Thêm cả 3 vào giỏ' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Đã thêm 3 món vào giỏ' })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Có thể bạn cũng thích' }).getByRole('listitem').first()).toBeVisible()
  })

  test('SEO: JSON-LD Product/Offer + BreadcrumbList, no AggregateRating, canonical', async ({ page }) => {
    await page.goto(NECKLACE)
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)
    expect(ld[0]['@type']).toBe('Product')
    expect(ld[0].offers).toHaveLength(2)
    expect(ld[0].offers.map((o: { availability: string }) => o.availability)).toEqual(['https://schema.org/InStock', 'https://schema.org/OutOfStock'])
    expect(ld[0].aggregateRating).toBeUndefined()
    expect(ld[1]['@type']).toBe('BreadcrumbList')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://senovagifts.com${NECKLACE}`)
  })

  test('sticky buy bar on phones only', async ({ page }, info) => {
    await page.goto(NECKLACE)
    const bar = page.getByRole('button', { name: 'Thêm', exact: true })
    if (info.project.name === 'phone') await expect(bar).toBeVisible()
    else await expect(bar).toBeHidden()
  })

  test('unknown product is a 404', async ({ page }) => {
    expect((await page.goto('/p/khong-ton-tai'))?.status()).toBe(404)
  })
})
