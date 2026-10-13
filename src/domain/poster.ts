export const templates = ['editorial', 'bold', 'quiet'] as const
export type Template = (typeof templates)[number]
export interface Poster {
  format: 'TP/1'
  title: string
  heading: string
  subtitle: string
  footer: string
  template: Template
  shape: 'portrait' | 'square' | 'landscape'
  font: 'bricolage' | 'dm'
  size: number
  leading: number
  tracking: number
  align: 'left' | 'center' | 'right'
  paper: string
  ink: string
  accent: string
}
export const sample: Poster = {
  format: 'TP/1',
  title: 'An ordinary afternoon',
  heading: 'The art\nof slowing down.',
  subtitle: 'A little room for the things that make an ordinary day feel lovely.',
  footer: 'SOMEWHERE QUIET · ANY ORDINARY AFTERNOON',
  template: 'editorial',
  shape: 'portrait',
  font: 'bricolage',
  size: 88,
  leading: 1.08,
  tracking: -2,
  align: 'left',
  paper: '#f4eddf',
  ink: '#343b34',
  accent: '#b36243',
}
export function parsePoster(value: unknown): Poster {
  if (!value || typeof value !== 'object') throw new Error('Use a TP/1 poster object.')
  const p = value as Poster
  for (const [key, max] of [
    ['title', 80],
    ['heading', 100],
    ['subtitle', 200],
    ['footer', 80],
  ] as const)
    if (
      typeof p[key] !== 'string' ||
      p[key].length > max ||
      ((key === 'title' || key === 'heading') && !p[key].trim())
    )
      throw new Error(
        'Use a title up to 80 characters, a heading up to 100, a subtitle up to 200, and a footer up to 80.',
      )
  if (
    p.format !== 'TP/1' ||
    !templates.includes(p.template) ||
    !['portrait', 'square', 'landscape'].includes(p.shape) ||
    !['bricolage', 'dm'].includes(p.font) ||
    !['left', 'center', 'right'].includes(p.align)
  )
    throw new Error('Choose a valid TP/1 composition, shape, font, and alignment.')
  if (
    !Number.isInteger(p.size) ||
    p.size < 24 ||
    p.size > 110 ||
    !Number.isFinite(p.leading) ||
    p.leading < 0.9 ||
    p.leading > 1.6 ||
    !Number.isFinite(p.tracking) ||
    p.tracking < -3 ||
    p.tracking > 12
  )
    throw new Error('Use 24–110 px type, 0.9–1.6 line height, and −3 to 12 px tracking.')
  if (![p.paper, p.ink, p.accent].every((v) => typeof v === 'string' && /^#[a-f0-9]{6}$/i.test(v)))
    throw new Error('Use six-digit HEX paper, ink, and accent colors.')
  return {
    format: 'TP/1',
    title: p.title,
    heading: p.heading,
    subtitle: p.subtitle,
    footer: p.footer,
    template: p.template,
    shape: p.shape,
    font: p.font,
    size: p.size,
    leading: p.leading,
    tracking: p.tracking,
    align: p.align,
    paper: p.paper,
    ink: p.ink,
    accent: p.accent,
  }
}
export function dimensions(shape: Poster['shape']) {
  return shape === 'square'
    ? { width: 900, height: 900 }
    : shape === 'landscape'
      ? { width: 1200, height: 800 }
      : { width: 840, height: 1188 }
}
export function layout(template: Template) {
  return template === 'bold'
    ? { inset: 62, weight: 750, border: 0, decoration: 'block' }
    : template === 'quiet'
      ? { inset: 82, weight: 450, border: 2, decoration: 'circle' }
      : { inset: 66, weight: 600, border: 0, decoration: 'line' }
}
export const fontNames = { bricolage: 'Bricolage Grotesque Variable', dm: 'DM Sans Variable' }
export function physical(shape: Poster['shape']) {
  const d = dimensions(shape),
    factor = 210 / Math.min(d.width, d.height)
  return { width: d.width * factor, height: d.height * factor, factor }
}
