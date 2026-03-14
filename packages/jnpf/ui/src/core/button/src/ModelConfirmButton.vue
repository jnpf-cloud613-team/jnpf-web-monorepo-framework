<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAttrs, useMessage } from '@jnpf/hooks';

import { $t } from '@vben/locales';

import { omit } from 'lodash-es';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelConfirm: { type: Object },
});

const attrs = useAttrs({ excludeDefaultKeys: false });
const { createConfirm } = useMessage();
const { modelConfirm } = props;
function onClick() {
  createConfirm({
    content: modelConfirm?.content || $t('common.delTip'),
    iconType: modelConfirm?.iconType || 'warning',
    onOk: modelConfirm?.onOk,
    title: modelConfirm?.title || $t('common.tipTitle'),
  });
}
const getBindValue = computed(() => omit({ ...unref(attrs) }, ['enable', 'getPopupContainer', 'label', 'onClick', 'icon']));
</script>
<template>
  <a-button v-bind="getBindValue" @click="onClick">
    <template #default="data">
      <slot v-bind="data || {}"></slot>
    </template>
  </a-button>
</template>
