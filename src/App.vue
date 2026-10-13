<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppDialog from './components/AppDialog.vue'
import AppIcon from './components/AppIcon.vue'
import PosterCanvas from './components/PosterCanvas.vue'
import PosterPreview from './components/PosterPreview.vue'
import { parsePoster, physical, sample, templates, type Poster } from './domain/poster'
import { posterHTML } from './domain/export'
import { bundleFonts } from './services/fonts'
import { useDraft } from './services/draft'
import { clone, download, stamp } from './services/files'
const { draft, storageStatus } = useDraft(
    'typography-poster-studio:TP1',
    clone(sample),
    parsePoster,
  ),
  valid = ref<Poster>(parsePoster(draft.value)),
  problem = ref(''),
  tab = ref('words')
watch(
  draft,
  (v) => {
    try {
      valid.value = parsePoster(v)
      problem.value = ''
    } catch (e) {
      problem.value = (e as Error).message
    }
  },
  { deep: true, flush: 'sync' },
)
const marker = computed(() => stamp('TP', valid.value)),
  paperSize = computed(() => physical(valid.value.shape)),
  exchange = ref(false),
  importOpen = ref(false),
  restore = ref(false),
  importText = ref(''),
  importError = ref(''),
  exporting = ref(false),
  status = ref('An ordinary thought. A little more beautifully said.')
function exportJSON() {
  download(
    'type-and-paper.json',
    JSON.stringify(
      {
        ...valid.value,
        provenance: {
          project: 'vue-typography-poster-studio',
          author: 'CodeSculptor',
          marker: marker.value,
        },
      },
      null,
      2,
    ),
  )
}
async function exportHTML() {
  if (exporting.value || problem.value) return
  exporting.value = true
  try {
    const poster = clone(valid.value),
      id = stamp('TP', poster),
      fonts = await bundleFonts()
    download(`type-and-paper-${id}.html`, posterHTML(poster, fonts, id), 'text/html')
    status.value = 'Poster downloaded with its own styles and fonts.'
  } catch (e) {
    status.value = (e as Error).message
  } finally {
    exporting.value = false
  }
}
function importPoster() {
  try {
    draft.value = parsePoster(JSON.parse(importText.value))
    importOpen.value = false
    importError.value = ''
    status.value = 'A little composition imported.'
  } catch (e) {
    importError.value = (e as Error).message
  }
}
async function readFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 10000) {
    importError.value = 'Use poster JSON below 10 KB.'
    return
  }
  importText.value = await file.text()
}
function restoreSample() {
  draft.value = clone(sample)
  restore.value = false
  status.value = 'The ordinary afternoon restored.'
}
</script>
<template>
  <div
    class="[&_main]:max-w-380 [&_main]:py-0 [&_main]:px-9.5 [&_main]:my-0 [&_main]:mx-auto [@media(width<=700px)]:[&_main]:px-4 [@media(700px<width<=1100px)]:[&_main]:px-6"
  >
    <header
      class="min-h-21.5 flex items-center justify-between gap-6 border-b [border-bottom-style:solid] border-b-line bg-surface py-5 px-9.5 [@media(width<=700px)]:gap-4 [@media(width<=700px)]:flex-wrap [@media(width<=700px)]:p-4 [@media(700px<width<=1100px)]:py-4.5 [@media(700px<width<=1100px)]:px-6 [@media(1600px<=width)]:px-[max(38px,_calc((100vw_-_1444px)_/_2))]"
    >
      <a
        class="font-display flex gap-[13px] items-center text-[length:24px] font-[650] tracking-[-0.8px] [@media(width<=700px)]:text-[length:22px]"
        href="/"
        aria-label="Typography Poster Studio home"
        ><span
          class="w-10.5 h-10.5 rounded-[13px] bg-accent text-on-accent grid place-items-center text-[length:20px] relative [&_span]:text-[length:16px] [&_span]:absolute [&_span]:right-[5px] [&_span]:bottom-1"
          >Aa</span
        ><span
          >Type &amp; Paper<span
            class="block font-sans text-[length:8px] tracking-[1.5px] font-semibold text-muted mt-[3px]"
            >THE TYPOGRAPHY POSTER STUDIO</span
          ></span
        ></a
      >
      <div
        class="flex items-center gap-3 [@media(width<=700px)]:gap-2 [@media(width<=700px)]:w-full [@media(width<=700px)]:justify-end [@media(width<=700px)]:[&_>_button]:flex-1"
      >
        <span
          class="flex items-center gap-[7px] text-[length:11px] text-muted mr-3 [@media(width<=1100px)]:hidden"
          ><span class="inline-block w-1.5 h-1.5 rounded-[50%] bg-accent shrink-0" />{{
            storageStatus
          }}</span
        ><button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-line [transition:background_0.15s] bg-surface text-ink py-2.5 px-[15px] [&:hover]:bg-hover"
          @click="importOpen = true"
        >
          <AppIcon name="upload" />Import</button
        ><button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-accent text-on-accent py-2.5 px-[15px] [&:hover]:[filter:brightness(0.96)]"
          :disabled="!!problem"
          @click="exchange = true"
        >
          <AppIcon name="download" />Export
        </button>
      </div>
    </header>
    <main>
      <section
        class="flex justify-between items-center min-h-60 gap-8 py-8.5 px-0 [@media(width<=700px)]:min-h-auto [@media(width<=700px)]:py-7.5 [@media(700px<width<=1100px)]:min-h-55 [&_[data-ui~=eyebrow]]:mb-[15px] [&_>_div_>_p:last-child]:mt-4 [&_>_div_>_p:last-child]:text-[length:14px] [&_>_div_>_p:last-child]:text-muted [@media(width<=700px)]:[&_>_div_>_p:last-child]:text-[length:13px]"
      >
        <div>
          <p data-ui="eyebrow" class="text-[length:10px] font-[750] tracking-[1.8px] text-muted">
            GOOD WORDS DESERVE A LITTLE SPACE
          </p>
          <h1>An ordinary thought.<br /><span class="text-accent">Beautifully said.</span></h1>
          <p>Choose the words. Find their rhythm. Make something worth putting on paper.</p>
        </div>
        <div
          data-ui="poster-art"
          class="flex items-center gap-0 w-82.5 shrink-0 h-42.5 [@media(width<=700px)]:hidden [@media(width<=700px)]:w-[255px] [@media(700px<width<=1100px)]:w-[255px]"
          aria-hidden="true"
        >
          <div
            v-for="(template, i) in templates"
            :key="template"
            class="w-27.5 h-39 shadow-[3px_4px_12px_#44362020] border-[length:4px] border-solid border-[#fff] overflow-hidden shrink-0 [@media(width<=1100px)]:w-[85px] [@media(width<=1100px)]:h-30 [&_>_[data-poster]]:[transform:scale(0.122)] [&_>_[data-poster]]:origin-top-left [@media(width<=1100px)]:[&_>_[data-poster]]:[transform:scale(0.092)]"
            :style="{ transform: `rotate(${[-8, 0, 8][i]}deg)` }"
          >
            <PosterCanvas
              :poster="{
                ...sample,
                template,
                shape: 'portrait',
                paper: ['#e9dfcb', '#e2e8df', '#f4eddf'][i]!,
              }"
            />
          </div>
        </div>
      </section>
      <div
        class="grid grid-cols-[340px_minmax(0,_1fr)] gap-6.5 [@media(width<=700px)]:grid-cols-[1fr] [@media(width<=700px)]:gap-5 [@media(700px<width<=1100px)]:grid-cols-[300px_minmax(0,_1fr)] [@media(700px<width<=1100px)]:gap-5"
      >
        <section
          data-ui="editor-pane"
          class="bg-surface border border-solid border-line rounded-[var(--radius)] min-w-0 h-234 flex flex-col p-[23px] [@media(width<=700px)]:h-237.5 [@media(width<=700px)]:p-5 [@media(700px<width<=1100px)]:h-245 [&_[data-ui~=side-note]]:mt-5"
        >
          <div class="flex items-center justify-between gap-3 mb-2 [&_+_p]:mb-5">
            <h2>The words &amp; the rhythm</h2>
            <span
              class="text-[length:10px] font-semibold bg-hover border border-solid border-line rounded-[6px] whitespace-nowrap py-1 px-[7px]"
              >TP/1</span
            >
          </div>
          <div
            class="flex gap-2.5 border-b [border-bottom-style:solid] border-b-line mb-[15px] py-4 px-0 [&_button]:flex-1 [&_button]:bg-transparent [&_button]:border-0 [&_button]:rounded-[7px] [&_button]:text-[length:11px] [&_button]:text-muted [&_button]:py-2.5 [&_button]:px-[5px] [&_button.active]:bg-hover [&_button.active]:text-accent [&_button.active]:font-bold"
          >
            <button :class="{ active: tab === 'words' }" @click="tab = 'words'">The words</button
            ><button :class="{ active: tab === 'style' }" @click="tab = 'style'">The rhythm</button>
          </div>
          <div class="flex-1 min-h-0 overflow-auto p-[3px]">
            <div v-if="tab === 'words'">
              <label>Poster title<input v-model="draft.title" maxlength="80" /></label
              ><label
                >The headline<textarea v-model="draft.heading" maxlength="100" rows="4" /></label
              ><label
                >A little supporting line<textarea
                  v-model="draft.subtitle"
                  maxlength="200"
                  rows="4"
                /></label
              ><label
                >A final small note<textarea v-model="draft.footer" maxlength="80" rows="3" />
              </label>
              <p class="text-[length:11px] text-muted mt-3">
                A line break is a little pause. Use it to give your words a rhythm.
              </p>
            </div>
            <div v-else>
              <label
                >Composition<select v-model="draft.template" aria-label="Composition">
                  <option value="editorial">Editorial · a clear little voice</option>
                  <option value="bold">Bold · something worth saying</option>
                  <option value="quiet">Quiet · room to breathe</option>
                </select></label
              ><label
                >Paper shape<select v-model="draft.shape" aria-label="Paper shape">
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                  <option value="landscape">Landscape</option>
                </select></label
              ><label
                >Headline typeface<select v-model="draft.font" aria-label="Headline typeface">
                  <option value="bricolage">Bricolage Grotesque</option>
                  <option value="dm">DM Sans</option>
                </select></label
              ><label
                >Headline size · {{ draft.size }} px<input
                  v-model.number="draft.size"
                  type="range"
                  min="24"
                  max="110"
              /></label>
              <div class="grid grid-cols-2 gap-3.5">
                <label
                  >Line height<input
                    v-model.number="draft.leading"
                    type="number"
                    min="0.9"
                    max="1.6"
                    step="0.01" /></label
                ><label
                  >Letter spacing<input
                    v-model.number="draft.tracking"
                    type="number"
                    min="-3"
                    max="12"
                    step="0.5"
                /></label>
              </div>
              <label
                >Text alignment<select v-model="draft.align" aria-label="Text alignment">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select></label
              >
              <div class="grid grid-cols-[repeat(3,_1fr)] gap-3">
                <label>Paper<input v-model="draft.paper" type="color" /></label
                ><label>Ink<input v-model="draft.ink" type="color" /></label
                ><label>Accent<input v-model="draft.accent" type="color" /></label>
              </div>
            </div>
          </div>
          <p
            data-ui="side-note"
            class="border-t [border-top-style:solid] border-t-line pt-5 flex items-start gap-[9px] text-muted text-[length:11px] [&_svg]:text-accent [&_svg]:mt-[3px]"
          >
            <AppIcon name="check" />Three compositions, two local typefaces, and something all your
            own.
          </p>
        </section>
        <section>
          <div
            class="h-13.5 flex justify-between gap-[15px] items-start [@media(width<=700px)]:h-[75px] [@media(width<=700px)]:[&_h2]:max-w-45"
          >
            <h2>A little room for your words</h2>
            <span
              class="text-[length:10px] font-semibold bg-hover border border-solid border-line rounded-[6px] whitespace-nowrap py-1 px-[7px]"
              >{{ valid.template.toUpperCase() }}</span
            >
          </div>
          <PosterPreview :poster="valid" />
          <div
            class="flex items-center justify-between gap-4.5 border-b [border-bottom-style:solid] border-b-line py-[25px] px-0 [@media(width<=1100px)]:flex-wrap [&_>_span:nth-child(2)]:capitalize [&_b]:block [&_b]:not-italic [&_b]:font-[550] [&_b]:text-[length:20px] [&_b]:leading-[normal] [&_b]:font-[family-name:'Bricolage_Grotesque_Variable'] [@media(width<=700px)]:[&_b]:text-[length:16px] [&_small]:block [&_small]:text-[length:10px] [&_small]:text-muted [&_small]:mt-[5px] [&_button]:text-[length:12px] [&_button]:normal-case [@media(width<=1100px)]:[&_button]:w-full"
          >
            <span
              ><b>{{ paperSize.width.toFixed(0) }} × {{ paperSize.height.toFixed(0) }} mm</b
              ><small>the complete print page</small></span
            ><span
              ><b>{{ valid.shape }}</b
              ><small
                >{{ valid.align }} aligned ·
                {{ valid.font === 'dm' ? 'DM Sans' : 'Bricolage' }}</small
              ></span
            ><button
              class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-accent text-on-accent py-2.5 px-[15px] [&:hover]:[filter:brightness(0.96)]"
              :disabled="exporting || !!problem"
              @click="exportHTML"
            >
              <AppIcon name="download" />{{
                exporting ? 'Preparing fonts…' : 'Download print HTML'
              }}
            </button>
          </div>
          <div
            class="flex gap-[25px] items-center text-muted py-[27px] px-0 [@media(width<=1100px)]:gap-[15px] [&_>_span]:not-italic [&_>_span]:font-normal [&_>_span]:text-[length:75px] [&_>_span]:leading-[1] [&_>_span]:font-[family-name:'Bricolage_Grotesque_Variable'] [&_>_span]:text-accent [&_p]:text-[length:13px] [&_p]:max-w-112.5"
          >
            <span>“</span>
            <p>
              Give a thought some breathing room. Leave a little space around it. Let the words do
              the lovely part.
            </p>
          </div>
        </section>
      </div>
      <div
        class="min-h-17.5 flex justify-between items-center gap-5 border-b [border-bottom-style:solid] border-b-line text-[length:11px] text-muted py-5.5 px-0 [@media(width<=700px)]:items-start [@media(width<=700px)]:gap-2 [@media(width<=700px)]:flex-col [&_[data-ui~=mono]]:text-[length:10px] [&_[data-ui~=mono]]:whitespace-nowrap"
        aria-live="polite"
      >
        <span :class="{ 'text-danger': !!problem }">{{ problem || status }}</span
        ><span
          data-ui="mono"
          class="font-[family-name:ui-monospace,_SFMono-Regular,_Consolas,_monospace]"
          >{{ marker }}</span
        >
      </div>
      <footer
        class="flex justify-between gap-[15px] text-[length:9px] tracking-[1.3px] text-muted py-7.5 px-0 [@media(width<=700px)]:flex-col [@media(width<=700px)]:py-6 [&_>_span:first-child]:font-bold [&_>_span:first-child]:text-ink [&_[data-ui~=muted]]:font-normal [&_[data-ui~=muted]]:tracking-[0]"
      >
        <span>Words, given a little care. <span class="text-accent">CodeSculptor</span></span
        ><button
          class="inline-flex items-center justify-center gap-[9px] min-h-8 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-[transparent] text-muted py-[7px] px-0.5"
          @click="restore = true"
        >
          Restore the sample
        </button>
      </footer>
    </main>
    <AppDialog v-model="exchange" title="Give your words a place"
      ><p data-ui="muted" class="text-muted">
        The HTML contains the complete poster, print sizing, and embedded Latin fonts. Open it
        independently and use your browser's print command. JSON keeps the editable recipe.
      </p>
      <div
        class="flex flex-wrap gap-2.5 my-5 mx-0 [@media(width<=700px)]:[&_>_button]:flex-1 [@media(width<=700px)]:[&_>_button]:min-w-32.5"
      >
        <button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-accent text-on-accent py-2.5 px-[15px] [&:hover]:[filter:brightness(0.96)]"
          :disabled="exporting || !!problem"
          @click="exportHTML"
        >
          {{ exporting ? 'Preparing fonts…' : 'Download standalone HTML' }}</button
        ><button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-line [transition:background_0.15s] bg-surface text-ink py-2.5 px-[15px] [&:hover]:bg-hover"
          @click="exportJSON"
        >
          Download poster JSON
        </button>
      </div>
      <p data-ui="muted" class="text-muted text-[length:12px]">
        Choose the declared custom page size, 100% scale, margins off, and background graphics on.
        Printer margins may need a physical test sheet.
      </p></AppDialog
    >
    <AppDialog v-model="importOpen" title="Import a poster recipe"
      ><label
        >Choose poster JSON<input
          type="file"
          accept=".json,application/json"
          @change="readFile" /></label
      ><label
        >Or paste TP/1 JSON<textarea v-model="importText" rows="7" spellcheck="false" />
      </label>
      <p class="text-danger" role="alert">{{ importError }}</p>
      <div
        class="flex flex-wrap gap-2.5 my-5 mx-0 [@media(width<=700px)]:[&_>_button]:flex-1 [@media(width<=700px)]:[&_>_button]:min-w-32.5"
      >
        <button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-accent text-on-accent py-2.5 px-[15px] [&:hover]:[filter:brightness(0.96)]"
          @click="importPoster"
        >
          Import poster</button
        ><a
          href="/sample-workspace.json"
          download
          class="inline-flex items-center justify-center gap-[9px] min-h-8 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-[transparent] text-muted py-[7px] px-0.5"
          >Download sample JSON</a
        >
      </div></AppDialog
    >
    <AppDialog v-model="restore" title="Restore the ordinary afternoon?"
      ><p>This replaces your words, composition, typography, and colors on this device.</p>
      <div
        class="flex flex-wrap gap-2.5 my-5 mx-0 [@media(width<=700px)]:[&_>_button]:flex-1 [@media(width<=700px)]:[&_>_button]:min-w-32.5"
      >
        <button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-[transparent] [transition:background_0.15s] bg-accent text-on-accent py-2.5 px-[15px] [&:hover]:[filter:brightness(0.96)]"
          @click="restoreSample"
        >
          Restore sample</button
        ><button
          class="inline-flex items-center justify-center gap-[9px] min-h-10 font-semibold leading-[1.3] rounded-[9px] border border-solid border-line [transition:background_0.15s] bg-surface text-ink py-2.5 px-[15px] [&:hover]:bg-hover"
          @click="restore = false"
        >
          Keep my poster
        </button>
      </div></AppDialog
    >
  </div>
</template>
