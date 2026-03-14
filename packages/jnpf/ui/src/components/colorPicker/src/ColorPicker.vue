<script lang="ts">
import type { PropType } from 'vue';

import type { ComponentSize } from './type/types';
import type { IUseOptions } from './useOptions';

import { computed, defineComponent, nextTick, onMounted, provide, reactive, ref, unref, watch } from 'vue';

import { $t } from '@vben/locales';

import { CloseOutlined, DownOutlined } from '@ant-design/icons-vue';
import { useDebounceFn } from '@vueuse/core';
import { Form } from 'ant-design-vue';

import AlphaSlider from './components/alphaSlider.vue';
import HueSlider from './components/hueSlider.vue';
import preDefine from './components/preDefine.vue';
import SvPanel from './components/svPanel.vue';
import { isValidComponentSize } from './lib//validators';
import Color from './lib/color';
import { OPTIONS_KEY } from './useOptions';

const UPDATE_MODEL_EVENT = 'update:value';

export default defineComponent({
  components: {
    AlphaSlider,
    CloseOutlined,
    DownOutlined,
    HueSlider,
    PreDefine: preDefine,
    SvPanel,
  },
  emits: ['activeChange', 'change', UPDATE_MODEL_EVENT],
  inheritAttrs: false,
  name: 'JnpfColorPicker',
  props: {
    allowClear: {
      default: true,
      type: Boolean,
    },
    colorFormat: {
      default: '',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    popperClass: {
      type: String,
    },
    predefine: {
      default: () => [],
      type: Array,
    },
    showAlpha: {
      type: Boolean,
    },
    size: {
      type: String as PropType<ComponentSize>,
      validator: isValidComponentSize,
    },
    value: {
      type: String,
    },
  },
  setup(props, { emit }) {
    // 区分popover的关闭是通过点击body关闭的还是通过按钮、输入框关闭的
    const hasClickBtn = ref<boolean>(false);
    const hue = ref<any>(null);
    const svPanel = ref<any>(null);
    const alpha = ref<any>(null);
    // data
    const color = reactive(
      new Color({
        enableAlpha: props.showAlpha,
        format: props.colorFormat,
      }),
    );
    const showPicker = ref(false);
    const showPanelColor = ref(false);
    const customInput = ref('');
    const formItemContext = Form.useInjectFormItemContext();
    // computed
    const displayedColor = computed(() => {
      if (!props.value && !showPanelColor.value) {
        return 'transparent';
      }
      return displayedRgb(color, props.showAlpha);
    });
    const colorSize = computed(() => {
      return props.size;
    });
    const colorDisabled = computed(() => {
      return props.disabled;
    });
    const currentColor = computed(() => {
      return !props.value && !showPanelColor.value ? '' : color.value;
    });
    // watch
    watch(
      () => unref(props.value),
      (newVal) => {
        if (!newVal) {
          showPanelColor.value = false;
        } else if (newVal && newVal !== color.value) {
          color.fromString(newVal);
        }
      },
    );
    watch(
      () => currentColor.value,
      (val) => {
        customInput.value = val;
        emit('activeChange', val);
      },
    );
    watch(
      () => color.value,
      () => {
        if (!props.value && !showPanelColor.value) {
          showPanelColor.value = true;
        }
      },
    );
    watch(
      () => showPicker.value,
      (newVal) => {
        if (newVal) {
          hasClickBtn.value = false;
        } else {
          if (!hasClickBtn.value) {
            hide();
          }
        }
        nextTick(() => {
          hue.value?.update();
          setTimeout(() => {
            svPanel.value?.update();
          }, 20);

          alpha.value?.update();
        });
      },
    );
    // methods
    function displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw new TypeError('color should be instance of _color Class');
      }
      const { b, g, r } = color.toRgb();
      return showAlpha ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})` : `rgb(${r}, ${g}, ${b})`;
    }
    function setShowPicker(value) {
      showPicker.value = value;
    }
    const debounceSetShowPicker = useDebounceFn(setShowPicker, 50);
    function hide() {
      debounceSetShowPicker(false);
      resetColor();
    }
    function resetColor() {
      nextTick(() => {
        if (props.value) {
          color.fromString(props.value);
        } else {
          showPanelColor.value = false;
        }
      });
    }
    function handleTrigger() {
      if (colorDisabled.value) return;
      debounceSetShowPicker(!showPicker.value);
    }
    function handleConfirm() {
      // hasClickBtn.value = true
      color.fromString(customInput.value);
    }
    function confirmValue() {
      hasClickBtn.value = true;
      const value = color.value;
      emit(UPDATE_MODEL_EVENT, value);
      emit('change', value);
      formItemContext.onFieldChange();
      debounceSetShowPicker(false);
      nextTick(() => {
        const newColor = new Color({
          enableAlpha: props.showAlpha,
          format: props.colorFormat,
        });
        newColor.fromString(props.value);
        if (!color.compare(newColor)) {
          resetColor();
        }
      });
      showPicker.value = false;
    }
    function clear() {
      hasClickBtn.value = true;
      debounceSetShowPicker(false);
      emit(UPDATE_MODEL_EVENT, null);
      emit('change', null);
      formItemContext.onFieldChange();
      resetColor();
      showPicker.value = false;
    }

    function getPopupContainer(triggerNode: HTMLElement) {
      return triggerNode.parentElement;
    }

    onMounted(() => {
      if (props.value) {
        color.fromString(props.value);
        customInput.value = currentColor.value;
      }
    });
    provide<IUseOptions>(OPTIONS_KEY, {
      currentColor,
    });
    return {
      alpha,
      clear,
      color: color as Color,
      colorDisabled,
      colorSize,
      confirmValue,
      customInput,
      displayedColor,
      getPopupContainer,
      handleConfirm,
      handleTrigger,
      hue,
      showPanelColor,
      showPicker,
      svPanel,
      t: $t,
    };
  },
});
</script>
<template>
  <a-popover
    v-model:open="showPicker"
    :class="[colorSize ? `jnpf-color-picker--${colorSize}` : '']"
    class="jnpf-color-picker"
    trigger="click"
    v-bind="$attrs"
    v-if="!colorDisabled">
    <template #content>
      <div class="ant-color-dropdown__main-wrapper">
        <SvPanel ref="svPanel" :color="color" />
        <HueSlider ref="hue" :color="color" class="hue-slider" vertical />
      </div>
      <AlphaSlider v-if="showAlpha" ref="alpha" :color="color" />
      <PreDefine v-if="predefine.length > 0" :color="color" :colors="predefine" />
      <div class="ant-color-dropdown__btns">
        <span class="ant-color-dropdown__value">
          <a-input v-model:value="customInput" size="small" @blur="handleConfirm" @press-enter="handleConfirm" />
        </span>
        <div class="ant-dropdown__btns">
          <a-button v-if="allowClear" class="ant-cancel-button" size="small" type="link" @click="clear">{{ t('common.cleanText') }}</a-button>
          <a-button size="small" @click="confirmValue">{{ t('common.okText') }}</a-button>
        </div>
      </div>
    </template>
    <div class="ant-color-picker__trigger" @click="handleTrigger">
      <span :class="{ 'is-alpha': showAlpha }" class="ant-color-picker__color">
        <span :style="{ backgroundColor: displayedColor }" class="ant-color-picker__color-inner">
          <DownOutlined v-show="value || showPanelColor" style="color: #909399" />
          <CloseOutlined v-if="!value && !showPanelColor" style="color: #909399" />
        </span>
      </span>
    </div>
  </a-popover>
  <div v-if="colorDisabled" :class="[colorSize ? `jnpf-color-picker--${colorSize}` : '']" class="jnpf-color-picker ant-color-picker__trigger is-disabled">
    <span :class="{ 'is-alpha': showAlpha }" class="ant-color-picker__color">
      <span :style="{ backgroundColor: displayedColor }" class="ant-color-picker__color-inner">
        <DownOutlined v-show="value || showPanelColor" style="color: #909399" />
        <CloseOutlined v-if="!value && !showPanelColor" style="color: #909399" />
      </span>
    </span>
  </div>
</template>
<style lang="scss" scoped>
// default 大小
.jnpf-color-picker {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 36px;
  height: 36px;
  padding: 4px;
  font-size: 0;
  cursor: pointer;
  border: 1px solid var(--border-color-base);
  border-radius: var(--radius);

  &.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }

  .ant-color-picker__color {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    border: 1px solid var(--info-color);
    border-radius: 2px;

    &.is-alpha {
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==');
    }
  }

  .ant-color-picker__color-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 12px;
    line-height: 28px;
  }
}

.ant-color-picker__trigger {
  border-radius: var(--radius);
}

.ant-color-dropdown__main-wrapper {
  display: flex;
  height: 180px;
  margin-bottom: 8px;
}

.ant-color-dropdown__btns {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  text-align: right;
}

.ant-color-dropdown__value {
  font-size: 12px;
  color: #000;
}

.ant-cancel-button {
  margin-right: 6px;
}

// large 大小
.jnpf-color-picker--large {
  width: 40px;
  height: 40px;
}

//small 大小
.jnpf-color-picker--small {
  width: 32px;
  height: 32px;
}
</style>
<style lang="scss">
.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  .jnpf-color-picker {
    &.is-disabled {
      background-color: rgb(255 255 255 / 8%) !important;
    }
  }
}
</style>
