<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useGlobSetting } from '@jnpf/hooks';
import { checkImgType, getBase64WithFile, urlToBase64 } from '@jnpf/utils';

import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';

import { message, Upload } from 'ant-design-vue';

export default defineComponent({
  components: { Upload },
  emits: ['uploading', 'done', 'error', 'insert'],
  name: 'TinymceImageUpload',
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    fullscreen: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    let uploading = false;

    const { apiURL, uploadURL } = useGlobSetting();
    const accessStore = useAccessStore();

    const getButtonProps = computed(() => {
      const { disabled } = props;
      return { disabled };
    });
    const getAction = computed(() => `${uploadURL}/annexpic`);
    const getHeaders = computed(() => ({ Authorization: accessStore.accessToken }));

    function beforeUpload(file: File) {
      if (!checkImgType(file)) {
        message.error('请上传图片');
        return false;
      }
      getBase64WithFile(file).then(({ result: thumbUrl }) => {
        emit('insert', thumbUrl);
      });
      return false;
    }
    function handleChange(info: Recordable) {
      const file = info.file;
      const status = file?.status;
      const url = file?.response?.data?.url;
      const name = file?.name;
      switch (status) {
        case 'done': {
          urlToBase64(apiURL + url).then((base64) => {
            emit('done', name, base64);
          });
          uploading = false;

          break;
        }
        case 'error': {
          emit('error');
          uploading = false;

          break;
        }
        case 'uploading': {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
          break;
        }
        // No default
      }
    }

    return {
      beforeUpload,
      getAction,
      getButtonProps,
      getHeaders,
      handleChange,
      t: $t,
    };
  },
});
</script>
<template>
  <div :class="[{ fullscreen }]" class="jnpf-tinymce-img-upload">
    <!-- a-form-item-rest避免点击label触发图片上传 -->
    <a-form-item-rest>
      <Upload
        :action="getAction"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        accept=".jpg,.jpeg,.gif,.png,.webp"
        multiple
        name="file"
        @change="handleChange">
        <a-button type="link" v-bind="{ ...getButtonProps }">
          {{ t('component.upload.imgUpload') }}
        </a-button>
      </Upload>
    </a-form-item-rest>
  </div>
</template>
<style lang="scss" scoped>
.jnpf-tinymce-img-upload {
  position: absolute;
  top: 4px;
  right: 10px;
  z-index: 20;

  .ant-btn {
    padding: 0 !important;
  }

  &.fullscreen {
    position: fixed;
    z-index: 10000;
  }
}
</style>
