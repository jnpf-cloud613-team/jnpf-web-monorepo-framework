<script lang="ts" setup>
import type { ScrollActionType } from '@jnpf/ui';

import { nextTick, reactive, ref, toRefs, unref, watch } from 'vue';

import { ScrollContainer } from '@jnpf/ui';
import { ModalClose } from '@jnpf/ui/modal';

import { $t } from '@vben/locales';

import { Modal as AModal, Form } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { ymCustomJson } from '../data/ymCustom';
import { ymIconJson } from '../data/ymIcon';
import { iconPickerProps } from './props';

defineOptions({ inheritAttrs: false, name: 'JnpfIconPicker' });
const props = defineProps(iconPickerProps);
const emit = defineEmits(['update:value', 'change']);
const ymIcon = ymIconJson.glyphs.map((o) => `icon-ym icon-ym-${o.font_class}`);
const ymCustom = ymCustomJson.glyphs.map((o) => `ym-custom ym-custom-${o.font_class}`);

const formItemContext = Form.useInjectFormItemContext();
const state = reactive({
  activeIcon: '',
  activeKey: '',
  cacheList: [],
  currentPage: 1,
  finish: false,
  iconList: [],
  innerValue: '',
  keyword: '',
  loading: false,
  pageSize: 150,
  visible: false,
  ymCustom,
  ymCustomList: [],
  ymIcon,
  ymIconList: [],
});
const { activeIcon, activeKey, iconList, keyword, visible } = toRefs(state);
const infiniteBody = ref<Nullable<ScrollActionType>>(null);

watch(
  () => unref(props.value),
  (val) => {
    setValue(val);
  },
  { immediate: true },
);
watch(
  () => state.activeKey,
  (val) => {
    if (!val) return;
    state.keyword = '';
    handleSearch();
  },
);
watch(
  () => state.visible,
  (val) => {
    if (!val) state.activeKey = '';
  },
);

function setValue(value) {
  state.innerValue = value;
}
function openSelectModal() {
  if (props.disabled) return;
  state.visible = true;
  state.activeIcon = state.innerValue;
  state.activeKey = '1';
  nextTick(() => {
    bindScroll();
  });
}
function handleCancel() {
  state.visible = false;
}
function handleSubmit() {
  state.innerValue = state.activeIcon;
  emit('update:value', state.innerValue);
  emit('change', state.innerValue);
  formItemContext.onFieldChange();
  handleCancel();
}
function handleClear() {
  state.activeIcon = '';
}
function handleIconClick(item) {
  state.activeIcon = item;
}
function handleSearch() {
  infiniteBody.value?.scrollTo(0, 0);
  state.currentPage = 1;
  state.finish = false;
  const key: string = state.activeKey === '1' ? 'ymIcon' : 'ymCustom';
  state.iconList = [];
  state.cacheList = state.keyword ? state[key].filter((o) => o.includes(state.keyword)) : cloneDeep(state[key]);
  getList();
}
function getList() {
  state.loading = true;
  setTimeout(() => {
    const res = state.cacheList.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize);
    if (res.length < state.pageSize) state.finish = true;
    state.iconList = [...state.iconList, ...res];
    state.loading = false;
  }, 0);
}
function bindScroll() {
  const bodyRef = infiniteBody.value;
  const vBody = bodyRef?.getScrollWrap();
  vBody?.addEventListener('scroll', () => {
    if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !state.loading && !state.finish) {
      state.currentPage += 1;
      getList();
    }
  });
}
</script>

<template>
  <div :class="[$attrs.class]" class="jnpf-icon-picker">
    <a-input v-model:value="state.innerValue" :placeholder="placeholder" :size="$attrs?.size || 'default'" readonly>
      <template #addonAfter>
        <span @click="openSelectModal">{{ $t('component.jnpf.iconPicker.select') }}</span>
      </template>
      <template v-if="state.innerValue" #suffix>
        <i :class="state.innerValue"></i>
      </template>
    </a-input>
    <AModal v-model:open="visible" :keyboard="false" :mask-closable="false" :width="1000" centered class="icon-modal">
      <template #title>
        <div class="icon-modal-title">
          {{ $t('component.jnpf.iconPicker.modalTitle') }}
          <a-input-search v-model:value="keyword" :placeholder="$t('component.jnpf.iconPicker.searchPlaceholder')" allow-clear @search="handleSearch" />
        </div>
      </template>
      <template #closeIcon>
        <ModalClose :can-fullscreen="false" @cancel="handleCancel" />
      </template>
      <template #footer>
        <a-button type="error" @click="handleClear()">{{ $t('common.cleanText') }}</a-button>
        <a-button @click="handleCancel()">{{ $t('common.cancelText') }}</a-button>
        <a-button type="primary" @click="handleSubmit()">{{ $t('common.okText') }}</a-button>
      </template>
      <div class="main">
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="1" :tab="$t('component.jnpf.iconPicker.ymIcon')" />
          <a-tab-pane key="2" :tab="$t('component.jnpf.iconPicker.ymCustom')" />
        </a-tabs>
        <ScrollContainer ref="infiniteBody">
          <div class="icon-box-list">
            <a-button v-for="(item, index) in iconList" :key="index" :class="{ 'is-active': item === activeIcon }" @click="handleIconClick(item)">
              <i :class="item"></i>
            </a-button>
          </div>
          <jnpf-empty v-if="iconList.length === 0" />
        </ScrollContainer>
      </div>
    </AModal>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-icon-picker {
  width: 100%;

  :deep(.ant-input-group-addon) {
    padding: 0;
    cursor: pointer;

    span {
      display: inline-block;
      padding: 0 11px;
      line-height: 30px;
    }
  }

  :deep(.ant-input-suffix) {
    i {
      line-height: 20px;
      color: var(--text-color-help-dark);
    }
  }
}
</style>
