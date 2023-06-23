<template>
  <div class="flex items-center">
    <ClientOnly>
      <USelectMenu v-model="primary" name="primary" class="w-full [&>div>button]:!rounded-r-none" color="gray"
        :ui="{ width: 'w-[194px]' }" :popper="{ placement: 'bottom-start' }" :options="primaryOptions">
        <template #label>
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${primary.hex}` }" />

          {{ primary.text }}
        </template>

        <template #option="{ option }">
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${option.hex}` }" />

          {{ option.text }}
        </template>
      </USelectMenu>
    </ClientOnly>

    <ClientOnly>
      <USelectMenu v-model="gray" name="gray" class="w-full [&>div>button]:!rounded-l-none [&>div>button]:-ml-px"
        color="gray" :ui="{ width: 'w-[194px]' }" :popper="{ placement: 'bottom-end' }" :options="grayOptions">
        <template #label>
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${gray.hex}` }" />

          {{ gray.text }}
        </template>

        <template #option="{ option }">
          <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${option.hex}` }" />

          {{ option.text }}
        </template>
      </USelectMenu>
    </ClientOnly>

    <ClientOnly>
      <UButton :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" color="gray" variant="ghost" aria-label="Theme"
        @click="isDark = !isDark" class="ml-1" />

      <template #fallback>
        <div class="w-8 h-8" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

// Computed

const primaryOptions = computed(() => appConfig.ui.colors.map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const primary = computed({
  get() {
    return primaryOptions.value.find(option => option.value === appConfig.ui.primary)
  },
  set(option) {
    appConfig.ui.primary = option.value
  }
})

const grayOptions = computed(() => ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const gray = computed({
  get() {
    return grayOptions.value.find(option => option.value === appConfig.ui.gray)
  },
  set(option) {
    appConfig.ui.gray = option.value
  }
})

// Hack for SSG
const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : null
}
const root = computed(() => {
  return `:root {
${Object.entries(colors[appConfig.ui.primary] || colors.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}
${Object.entries(colors[appConfig.ui.gray] || colors.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
}`
})
if (process.client) {
  watch(root, () => {
    window.localStorage.setItem('nuxt-ui-root', root.value)
  }, { immediate: true })
}
if (process.server) {
  useHead({
    script: [
      {
        innerHTML: `
            if (localStorage.getItem('nuxt-ui-root')) {
              document.querySelector('style#nuxt-ui-colors').innerHTML = localStorage.getItem('nuxt-ui-root')
            }`.replace(/\s+/g, ' '),
        type: 'text/javascript',
        tagPriority: -1
      }
    ]
  })
}
</script>