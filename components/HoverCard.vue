<template>
  <li class="relative overflow-hidden p-1 rounded-xl" ref="container">
    <UCard class="h-full flex flex-col card" :ui="{ footer: { padding: '' }, body: { base: 'flex-1' } }">
      <template #header>
        <slot name="header" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
      <slot />
    </UCard>
  </li>
</template>

<script setup>
import colors from '#tailwind-config/theme/colors';
const props = defineProps(['mousePosition', 'color']);

const bgColor = computed(() => colors[props.color]?.[500])
</script>

<style>
@media (pointer: fine) {
  .card::before {
    content: '';
    filter: blur(40px);
    position: absolute;
    z-index: -1;
    width: 200px;
    height: 200px;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 50%;
    background: v-bind(bgColor);
    top: v-bind(mousePosition.y - $refs.container?.getBoundingClientRect?.()?.y + "px");
    left: v-bind(mousePosition.x - $refs.container?.getBoundingClientRect?.()?.x + "px");
  }
}
</style>