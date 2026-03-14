<script lang="ts" setup>
import { Settings } from '@vben/icons';

import { VbenIconButton } from '@vben-core/shadcn-ui';

import Preferences from './preferences.vue';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>
<template>
  <Preferences @clear-preferences-and-logout="clearPreferencesAndLogout">
    <VbenIconButton class="global-header-icon !mr-0 w-auto rounded-md px-[10px]">
      <Settings class="text-foreground size-4" />
    </VbenIconButton>
  </Preferences>
</template>
