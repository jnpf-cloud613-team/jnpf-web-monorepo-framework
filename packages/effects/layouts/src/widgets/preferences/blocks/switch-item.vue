<script setup lang="ts">
import { Switch } from '@vben-core/shadcn-ui';
import { globalShareState } from '@vben-core/shared/global-state';

defineOptions({
  name: 'PreferenceSwitchItem',
});

withDefaults(defineProps<{ disabled?: boolean; tip?: string }>(), {
  disabled: false,
  tip: '',
});

const { BasicHelp } = globalShareState.getComponents();
const checked = defineModel<boolean>();

function handleClick() {
  checked.value = !checked.value;
}
</script>

<template>
  <div
    :class="{ 'pointer-events-none opacity-50': disabled }"
    class="hover:bg-accent my-1 flex w-full items-center justify-between rounded-md px-2 py-2.5"
    @click="handleClick">
    <span class="flex items-center text-sm">
      <slot></slot>

      <BasicHelp v-if="tip" :text="tip" placement="bottom" />
    </span>
    <span v-if="$slots.shortcut" class="ml-auto mr-2 text-xs opacity-60">
      <slot name="shortcut"></slot>
    </span>
    <Switch v-model:checked="checked" @click.stop />
  </div>
</template>
