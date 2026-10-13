import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { sample } from '../../src/domain/poster.ts'
const key = 'typography-poster-studio:TP1'
const poster = (page) => page.locator('[data-ui~="poster-stage"] [data-poster]')
test('named CSS Modules and reactive CSS update one poster without touching other instances', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.locator('[data-ui~="poster-art"] [data-poster]').first()
  const heroColor = await hero.locator('h2').evaluate((el) => getComputedStyle(el).color)
  await page.getByLabel('The headline', { exact: true }).fill('A thought\nworth keeping.')
  await expect(poster(page).locator('h2')).toHaveText('A thought\nworth keeping.')
  await page.getByRole('button', { name: 'The rhythm', exact: true }).click()
  await page.getByLabel('Ink', { exact: true }).fill('#225588')
  await page.getByLabel('Composition', { exact: true }).selectOption('bold')
  await expect(poster(page).locator('h2')).toHaveCSS('color', 'rgb(34, 85, 136)')
  await expect(poster(page).locator('h2')).toHaveCSS('font-weight', '750')
  expect(await hero.locator('h2').evaluate((el) => getComputedStyle(el).color)).toBe(heroColor)
  expect(await poster(page).getAttribute('class')).toMatch(/_paper_/)
  await page.reload()
  await expect(poster(page).locator('h2')).toHaveText('A thought\nworth keeping.')
  await expect(poster(page).locator('h2')).toHaveCSS('color', 'rgb(34, 85, 136)')
})
test('downloaded HTML runs independently with embedded fonts, escaped words, and print sizing', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await page
    .getByLabel('The headline', { exact: true })
    .fill('<img src=x onerror=alert(1)>\nA quiet day.')
  const wait = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download print HTML', exact: true }).click()
  const file = await wait
  const html = await readFile((await file.path())!, 'utf8')
  expect(file.suggestedFilename()).toMatch(/TP-[A-F0-9]{8}\.html$/)
  expect(html).toContain('data:font/woff2;base64,')
  expect(html).toContain('SIL OPEN FONT LICENSE')
  const standalone = await context.newPage()
  const network: string[] = []
  standalone.on('request', (r) => {
    if (/^https?:/.test(r.url())) network.push(r.url())
  })
  await standalone.setContent(html)
  await standalone.evaluate(() => document.fonts.ready)
  await expect(standalone.locator('h1')).toHaveText('<img src=x onerror=alert(1)>\nA quiet day.')
  expect(await standalone.locator('script,img').count()).toBe(0)
  expect(network).toEqual([])
  expect(
    await standalone.evaluate(() => document.fonts.check('88px "Bricolage Grotesque Variable"')),
  ).toBe(true)
  await standalone.emulateMedia({ media: 'print' })
  expect(
    await standalone.locator('.poster').evaluate((el) => parseFloat(getComputedStyle(el).width)),
  ).toBeCloseTo(793.7, 0)
  await standalone.close()
})
test('JSON export contains editable typography and failed imports preserve saved words', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Poster title', { exact: true }).fill('A poster to keep')
  await page.getByRole('button', { name: 'Export', exact: true }).click()
  const wait = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download poster JSON', exact: true }).click()
  const json = JSON.parse(await readFile((await (await wait).path())!, 'utf8'))
  expect(json.heading).toBe(sample.heading)
  expect(json.provenance.project).toBe('vue-typography-poster-studio')
  expect(json.provenance.marker).toMatch(/^TP-[A-F0-9]{8}$/)
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click()
  await page.getByRole('button', { name: 'Import', exact: true }).click()
  await page.getByLabel('Or paste TP/1 JSON').fill(JSON.stringify({ ...sample, leading: 4 }))
  await page.getByRole('button', { name: 'Import poster', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('line height')
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click()
  await expect(page.getByLabel('Poster title', { exact: true })).toHaveValue('A poster to keep')
})
test('mobile tabs, compositions, and paper shapes keep preview and editor geometry stable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 850 })
  await page.goto('/')
  const editor = await page.locator('[data-ui~="editor-pane"]').boundingBox(),
    stage = await page.locator('[data-ui~="poster-stage"]').boundingBox()
  await page.getByRole('button', { name: 'The rhythm', exact: true }).click()
  await page.getByLabel('Paper shape', { exact: true }).selectOption('landscape')
  await page.getByLabel('Composition', { exact: true }).selectOption('quiet')
  const after = await page.locator('[data-ui~="editor-pane"]').boundingBox(),
    changed = await page.locator('[data-ui~="poster-stage"]').boundingBox()
  expect(after!.height).toBe(editor!.height)
  expect(changed!.height).toBe(stage!.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).shape, key)).toBe(
    'landscape',
  )
})
