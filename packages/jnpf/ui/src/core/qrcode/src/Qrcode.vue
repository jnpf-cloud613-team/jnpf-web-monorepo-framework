<script lang="ts">
import type { QRCodeRenderersOptions } from 'qrcode';

import type { PropType } from 'vue';

import type { LogoType } from './qrcodePlus';
import type { QrcodeDoneEventParams } from './typing';

import { defineComponent, onMounted, ref, unref, watch } from 'vue';

import { downloadByUrl } from '@jnpf/utils';

import { toDataURL } from 'qrcode';

import { toCanvas } from './qrcodePlus';

export default defineComponent({
  emits: { done: (data: QrcodeDoneEventParams) => !!data, error: (error: any) => !!error },
  name: 'QrCode',
  props: {
    // 中间logo图标
    logo: {
      default: '',
      type: [String, Object] as PropType<Partial<LogoType> | string>,
    },
    // 参数
    options: {
      default: null,
      type: Object as PropType<QRCodeRenderersOptions>,
    },
    // img 不支持内嵌logo
    tag: {
      default: 'canvas',
      type: String as PropType<'canvas' | 'img'>,
      validator: (v: string) => ['canvas', 'img'].includes(v),
    },
    value: {
      default: null,
      type: [String, Array] as PropType<any[] | string>,
    },
    // 宽度
    width: {
      default: 200,
      type: Number as PropType<number>,
    },
  },
  setup(props, { emit }) {
    const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null);
    async function createQrcode() {
      try {
        const { logo, options = {}, tag, value, width } = props;
        const renderValue = String(value);
        const wrapEl = unref(wrapRef);

        if (!wrapEl) return;

        if (tag === 'canvas') {
          const url: string = await toCanvas({
            canvas: wrapEl,
            content: renderValue,
            logo: logo as any,
            options: options || {},
            width,
          });
          emit('done', { ctx: (wrapEl as HTMLCanvasElement).getContext('2d'), url });
          return;
        }

        if (tag === 'img') {
          const url = await toDataURL(renderValue, {
            errorCorrectionLevel: 'H',
            width,
            ...options,
          });
          (unref(wrapRef) as HTMLImageElement).src = url;
          emit('done', { url });
        }
      } catch (error) {
        emit('error', error);
      }
    }
    /**
     * file download
     */
    function download(fileName?: string) {
      let url = '';
      const wrapEl = unref(wrapRef);
      if (wrapEl instanceof HTMLCanvasElement) {
        url = wrapEl.toDataURL();
      } else if (wrapEl instanceof HTMLImageElement) {
        url = wrapEl.src;
      }
      if (!url) return;
      downloadByUrl({
        fileName,
        url,
      });
    }

    onMounted(createQrcode);

    // 监听参数变化重新生成二维码
    watch(
      props,
      () => {
        createQrcode();
      },
      {
        deep: true,
      },
    );

    return { download, wrapRef };
  },
});
</script>
<template>
  <div>
    <component :is="tag" ref="wrapRef" />
  </div>
</template>
