<script lang="ts" setup>
import type { FieldNames } from './props';

import { computed, ref, unref, watch } from 'vue';

import { useAttrs } from '@jnpf/hooks';

import { radioProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfRadio' });
const props = defineProps(radioProps);
const emit = defineEmits(['update:value', 'change']);
const attrs: any = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref('');

const getBindValue = computed(() => ({
  ...unref(attrs),
  class: unref(attrs).class ? `jnpf-${props.direction}-radio ${unref(attrs).class}` : `jnpf-${props.direction}-radio`,
}));
const getOptions = computed<any[]>(() => props.options);
const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props;
  return {
    disabled: 'disabled',
    label: 'fullName',
    value: 'id',
    ...fieldNames,
  };
});

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  {
    immediate: true,
  },
);

function setValue(value) {
  innerValue.value = value;
}
function onChange(e) {
  const val = e.target.value;
  const datum = unref(getOptions).find((o) => o[unref(getFieldNames).value] === val);
  emit('update:value', val);
  emit('change', val, datum);
}
</script>

<template>
  <a-radio-group button-style="solid" v-bind="getBindValue" v-model:value="innerValue" @change="onChange">
    <template v-if="optionType === 'button'">
      <template v-if="direction === 'vertical'">
        <span v-for="item in getOptions" :key="item[getFieldNames.value]" class="vertical-button">
          <a-radio-button :disabled="item[getFieldNames.disabled]" :value="item[getFieldNames.value]">
            {{ item[getFieldNames.label] }}
          </a-radio-button>
        </span>
      </template>
      <template v-else>
        <a-radio-button v-for="item in getOptions" :key="item[getFieldNames.value]" :disabled="item[getFieldNames.disabled]" :value="item[getFieldNames.value]">
          {{ item[getFieldNames.label] }}
        </a-radio-button>
      </template>
    </template>
    <template v-else>
      <a-radio v-for="item in getOptions" :key="item[getFieldNames.value]" :disabled="item[getFieldNames.disabled]" :value="item[getFieldNames.value]">
        {{ item[getFieldNames.label] }}
      </a-radio>
    </template>
  </a-radio-group>
</template>
<style lang="scss">
.jnpf-vertical-radio {
  .ant-radio-wrapper {
    display: flex;
    margin-right: 0;

    .ant-radio + span {
      word-break: break-all;
    }
  }

  .vertical-button {
    display: block;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
