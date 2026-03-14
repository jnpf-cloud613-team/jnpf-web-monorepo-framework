<script setup lang="ts">
import type { BuiltinThemePreset } from '@vben/preferences';
import type { BuiltinThemeType } from '@vben/types';

import { computed, ref, watch } from 'vue';

import { Check } from '@vben/icons';
import { $t } from '@vben/locales';
import { BUILT_IN_THEME_PRESETS } from '@vben/preferences';
import { convertToHsl, TinyColor } from '@vben/utils';

import { globalShareState } from '@vben-core/shared/global-state';

defineOptions({
  name: 'PreferenceBuiltinTheme',
});

const props = withDefaults(defineProps<{ isDark?: boolean; pickerPlacement?: string }>(), {
  isDark: false,
  pickerPlacement: 'topRight',
});

const { ColorPicker } = globalShareState.getComponents();
const customColor = ref('');
const modelValue = defineModel<BuiltinThemeType>({ default: 'default' });
const themeColorPrimary = defineModel<string>('themeColorPrimary');

const builtinThemePresets = computed(() => {
  return [...BUILT_IN_THEME_PRESETS];
});

function typeView(name: BuiltinThemeType) {
  switch (name) {
    case 'custom': {
      return $t('preferences.theme.builtin.custom');
    }
    case 'deep-blue': {
      return $t('preferences.theme.builtin.deepBlue');
    }
    case 'deep-green': {
      return $t('preferences.theme.builtin.deepGreen');
    }
    case 'default': {
      return $t('preferences.theme.builtin.default');
    }
    case 'gray': {
      return $t('preferences.theme.builtin.gray');
    }
    case 'green': {
      return $t('preferences.theme.builtin.green');
    }

    case 'neutral': {
      return $t('preferences.theme.builtin.neutral');
    }
    case 'orange': {
      return $t('preferences.theme.builtin.orange');
    }
    case 'pink': {
      return $t('preferences.theme.builtin.pink');
    }
    case 'rose': {
      return $t('preferences.theme.builtin.rose');
    }
    case 'sky-blue': {
      return $t('preferences.theme.builtin.skyBlue');
    }
    case 'slate': {
      return $t('preferences.theme.builtin.slate');
    }
    case 'violet': {
      return $t('preferences.theme.builtin.violet');
    }
    case 'yellow': {
      return $t('preferences.theme.builtin.yellow');
    }
    case 'zinc': {
      return $t('preferences.theme.builtin.zinc');
    }
  }
}

function handleSelect(theme: BuiltinThemePreset) {
  if (theme.type === 'custom') {
    customColor.value = new TinyColor(themeColorPrimary.value || '').toHexString();
    return;
  }
  modelValue.value = theme.type;
}
function onCustomColorChange(color) {
  modelValue.value = 'custom';
  themeColorPrimary.value = convertToHsl(color);
}

watch(
  () => [modelValue.value, props.isDark] as [BuiltinThemeType, boolean],
  ([themeType, isDark], [_, isDarkPrev]) => {
    const theme = builtinThemePresets.value.find((item) => item.type === themeType);
    if (theme && theme.color) {
      const primaryColor = isDark ? theme.darkPrimaryColor || theme.primaryColor : theme.primaryColor;

      if (!(theme.type === 'custom' && isDark !== isDarkPrev)) {
        themeColorPrimary.value = primaryColor || theme.color;
      }
    }
  },
);
</script>

<template>
  <div class="builtin-list">
    <template v-for="theme in builtinThemePresets" :key="theme.type">
      <div
        class="builtin-item"
        :class="{
          'builtin-item-active': theme.type === modelValue,
          'builtin-item-custom': theme.type === 'custom',
        }"
        @click="handleSelect(theme)"
        :style="{ backgroundColor: theme.color }"
        :title="typeView(theme.type)">
        <Check v-if="theme.type === modelValue" />
        <ColorPicker
          v-model:value="customColor"
          :placement="pickerPlacement"
          :allow-clear="false"
          class="custom-item_picker"
          @change="onCustomColorChange"
          v-if="theme.type === 'custom'" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.builtin-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .builtin-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 20px;
    color: #fff;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 4px;

    &.builtin-item-custom {
      position: relative;
      overflow: hidden;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABHNCSVQICAgIfAhkiAAABXhJREFUSEuVlsuKXFUUhtc+16pK39BEREdOMpQ4cOAo5AnM1KfQR9CZjyCiRFCEQLST6EScdCMKDgKCogjxHgkx6XT6Wpdz2X7/Oud0NxE1KXr3qrOr6nznW2vfgvG6/Em8mNbx1bwN59IqruWNWVqZFbVZtojE4LGkL20ay2JtSVtZZo2lxDQSYxeTtraU/kR9xNAqthshxDfCmy9uhPc/A9bE9awJBtQyQWi5GgBvguoBFupv/eaCCjbE1HRNE1SfCQosUbSWmwZ+bBfCpc/jRt7a+USwFpMqWg5cRg51s2D5nChg1VrusEUPIzpMcEE68+CmrZtaDiwjlVmyGd7diDGRldLYCNJDe0NZFTIkljMaD5Q5jBs7RHGAK62yHEwHmNvJ8kF464sYM4zTAXrCsASez1vMgpUYjubEqQwFmfdx4fHYuK8l0DCYFQkAgFyHt7+KsRVwgHoNVTNgg9ncgNFm0cZTftcsrIiAGkGxAz7YdnWsOthRczsgAN/5uo0xBqO+5F2mfVr70VkAGZHO0TTaZBZsfMB1UwGbWSHLdkYTdDAVDEABQE21y3tDoOHSjc4w0hQF9lHqI5SBQhpHpFNmk8Nopw7MxvMK2NRKhwoocGeZ5JFC97DBUFDslNbw3jdtNDckDJHRav08lOEY6FiwQ7OlvWhL0xrLA9rUiubQyh6YaDCM+G2JUdGb+eikjy7F8MF3rRs6VGxggrfEBlNNhRKow/bNVnajre42Nmn2bVzvAQUIONUwn3BXAY/S2afU7Tpo+PAHKLw6aBcFbWTMfKx9tSGN1G4F4Np2tDNbWFbbtlTvOjTXsrTE3QQc0tnNO0DcNBVJEcPLN6UFRE2wE+9VzwYoY8QYmLZMOk9vmT37Z7Qnp/dsZXHPxgnqaxRHQMHUlMIhjZoOCdf8ueGVX1DhiqFKD9GFld7OmKXTH6QGWlHLU9id/cnsubt/2BPtX2ZPo7LCXYdUCiCYAEqjbjIAA4brt5Q7JbX/UF8ZrnkT+4cYpk7FfEx+N3vlyxtmz486M9Wsr5Hfxpug3cM7VNe6un67iYELv/WJz/yr/h1PAP9RTVprk7nVkzv28rfbLIXdTR7nFT69Ww3J7EWFEkSPQC5ZDWIQrHZYW+zZavbAzm4v7Jlfi8eGhuv3phgKIUPNRSBJD8MoshNY0gBbWMxmlqb7djqZ2VPTys7cyW15K2VZfHTTcP3+vsblCSMZCiqz2u2iYOnC2nRmy2Fhq2Fua1Vtq/czW95JbbyfPLJpuLb9AEMlr+0MB5jXDLOgbV7pnLGA1DZhCVpOKuYgcTezyW7CkpdaMWUDf4Sahms7W9RQterN+ppFYDLsasd2BLjEdkKfoBM21skesIPERocJq1HCVvb/0HB1504cataZCjIMFBkuLAGe0z+iv2TrmXA9YhuSWXnI4j7rDItFYhnT5r9qGq7u3e4MfYDIVGZdOr2GGOb0F/QVpHlELAXnfTnFjlawbZVzDNmoMzX20n9Lb1jfv8Xw7GEO7eZbl04dgABiLsOS7wmq1BakVBCZlZjlQIuKweMHLaKf8P45esP6wW8sIsN8O2EoS1rOZ5kMaTmwooe6MTUrZKaodGKXY+eGHE90bHkYGj46/NlHaWemeFxDmenYdwR1eAcVXGaqmcwyoDLTzpIJJjCGjLfjmoawEz6e3tzA8Hy3ohwbpqB1zMt6Q0FVS7UOyunNz6w6+8gM2GBHf9aQVhkCpzKD6Wa4Mv/xIpleP6qdDq6YyiyToUO5uZsS+fwo+om8T6MGS2+mc63MBNURVGl1aEwveFWvzL+/GJP4GpvQOdK7Kkg6wB425Tqjfpmin3269HnUAzhUMCB6rxN9Y5u01/MXXtr4G/GupBzUiWeFAAAAAElFTkSuQmCC');

      .custom-item_picker,
      :deep(.custom-item_picker) {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}
</style>
