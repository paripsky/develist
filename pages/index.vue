<template>
  <div>
    <UContainer class="pt-2 md:pt-20 2xl:max-w-[1920px]">
      <div class="flex flex-wrap gap-4">
        <span v-if="list?.ownerName" class="mr-auto">{{ list.ownerName }}'s Develist</span>
        <div class="flex justify-end gap-2 w-full">
          <UInput v-model="search" name="search" placeholder="Search..." icon="i-heroicons-magnifying-glass-20-solid"
            :ui="{ icon: { trailing: { pointer: '' } } }">
            <template #trailing>
              <UButton v-show="search !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                :padded="false" @click="search = ''" />
            </template>
          </UInput>
          <UButton v-if="user && list.isLink" @click="resetRoute()">Back to my list</UButton>
          <ShareButton v-if="!list.isLink" />
          <AddEntry v-if="!list.isLink" :entry="editing" :tags="list.categories" @save="refresh"
            @reset="editing = null" />
        </div>
      </div>
      <ul class="flex flex-col gap-4" v-if="pending">
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
      <div v-if="!pending && !categoriesWithItems?.length && !search" class="mt-2">
        Add your first develist entry or start from a template
      </div>
      <div v-if="!pending && !categoriesWithItems?.length && search" class="mt-2">
        No results
      </div>
      <ul class="flex flex-col gap-4">
        <li v-for="category in categoriesWithItems" class="my-2">
          <UBadge size="lg" :color="category.color" class="mb-2 flex gap-1">{{ category.title }}
            <UIcon v-if="category.icon" :name="category.icon" />
          </UBadge>
          <ul class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <HoverCard class="card group" v-for="item in category.items" :color="category.color">
              <template #header>
                <div class="flex justify-between">
                  <NuxtLink external target="_blank" :href="item.url" class="flex gap-1 items-center">
                    <span>{{ item.title }}</span>
                    <UIcon name="i-mdi-arrow-right" class="shrink-0" />
                  </NuxtLink>
                  <UButton v-if="user && !list.isLink" @click="editing = item" variant="ghost" icon="i-heroicons-pencil"
                    class="show-on-hover transition-opacity opacity-0 group-hover:opacity-100" :color="category.color" />
                </div>
              </template>
              <span class="line-clamp-3 whitespace-pre-wrap">{{ item.description }}</span>
              <template #footer v-if="item.image">
                <img :src="item.image" class="h-52 w-full object-cover" />
              </template>
            </HoverCard>
          </ul>
        </li>
      </ul>
    </UContainer>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();

const editing = ref(null);
const search = ref('');

const tagIcons = {
  react: 'i-mdi-react',
  vue: 'i-mdi-vuejs',
  angular: 'i-mdi-angular',
  node: 'i-mdi-nodejs',
  css: 'i-mdi-language-css3',
  ideAndTextEditors: 'i-mdi-file-code',
  deno: 'i-mdi-dinosaur-pixel',
  icons: 'i-mdi-tag-emoticon',
  databases: 'i-mdi-database',
  macApps: 'i-mdi-apple',
  tools: 'i-mdi-tools',
  codeQualityTools: 'i-mdi-code-tags-check',
  other: 'i-mdi-vector-difference',
};

const resetRoute = () => {
  refreshNuxtData();
  navigateTo('/');
}

const { data: list, refresh, pending } = await useAsyncData('list', async () => {
  const emptyResponse = { categories: [], ownerName: '', isLink: false, isEmptyResponse: true };
  if (!user.value && !route.query.link) return emptyResponse;

  try {
    const { entries, owner } = await $fetch(`/api/entries`, {
      headers: useRequestHeaders(['cookie']),
      query: {
        link: route.query.link,
      }
    });
    const { data: tags } = await client.from('tags').select('*');

    const entriesByCategory = entries.reduce((acc, entry) => {
      entry.tags.forEach((tag) => {
        acc[tag] ??= [];
        acc[tag].push(entry);
      });

      return acc;
    }, {});

    return {
      categories: tags.map((tag) => ({
        ...tag,
        icon: tagIcons[tag.id],
        items: entriesByCategory[tag.id] ?? []
      })),
      ownerName: owner?.name ?? user.value.user_metadata?.name,
      isLink: !!route.query.link,
    };
  } catch {
    return emptyResponse;
  }
});

const categoriesWithItems = computed(() => list.value.categories
  .map((category) => search.value ? ({
    ...category, items: category.items
      .filter((item) => `${item.title.toLowerCase()}${item.description.toLowerCase()}`.includes(search.value.toLowerCase()))
  }) : category)
  .filter(({ items }) => items.length))

watch(() => user.value, (currentUser) => {
  if (currentUser?.id && list.value?.isEmptyResponse) {
    reloadNuxtApp();
  }
}, { immediate: true });

watch(() => route.query, (newQuery, oldQuery) => {
  if (newQuery.link !== oldQuery.link) {
    resetRoute();
  }
});
</script>

<style scoped>
.card:focus-within .show-on-hover {
  opacity: 1;
}

@media (pointer: coarse) {
  .show-on-hover {
    opacity: 1;
  }
}
</style>
