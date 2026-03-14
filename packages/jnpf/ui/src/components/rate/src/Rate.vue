<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { Rate } from 'ant-design-vue';

defineOptions({ inheritAttrs: false, name: 'JnpfRate' });

const attrs = useAttrs({ excludeDefaultKeys: false });

const getBindValue: any = computed(() => ({ ...unref(attrs) }));
</script>

<template>
  <Rate v-bind="getBindValue">
    <template v-for="item in Object.keys($slots)" #[item]="data"><slot :name="item" v-bind="data || {}"></slot></template>
  </Rate>
</template>
