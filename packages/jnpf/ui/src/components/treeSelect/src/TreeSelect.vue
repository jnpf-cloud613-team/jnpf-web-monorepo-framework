<script lang="ts" setup>
import type { FieldNames } from './props';

import { computed, ref, unref, watch, watchEffect } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { isArray, isBoolean } from '@jnpf/utils';

import { TreeSelect } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { useTree } from '../../../core/tree/src/hooks/useTree';
import { treeSelectProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfTreeSelect' });
const props = defineProps(treeSelectProps);
const emit = defineEmits(['update:modelValue', 'update:value', 'change']);
const attrs: any = useAttrs({ excludeDefaultKeys: false });
const innerValue = ref('');
const treeDataRef = ref<any[]>([]);

const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props;
  return {
    label: 'fullName',
    value: 'id',
    children: 'children',
    ...fieldNames,
    key: fieldNames.value || 'id',
  };
});
const getTreeData = computed(() => {
  const treeData = cloneDeep(props.options);
  if (props.multiple) return treeData;
  const loop = (list) => {
    for (const item of list) {
      if (
        props.lastLevel &&
        ((isBoolean(props.lastLevelValue) && !!item[props.lastLevelKey] != props.lastLevelValue) ||
          (!isBoolean(props.lastLevelValue) && item[props.lastLevelKey] != props.lastLevelValue))
      ) {
        item.disabled = true;
      }
      if (item[unref(getFieldNames).children] && isArray(item[unref(getFieldNames).children])) loop(item[unref(getFieldNames).children]);
    }
  };
  loop(treeData);
  return treeData;
});
const getBindValue = computed(() => ({
  ...unref(attrs),
  ...props,
  fieldNames: unref(getFieldNames),
  showArrow: Reflect.has(unref(attrs), 'showArrow') ? unref(attrs).showArrow : true,
  showCheckedStrategy: Reflect.has(unref(attrs), 'showCheckedStrategy') ? unref(attrs).showCheckedStrategy : TreeSelect.SHOW_ALL,
  treeCheckable: props.multiple,
  treeData: unref(getTreeData),
  treeNodeFilterProp: unref(getFieldNames).label,
}));

const { getSelectedNode } = useTree(treeDataRef, getFieldNames);

watch(
  () => unref(props.modelValue),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);

watchEffect(() => {
  treeDataRef.value = props.options;
});

function setValue(value) {
  innerValue.value = !!value || value === 0 ? value : props.multiple ? [] : undefined;
}
function onChange(value, _label, extra) {
  if (!props.multiple && value && extra.preValue.some((o) => o.value === value)) return;
  const keys = props.multiple ? value : [value];
  const nodeList: any[] = [];
  for (const key of keys) {
    const node = getSelectedNode(key);
    if (node) nodeList.push(node);
  }
  const data = props.multiple ? nodeList : nodeList.length > 0 ? nodeList[0] : {};
  emit('update:modelValue', value);
  emit('update:value', value);
  emit('change', value, data);
}
</script>

<template>
  <TreeSelect class="jnpf-tree-select" v-bind="getBindValue" v-model:value="innerValue" @change="onChange">
    <template #title="data">
      <slot name="title" v-bind="data || {}">
        <div :key="data.id" class="custom-tree-node">
          <i v-if="data.icon && showIcon" :class="data.icon" class="custom-tree-node-icon"></i>
          <span class="custom-tree-node-icon-name">{{ data[getFieldNames.label] || innerValue }}</span>
        </div>
      </slot>
    </template>
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </TreeSelect>
</template>
<style lang="scss" scoped>
.jnpf-tree-select {
  :deep(.ant-select-selection-item) {
    .custom-tree-node-icon {
      display: none;
      margin-right: 6px;
      font-size: 14px;
      line-height: 30px;
      vertical-align: top;
    }
  }
}
</style>
<style lang="scss">
.ant-select-tree-treenode {
  .custom-tree-node-icon {
    margin-right: 6px;
    font-size: 14px;
    line-height: 24px;
    vertical-align: top;
  }
}

.ant-tree-select-dropdown {
  .ant-select-tree {
    .ant-select-tree-switcher {
      .ant-select-tree-switcher-icon {
        vertical-align: 0.25em;
      }
    }
  }
}
</style>
