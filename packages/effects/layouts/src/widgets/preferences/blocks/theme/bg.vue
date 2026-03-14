<script setup lang="ts">
import type { ThemeBgType } from '@vben/types';

import { Check } from '@vben/icons';
import { $t } from '@vben/locales';

import { blueBg, defaultBg, greenBg, purpleBg } from './bgImg';

defineOptions({
  name: 'PreferenceBgTheme',
});

const modelValue = defineModel<ThemeBgType>({ default: '' });

const sysBgList: any[] = [
  {
    title: $t('preferences.theme.bgType.defaultBg'),
    type: '',
    img: defaultBg,
  },
  {
    title: $t('preferences.theme.bgType.blueBg'),
    type: 'blue',
    img: blueBg,
  },
  {
    title: $t('preferences.theme.bgType.purpleBg'),
    type: 'purple',
    img: purpleBg,
  },
  {
    title: $t('preferences.theme.bgType.greenBg'),
    type: 'green',
    img: greenBg,
  },
];

function handleSelect(type: ThemeBgType) {
  modelValue.value = type;
}
</script>

<template>
  <div class="bg-type-list">
    <template v-for="item in sysBgList" :key="item.type">
      <div
        class="bg-type-item"
        :class="{
          'bg-type-item-active': item.type === modelValue,
        }"
        @click="handleSelect(item.type)">
        <div class="bg-type-item-img">
          <img :src="item.img" />
          <Check class="bg-type-item-checked" v-if="item.type === modelValue" />
        </div>
        <p class="bg-type-item-title">{{ item.title }}</p>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bg-type-list {
  display: flex;
  justify-content: space-between;

  .bg-type-item {
    width: 77px;
    cursor: pointer;

    &.bg-type-item-active {
      .bg-type-item-img {
        border-color: var(--primary-color);
      }
    }

    .bg-type-item-img {
      position: relative;
      width: 100%;
      border: 1px solid #e5ebf5;
      border-radius: 9px;
      box-shadow: 0 5px 5px rgb(0 0 0 / 16%);
    }

    .bg-type-item-title {
      margin-top: 10px;
      font-size: 12px;
      text-align: center;
    }

    .bg-type-item-checked {
      position: absolute;
      right: -9px;
      bottom: -1px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      text-align: center;
      background: var(--primary-color);
      border-radius: 50%;
    }
  }
}
</style>
