<script lang="ts">
import { computed, defineComponent, h, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { extendSlots } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { Popconfirm } from 'ant-design-vue';
import { omit } from 'lodash-es';

import BasicButton from './AButton.vue';

const props = {
  /**
   * Whether to enable the drop-down menu
   * @default: true
   */
  enable: {
    default: true,
    type: Boolean,
  },
};

export default defineComponent({
  inheritAttrs: false,
  name: 'PopButton',
  props,
  setup(props, { slots }) {
    const attrs = useAttrs();

    // get inherit binding value
    const getBindValues = computed(() => {
      return Object.assign(
        {
          cancelText: $t('common.cancelText'),
          okText: $t('common.okText'),
        },
        { ...props, ...unref(attrs) },
      );
    });

    return () => {
      const bindValues = omit(unref(getBindValues), 'icon');
      const btnBind = omit(bindValues, 'title') as Recordable;
      if (btnBind.disabled) btnBind.color = '';
      const Button = h(BasicButton, btnBind, extendSlots(slots));

      // If it is not enabled, it is a normal button
      if (!props.enable) {
        return Button;
      }
      return h(Popconfirm, bindValues, { default: () => Button });
    };
  },
});
</script>
