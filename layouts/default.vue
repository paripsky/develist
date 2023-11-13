<template>
  <nav>
    <UContainer class="flex items-center justify-end gap-2 p-2 2xl:max-w-[1920px]">
      <UPopover>
        <template #default="{ open }">
          <UButton color="gray" variant="ghost" square :class="[open && 'bg-gray-50 dark:bg-gray-800']">
            <UIcon name="i-heroicons-swatch-20-solid" class="w-5 h-5 text-primary-500 dark:text-primary-400" />
          </UButton>
        </template>

        <template #panel>
          <ColorPicker />
        </template>
      </UPopover>
      <ColorModeButton />
      <Login />
    </UContainer>
  </nav>
  <slot />
  <UNotifications />
</template>

<script setup>
useSeoMeta({
  title: 'Develist - Manage Your Development Tools and Resources',
  description: 'A web application built using Nuxt 3 and Supabase to help developers manage and organize their development tools and resources.',
  ogTitle: 'Develist - Manage Your Development Tools and Resources',
  ogDescription: 'A web application built using Nuxt 3 and Supabase to help developers manage and organize their development tools and resources.',
  // ogImage: 'https://example.com/develist.png',
  ogUrl: 'https://develist.vercel.com',
  twitterTitle: 'Develist - Manage Your Development Tools and Resources',
  twitterDescription: 'A web application built using Nuxt 3 and Supabase to help developers manage and organize their development tools and resources.',
  // twitterImage: 'https://example.com/develist.png',
  twitterCard: 'summary'
});

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
      sizes: 'any',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      href: '/apple-touch-icon.png',
    }
  ]
});
</script>

<style>
html {
  background: rgb(var(--color-gray-100) / 1);
}

html.dark {
  background: rgb(var(--color-gray-950) / 1);
}
</style>
