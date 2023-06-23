<template>
  <UButton v-if="!user" @click="login('google')">Login with Google</UButton>
  <UButton v-if="!user" @click="login('github')">Login with Github</UButton>
  <UDropdown v-if="user" :items="menuItems" :popper="{ placement: 'bottom-end' }">
    <button class="focus-visible:outline-primary-500">
      <UAvatar :src="user?.user_metadata?.avatar_url" />
    </button>
  </UDropdown>
</template>

<script setup>
const user = useSupabaseUser();
const client = useSupabaseAuthClient();
const toast = useToast();

const login = async (provider) => {
  const { error } = await client.auth.signInWithOAuth({ provider })
  if (error) {
    return toast.add({ title: 'Login failed', color: 'red' });
  }
}

const logout = async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    return toast.add({ title: 'Logout failed', color: 'red' });
  }
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
