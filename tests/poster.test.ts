import test from 'node:test'
import assert from 'node:assert/strict'
import { dimensions, parsePoster, physical, sample, templates } from '../src/domain/poster.ts'
import { posterHTML } from '../src/domain/export.ts'
const fonts = {
  bricolage: 'data:font/woff2;base64,AA==',
  dm: 'data:font/woff2;base64,AQ==',
  license: 'SIL OPEN FONT LICENSE Version 1.1',
}
test('poster recipes reconstruct bounded fields and reject invalid type, colors, and typography', () => {
  assert.deepEqual(parsePoster({ ...sample, provenance: { author: 'fixture' } }), sample)
  for (const patch of [
    { heading: ' ' },
    { heading: 'x'.repeat(101) },
    { template: 'unknown' },
    { shape: 'a4' },
    { font: 'remote' },
    { size: 111 },
    { leading: NaN },
    { tracking: 13 },
    { ink: 'red' },
  ])
    assert.throws(() => parsePoster({ ...sample, ...patch }))
})
test('physical print sizes preserve all preview aspect ratios and a 210 mm short edge', () => {
  for (const shape of ['portrait', 'square', 'landscape'] as const) {
    const d = dimensions(shape),
      mm = physical(shape)
    assert.equal(Math.min(mm.width, mm.height), 210)
    assert.ok(Math.abs(d.width / d.height - mm.width / mm.height) < 1e-12)
  }
  assert.deepEqual(dimensions('portrait'), { width: 840, height: 1188 })
  assert.equal(physical('portrait').height, 297)
})
test('standalone poster escapes user content and embeds complete local fonts without executable code', () => {
  const p = {
    ...sample,
    title: '<script>bad</script>',
    heading: '<img src=x onerror=bad>\nA & B',
    subtitle: '"quoted" <style>bad</style>',
  }
  const html = posterHTML(p, fonts, 'TP-1234ABCD')
  assert.ok(html.includes('&lt;img src=x onerror=bad&gt;\nA &amp; B'))
  assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(!html.includes('<img '))
  assert.equal((html.match(/@font-face/g) || []).length, 2)
  assert.ok(html.includes('@page{size:210.000mm 297.000mm'))
  assert.ok(html.includes('recipe-marker" content="TP-1234ABCD'))
  assert.throws(() => posterHTML(p, { ...fonts, dm: 'https://example.com/font' }, 'TP-1234ABCD'))
})
test('all compositions produce independent print documents with their selected layout and alignment', () => {
  for (const template of templates) {
    const html = posterHTML({ ...sample, template, align: 'right' }, fonts, 'TP-1234ABCD')
    assert.ok(html.includes(`poster ${template}`))
    assert.ok(html.includes('text-align:right'))
    assert.ok(html.includes('justify-content:flex-end'))
    assert.ok(html.includes('@media print'))
  }
})
