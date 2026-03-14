<script setup lang="ts">
import { SvgGithubIcon, SvgGoogleIcon, SvgQQChatIcon, SvgWeChatIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenIconButton } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'ThirdPartyLogin',
});
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <VbenIconButton class="mb-3">
        <SvgWeChatIcon />
      </VbenIconButton>
      <VbenIconButton class="mb-3">
        <SvgQQChatIcon />
      </VbenIconButton>
      <VbenIconButton class="mb-3">
        <SvgGithubIcon />
      </VbenIconButton>
      <VbenIconButton class="mb-3">
        <SvgGoogleIcon />
      </VbenIconButton>
    </div>
  </div>
</template>
