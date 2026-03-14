<script lang="ts" setup>
import type { JnpfAlertProps } from './props';

import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Alert } from 'ant-design-vue';
import { omit } from 'lodash-es';

defineOptions({
  inheritAttrs: false,
  name: 'JnpfAlert',
});

const props = withDefaults(defineProps<JnpfAlertProps>(), {
  closable: false,
  closeText: '',
  showIcon: false,
  title: '',
  type: 'warning',
});

const attrs = useAttrs({ excludeDefaultKeys: false });

const getBindValue: any = computed(() => omit({ ...unref(attrs), ...props, closeText: props.closable ? props.closeText : '' }, ['title']));
</script>

<template>
  <Alert :message="title" v-bind="getBindValue">
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Alert>
</template>
