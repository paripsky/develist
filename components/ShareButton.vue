<template>
  <div>
    <UTooltip text="Create your list to enable sharing" :prevent="!!user">
      <UButton id="share-button" variant="ghost" :disabled="!user" label="Share" @click="handleShare()" />
    </UTooltip>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();

const shareLink = ref();

const handleShare = async () => {
  let shareLinkId = shareLink.value;

  if (!shareLinkId) {
    const { data: [existingShareLink] } = await client.from('share_links').select('*');
    shareLinkId = existingShareLink?.id;
  }

  if (!shareLinkId) {
    const { data: [newLink] } = await client.from('share_links').insert({}).select();
    shareLinkId = newLink?.id;
  }

  shareLink.value = shareLinkId;

  const fullLinkUrl = new URL('', location.origin);
  fullLinkUrl.searchParams.append('link', shareLinkId);
  await navigator.clipboard.writeText(fullLinkUrl.toString());
  toast.add({ id: 'shareLink', title: 'Share link was copied to your clipboard!', color: 'primary' });
}
</script>