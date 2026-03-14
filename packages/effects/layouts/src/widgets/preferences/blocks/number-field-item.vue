<script setup lang="ts">
import type { SelectOption } from '@vben/types';

import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@vben-core/shadcn-ui';
import { globalShareState } from '@vben-core/shared/global-state';

defineOptions({
  name: 'PreferenceSelectItem',
});

withDefaults(
  defineProps<{
    disabled?: boolean;
    items?: SelectOption[];
    placeholder?: string;
    tip?: string;
  }>(),
  {
    disabled: false,
    placeholder: '',
    tip: '',
    items: () => [],
  },
);
const components = globalShareState.getComponents();
const { BasicHelp } = components;

const inputValue = defineModel<number>();
</script>

<template>
  <div
    :class="{
      'pointer-events-none opacity-50': disabled,
    }"
    class="hover:bg-accent my-1 flex w-full items-center justify-between rounded-md px-2 py-1">
    <span class="flex items-center text-sm">
      <slot></slot>

      <BasicHelp v-if="tip" :text="tip" placement="bottom" />
    </span>

    <component :is="components.InputNumber" v-model:value="inputValue" v-bind="$attrs" v-if="components.InputNumber" class="!w-[120px]" />
    <NumberField v-model="inputValue" v-bind="$attrs" v-else class="w-[165px]">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
</template>
