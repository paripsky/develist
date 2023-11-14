<template>
  <li class="relative overflow-hidden p-1 rounded-xl" ref="container" :data-hovering="isHovering" @mousemove="onMouseMove"
    @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
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
const props = defineProps(['color']);

const bgColor = computed(() => colors[props.color]?.[500]);

const mousePosition = ref({ x: 0, y: 0 });
const isHovering = ref(false);

const onMouseMove = (e) => {
  mousePosition.value = { x: e.clientX, y: e.clientY };
}

const onMouseEnter = () => {
  isHovering.value = true;
}

const onMouseLeave = () => {
  isHovering.value = false;
}
</script>

<style>
@media (pointer: fine) {
  .card[data-hovering="true"]::before {
    content: '';
    filter: blur(40px);
    position: absolute;
    z-index: -1;
    width: 300px;
    height: 300px;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 50%;
    background: v-bind(bgColor);
    top: v-bind(mousePosition.y - $refs.container?.getBoundingClientRect?.()?.y + "px");
    left: v-bind(mousePosition.x - $refs.container?.getBoundingClientRect?.()?.x + "px");
  }
}
</style>