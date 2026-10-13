<script setup lang="ts">
import { computed, useCssModule } from 'vue'
import { dimensions, fontNames, layout, type Poster } from '../domain/poster'
const props = defineProps<{ poster: Poster }>(),
  composition = useCssModule('composition'),
  lettering = useCssModule('lettering')
const frame = computed(() => dimensions(props.poster.shape)),
  tokens = computed(() => layout(props.poster.template)),
  family = computed(() => `'${fontNames[props.poster.font]}', sans-serif`),
  justify = computed(() =>
    props.poster.align === 'left'
      ? 'flex-start'
      : props.poster.align === 'right'
        ? 'flex-end'
        : 'center',
  )
</script>
<template>
  <article
    :class="[composition.paper, composition[poster.template]]"
    :aria-label="poster.title"
    data-poster
  >
    <div :class="lettering.kicker">TYPE &amp; PAPER / {{ poster.template.toUpperCase() }}</div>
    <div :class="composition.message">
      <h2 :class="lettering.heading">{{ poster.heading }}</h2>
      <p :class="lettering.subtitle">{{ poster.subtitle }}</p>
    </div>
    <div :class="lettering.footer">{{ poster.footer }}</div>
    <span :class="composition.decoration" aria-hidden="true" />
  </article>
</template>
<style module="composition">
.paper {
  width: v-bind('frame.width + "px"');
  height: v-bind('frame.height + "px"');
  padding: v-bind('tokens.inset + "px"');
  background: v-bind('poster.paper');
  color: v-bind('poster.ink');
  border: v-bind('tokens.border + "px solid " + poster.accent');
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: 64px minmax(0, 1fr) 90px;
  text-align: v-bind('poster.align');
  box-sizing: border-box;
}
.message {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  gap: 32px;
}
.decoration {
  position: absolute;
  pointer-events: none;
  background: v-bind('poster.accent');
  opacity: 0.2;
}
.editorial > .decoration {
  height: 6px;
  width: 160px;
  bottom: 180px;
  left: v-bind('tokens.inset + "px"');
}
.bold > .decoration {
  height: 180px;
  width: 180px;
  top: 110px;
  right: -38px;
  transform: rotate(-15deg);
}
.quiet > .decoration {
  height: 400px;
  width: 400px;
  bottom: -120px;
  right: -140px;
  border-radius: 50%;
}
</style>
<style module="lettering">
.kicker {
  font:
    14px 'DM Sans Variable',
    sans-serif;
  letter-spacing: 4px;
  text-align: left;
  color: v-bind('poster.accent');
  position: relative;
  z-index: 1;
}
.heading {
  font-family: v-bind(family);
  font-size: v-bind('poster.size + "px"');
  font-weight: v-bind('tokens.weight');
  line-height: v-bind('poster.leading');
  letter-spacing: v-bind('poster.tracking + "px"');
  margin: 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
  color: v-bind('poster.ink');
}
.subtitle {
  font:
    23px/1.6 'DM Sans Variable',
    sans-serif;
  margin: 0;
  white-space: pre-line;
  color: v-bind('poster.ink');
}
.footer {
  font:
    12px/1.8 'DM Sans Variable',
    sans-serif;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: v-bind(justify);
  color: v-bind('poster.ink');
}
</style>
