<template>
  <UContainer class="pt-2 md:pt-20 2xl:max-w-[1920px]">
    <div class="flex flex-wrap gap-4">
      <div class="flex justify-end gap-2 w-full">
        <UInput name="search" placeholder="Search..." disabled icon="i-heroicons-magnifying-glass-20-solid"
          :ui="{ icon: { trailing: { pointer: '' } } }">
        </UInput>
        <ShareButton />
        <AddEntry />
      </div>
    </div>
    <ul class="flex flex-col gap-4">
      <li class="space-y-2 mt-2" v-for="i in 3">
        <USkeleton class="h-6 w-[100px]" />
        <ul class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <li>
            <USkeleton class="h-80 w-full" />
          </li>
          <li>
            <USkeleton class="h-80 w-full" />
          </li>
          <li>
            <USkeleton class="h-80 w-full" />
          </li>
          <li>
            <USkeleton class="h-80 w-full" />
          </li>
        </ul>
      </li>
    </ul>
  </UContainer>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

definePageMeta({
  layout: 'empty',
});

watch(user, () => {
  if (user.value) {
    return navigateTo('/');
  }
}, { immediate: true });
</script>