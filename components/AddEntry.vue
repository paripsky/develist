
<template>
  <div>
    <UTooltip text="Login to start building your own develist" :prevent="user">
      <UButton label="New" icon="i-heroicons-plus" @click="resetAndOpen" :disabled="!user" />
    </UTooltip>

    <UModal v-model="isOpen" @close="resetAndClose">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          {{ entry ? 'Edit' : 'Add' }} Entry
        </template>

        <form class="flex flex-col gap-2" @submit.prevent>
          <UFormGroup label="URL" required>
            <UInput placeholder="https://www.example.com" v-model="url" icon="i-heroicons-link" />
          </UFormGroup>
          <UFormGroup label="Title" required>
            <UInput placeholder="Entry Name" v-model="title" icon="i-heroicons-document-text" />
          </UFormGroup>
          <UFormGroup label="Description">
            <UTextarea v-model="description" />
          </UFormGroup>
          <UFormGroup label="Image">
            <UInput placeholder="https://www.example.com/image.png" v-model="image" icon="i-heroicons-photo" />
          </UFormGroup>
          <UFormGroup label="Tags" required>
            <USelectMenu v-model="tags" :options="tagOptions" searchable multiple>
              <template #label>
                <span v-if="tags.length" class="truncate">{{ tags.map((t) => t.label).join(', ') }}</span>
                <span v-else>Select Tags</span>
              </template>
            </USelectMenu>
          </UFormGroup>
        </form>

        <template #footer>
          <div class="flex flex-row-reverse gap-2">
            <UButton @click="entry ? updateEntry() : addEntry()" :loading="isLoading">{{ entry ? 'Save' : 'Add' }}
            </UButton>
            <UButton variant="outline" @click="resetAndClose" :disabled="isLoading">Cancel</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();

const toast = useToast();

const isOpen = ref(false);
const isLoading = ref(false);

const title = ref('');
const url = ref('');
const description = ref('');
const image = ref('');
const tags = ref([]);

const props = defineProps(['tags', 'entry']);

const emit = defineEmits(['save', 'reset']);

const tagOptions = computed(() => props.tags
  .map(({ id, title, icon }) => ({ id, label: title, icon })));

watch(() => url.value, async () => {
  if (!url.value || url.value === props.entry?.url) return;
  const meta = await $fetch(`https://og-scrapi.deno.dev/api/meta?url=${encodeURIComponent(url.value)}`).catch((error) => error.data)
  const metaTitle = meta.title ?? meta['og:title'] ?? meta['twitter:title'];
  const metaDescription = meta.description ?? meta['og:description'] ?? meta['twitter:description'];
  const metaImage = meta['og:image'] ?? meta['twitter:image'];

  if (metaTitle && !title.value) {
    title.value = metaTitle;
  }

  if (metaDescription && !description.value) {
    description.value = metaDescription;
  }
  if (metaImage && !image.value) {
    image.value = metaImage;
  }
});

watch(() => props.entry, () => {
  if (!props.entry) return;
  title.value = props.entry.title;
  url.value = props.entry.url;
  description.value = props.entry.description;
  image.value = props.entry.image;
  tags.value = props.entry.tags.map((tag) => tagOptions.value.find(({ id }) => id === tag));
  isOpen.value = true;
});

const reset = () => {
  title.value = '';
  url.value = '';
  description.value = '';
  image.value = '';
  tags.value = [];
  emit('reset');
}

const resetAndClose = () => {
  isOpen.value = false;
  reset();
}

const resetAndOpen = () => {
  reset();
  isOpen.value = true;
}

const updateEntry = async () => {
  isLoading.value = true;
  const { error } = await client.from('entries').update({
    title: title.value,
    url: url.value,
    description: description.value,
    image: image.value,
    tags: tags.value.map(({ id }) => id),
  }).eq('id', props.entry.id);
  isLoading.value = false;

  if (error) {
    toast.add({ title: 'Failed to update entry', description: error.message, color: 'red' });
    return;
  }

  emit('save');
  resetAndClose();
};

const addEntry = async () => {
  isLoading.value = true;
  const { error } = await client.from('entries').insert({
    title: title.value,
    url: url.value,
    description: description.value,
    image: image.value,
    tags: tags.value.map(({ id }) => id),
  });
  isLoading.value = false;

  if (error) {
    toast.add({ title: 'Failed to add entry', description: error.message, color: 'red' });
    return;
  }

  emit('save');
  resetAndClose();
};
</script>
