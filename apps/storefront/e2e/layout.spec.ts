import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Routes linked from the shell that later sprints build; their prefetch 404s are expected until then.
const isPendingRoute404 = (text: string) => text.startsWith('Failed to load resource')

test.describe('app shell', () => {
  test('renders marquee, header, footer and hot products without script errors', async ({ page }, info) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && !isPendingRoute404(m.text()) && errors.push(m.text()))

    await page.goto('/')
    await expect(page).toHaveTitle('SENOVA · Little Things, Better Days.')
    await expect(page.getByRole('region', { name: 'Ưu đãi', exact: true })).toContainText('Freeship đơn từ 299.000₫')
    await expect(page.getByRole('banner').getByRole('link', { name: 'Trang chủ SENOVA' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Đang hot tuần này' })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Đang hot tuần này' }).locator(':scope > li')).toHaveCount(8)
    await expect(page.getByRole('contentinfo')).toContainText('Mua sắm')

    await page.screenshot({ path: `test-results/shell-${info.project.name}.png`, fullPage: false })
    expect(errors).toEqual([])
  })

  test('shows the right navigation for each viewport', async ({ page }, info) => {
    await page.goto('/')
    const header = page.getByRole('banner')
    const catNav = header.getByRole('navigation', { name: 'Danh mục' })
    const search = header.getByRole('combobox', { name: 'Tìm kiếm' })
    const bottomNav = page.getByRole('navigation', { name: 'Điều hướng nhanh' })
    const menuBtn = header.getByRole('button', { name: 'Danh mục' })

    if (info.project.name === 'desktop') {
      await expect(catNav).toBeVisible()
      await expect(menuBtn).toBeHidden()
      await expect(search).toBeVisible()
      await expect(bottomNav).toBeHidden()
    } else if (info.project.name === 'tablet') {
      await expect(catNav).toBeHidden()
      await expect(menuBtn).toBeVisible()
      await expect(search).toBeVisible()
      await expect(bottomNav).toBeHidden()
    } else {
      await expect(catNav).toBeHidden()
      await expect(search).toBeHidden()
      await expect(bottomNav).toBeVisible()
      await expect(bottomNav.getByRole('button', { name: 'Tìm quà' })).toBeVisible()
    }
  })

  test('opens the category menu and closes it with Escape', async ({ page }, info) => {
    test.skip(info.project.name === 'desktop', 'Desktop shows categories inline')
    await page.goto('/')
    await page.getByRole('banner').getByRole('button', { name: 'Danh mục' }).click()
    const dialog = page.getByRole('dialog', { name: 'Danh mục' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Quà tặng' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('keeps header height fixed while scrolling (no layout shift)', async ({ page }) => {
    await page.goto('/')
    const header = page.getByRole('banner')
    const before = (await header.boundingBox())!.height
    await page.mouse.wheel(0, 600)
    await expect(header).toHaveAttribute('data-scrolled', 'true')
    expect((await header.boundingBox())!.height).toBe(before)
  })

  test('has no serious accessibility violations', async ({ page }) => {
    await page.goto('/')
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
})

test('no horizontal overflow on any viewport', async ({ page }) => {
  for (const path of ['/', '/c/qua-tang', '/p/day-chuyen-mat-the-khac-ten']) {
    await page.goto(path)
    // Controls and headings must stay on screen unless they live in a horizontal scroller or a hidden slide.
    const offenders = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const inScroller = (el: Element) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const ox = getComputedStyle(p).overflowX
          if (ox === 'auto' || ox === 'scroll') return true
          if (p.getAttribute('aria-hidden') === 'true') return true
        }
        return false
      }
      return [...document.querySelectorAll('main :is(a, button, input, select, h1, h2, h3)')]
        .filter((el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().right > vw + 1 && !inScroller(el))
        .slice(0, 3)
        .map((el) => el.outerHTML.slice(0, 120))
    })
    expect(offenders, path).toEqual([])
  }
})
