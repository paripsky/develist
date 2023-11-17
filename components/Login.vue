<template>
  <div class="hidden sm:flex gap-2" v-if="!user">
    <UButton @click="login('google')">Login with Google</UButton>
    <UButton @click="login('github')">Login with Github</UButton>
  </div>
  <div class="flex sm:hidden gap-2" v-if="!user">
    <UButton @click="isOpen = true">Login</UButton>
  </div>
  <UModal v-if="!user" v-model="isOpen" @close="resetAndClose()">
    <UCard>
      <div class="flex flex-col gap-2">
        <UButton @click="login('google')">Login with Google</UButton>
        <UButton @click="login('github')">Login with Github</UButton>
      </div>
    </UCard>
  </UModal>
  <UDropdown v-if="user" :items="menuItems" :popper="{ placement: 'bottom-end' }">
    <button class="focus-visible:outline-primary-500">
      <UAvatar :src="user?.user_metadata?.avatar_url" />
    </button>
  </UDropdown>
</template>

<script setup>
const isOpen = ref(false);
const user = useSupabaseUser();
const client = useSupabaseClient();
const toast = useToast();

const login = async (provider) => {
  const redirectToUrl = new URL(location.href);
  redirectToUrl.pathname = '/confirm';
  redirectToUrl.search = '';
  const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: redirectToUrl.toString() } })
  if (error) {
    return toast.add({ title: 'Login failed', color: 'red' });
  }
}

const logout = async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    return toast.add({ title: 'Logout failed', color: 'red' });
  }

  refreshNuxtData();
  navigateTo('/');
}

const menuItems = computed(() => [
  [{
    label: user.value?.user_metadata?.full_name,
    avatar: {
      src: user.value?.user_metadata?.avatar_url
    }
  }], [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-20-solid',
      shortcuts: ['S'],
    },
    {
      label: 'Logout',
      icon: 'i-heroicons-trash-20-solid',
      shortcuts: ['L'],
      click: logout,
    }]
]);
</script>
