import bricolage from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url'
import dm from '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url'
import type { Fonts } from '../domain/export'
async function embedded(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('A local font could not be loaded. Try exporting again.')
  const bytes = new Uint8Array(await response.arrayBuffer())
  let text = ''
  for (const byte of bytes) text += String.fromCharCode(byte)
  return 'data:font/woff2;base64,' + btoa(text)
}
let pending: Promise<Fonts> | null = null
export function bundleFonts() {
  if (!pending)
    pending = Promise.all([
      embedded(bricolage),
      embedded(dm),
      fetch('/font-licenses.txt').then((response) => {
        if (!response.ok) throw new Error('Font licenses could not be loaded.')
        return response.text()
      }),
    ])
      .then(([bricolage, dm, license]) => ({ bricolage, dm, license }))
      .catch((error) => {
        pending = null
        throw error
      })
  return pending
}
