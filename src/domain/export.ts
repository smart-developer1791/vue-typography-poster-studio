import { dimensions, fontNames, layout, parsePoster, physical, type Poster } from './poster.ts'
export interface Fonts {
  bricolage: string
  dm: string
  license: string
}
const escape = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
export function posterHTML(input: Poster, fonts: Fonts, marker: string) {
  const p = parsePoster(input),
    d = dimensions(p.shape),
    l = layout(p.template),
    mm = physical(p.shape),
    unit = (n: number) => `calc(var(--unit) * ${n})`
  for (const data of [fonts.bricolage, fonts.dm])
    if (!/^data:font\/woff2;base64,[a-zA-Z0-9+/=]+$/.test(data))
      throw new Error('Bundle both local WOFF2 fonts before exporting.')
  if (typeof fonts.license !== 'string' || !fonts.license.trim())
    throw new Error('Include the bundled font licenses.')
  if (!/^TP-[A-F0-9]{8}$/.test(marker)) throw new Error('Use a valid TP recipe marker.')
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="CodeSculptor"><meta name="project" content="vue-typography-poster-studio"><meta name="recipe-marker" content="${marker}"><title>${escape(p.title)} · Type &amp; Paper</title><style>
@font-face{font-family:'Bricolage Grotesque Variable';font-style:normal;font-weight:200 800;src:url('${fonts.bricolage}') format('woff2')}
@font-face{font-family:'DM Sans Variable';font-style:normal;font-weight:100 1000;src:url('${fonts.dm}') format('woff2')}
*{box-sizing:border-box}body{margin:0;padding:24px;background:#deddd8;font-family:'DM Sans Variable',sans-serif}.poster{--unit:1px;width:${unit(d.width)};height:${unit(d.height)};padding:${unit(l.inset)};background:${p.paper};color:${p.ink};position:relative;overflow:hidden;display:grid;grid-template-rows:${unit(64)} minmax(0,1fr) ${unit(90)};margin:auto;text-align:${p.align};border:${unit(l.border)} solid ${p.accent}}
.kicker{font-size:${unit(14)};letter-spacing:${unit(4)};text-align:left;color:${p.accent};position:relative;z-index:1}.message{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:center;min-height:0;overflow:hidden;gap:${unit(32)}}.heading{font-family:'${fontNames[p.font]}',sans-serif;font-size:${unit(p.size)};font-weight:${l.weight};line-height:${p.leading};letter-spacing:${unit(p.tracking)};margin:0;white-space:pre-line;overflow-wrap:anywhere}.subtitle{font-size:${unit(23)};line-height:1.6;margin:0;white-space:pre-line}.footer{font-size:${unit(12)};letter-spacing:${unit(2)};position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:${p.align === 'left' ? 'flex-start' : p.align === 'right' ? 'flex-end' : 'center'};line-height:1.8}.decoration{position:absolute;pointer-events:none;background:${p.accent};opacity:.2;${p.template === 'bold' ? `height:${unit(180)};width:${unit(180)};top:${unit(110)};right:${unit(-38)};transform:rotate(-15deg)` : p.template === 'quiet' ? `height:${unit(400)};width:${unit(400)};bottom:${unit(-120)};right:${unit(-140)};border-radius:50%` : `height:${unit(6)};width:${unit(160)};bottom:${unit(180)};left:${unit(l.inset)}`}}
@page{size:${mm.width.toFixed(3)}mm ${mm.height.toFixed(3)}mm;margin:0}@media print{body{padding:0;background:none}.poster{--unit:${mm.factor}mm;margin:0;print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style></head><body><article class="poster ${p.template}" aria-label="${escape(p.title)}"><div class="kicker">TYPE &amp; PAPER / ${p.template.toUpperCase()}</div><div class="message"><h1 class="heading">${escape(p.heading)}</h1><p class="subtitle">${escape(p.subtitle)}</p></div><div class="footer">${escape(p.footer)}</div><span class="decoration" aria-hidden="true"></span></article><template id="font-licenses"><pre>${escape(fonts.license)}</pre></template></body></html>\n`
}
