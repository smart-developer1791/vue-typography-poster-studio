<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, useTemplateRef } from 'vue'
import PosterCanvas from './PosterCanvas.vue'
import { dimensions, type Poster } from '../domain/poster'
const props = defineProps<{ poster: Poster }>(),
  viewport = useTemplateRef<HTMLElement>('viewport'),
  area = ref({ width: 400, height: 580 }),
  size = computed(() => dimensions(props.poster.shape)),
  scale = computed(() =>
    Math.max(
      0.05,
      Math.min(
        (area.value.width - 44) / size.value.width,
        (area.value.height - 44) / size.value.height,
      ),
    ),
  )
let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver((entries) => {
    const box = entries[0]!.contentRect
    area.value = { width: box.width, height: box.height }
  })
  observer.observe(viewport.value!)
})
onScopeDispose(() => observer?.disconnect())
</script>
<template>
  <div
    ref="viewport"
    data-ui="poster-stage"
    class="h-160 bg-canvas border border-solid border-line rounded-[18px] flex items-center justify-center overflow-hidden [@media(width<=700px)]:h-130"
  >
    <div
      class="shadow-[0_8px_25px_#44382025] shrink-0"
      :style="{ width: size.width * scale + 'px', height: size.height * scale + 'px' }"
    >
      <PosterCanvas
        :poster="poster"
        :style="{ transform: `scale(${scale})`, transformOrigin: 'top left' }"
      />
    </div>
  </div>
</template>
