<template>
  <nav>
    <UContainer class="flex justify-end gap-2 p-2 2xl:max-w-[1920px]">
      <ThemeSelect />
      <Login />
    </UContainer>
  </nav>
  <main @mousemove="onMouseMove">
    <UContainer class="pt-6 md:pt-20 2xl:max-w-[1920px]">
      <div class="flex justify-end gap-2">
        <UButton variant="ghost">Share</UButton>
        <AddEntry :entry="editing" :tags="categories" @save="refresh" @reset="editing = null" />
      </div>
      <div v-if="!categoriesWithItems?.length">
        Add your first develist entry or start from a template
      </div>
      <ul class="flex flex-col gap-4">
        <li v-for="category in categoriesWithItems" class="my-2">
          <UBadge size="lg" :color="category.color" class="mb-2 flex gap-1">{{ category.title }}
            <UIcon v-if="category.icon" :name="category.icon" />
          </UBadge>
          <ul class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <HoverCard class="card group" v-for="item in category.items" :mousePosition="mousePosition"
              :color="category.color">
              <template #header>
                <div class="flex justify-between">
                  <NuxtLink external target="_blank" :href="item.url" class="flex gap-1 items-center">
                    <span>{{ item.title }}</span>
                    <UIcon name="i-mdi-arrow-right" class="shrink-0" />
                  </NuxtLink>
                  <UButton v-if="user" @click="editing = item" variant="ghost" icon="i-heroicons-pencil"
                    class="show-on-hover transition-opacity opacity-0 group-hover:opacity-100" :color="category.color" />
                </div>
              </template>
              <span class="line-clamp-3 whitespace-pre-wrap">{{ item.description }}</span>
              <template #footer v-if="item.image">
                <img :src="item.image" class="h-32 w-full object-cover" />
              </template>
            </HoverCard>
          </ul>
        </li>
      </ul>
    </UContainer>
  </main>
  <UNotifications />
</template>

<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();

const editing = ref(null);

const tagIcons = {
  react: 'i-mdi-react',
  vue: 'i-mdi-vuejs',
  angular: 'i-mdi-angular',
  node: 'i-mdi-nodejs',
};

const { data: categories, refresh } = await useAsyncData('list', async () => {
  console.log(route);
  if (!user.value && !route.query.link) return [];
  const entries = await $fetch(`/api/list`, {
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

  return tags.map((tag) => ({
    ...tag,
    icon: tagIcons[tag.id],
    items: entriesByCategory[tag.id] ?? []
  }));
});

const categoriesWithItems = computed(() => categories.value.filter(({ items }) => items.length))

const mousePosition = ref({ x: 0, y: 0 });

const onMouseMove = (e) => {
  mousePosition.value = { x: e.clientX, y: e.clientY };
}

watch(() => user.value, (currentUser, previousUser) => {
  if (currentUser?.id && previousUser?.id) return;
  refresh();
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

<style>
html {
  background: rgb(var(--color-gray-100) / 1);
}

html.dark {
  background: rgb(var(--color-gray-950) / 1);
}
</style>
