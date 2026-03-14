import { defineComponent, toRefs, unref } from 'vue';

import { useAttrs } from '@jnpf/hooks';
import { extendSlots } from '@jnpf/utils';

import { Modal } from 'ant-design-vue';

import { useModalDragMove } from '../hooks/useModalDrag';
import { basicProps } from '../props';

export default defineComponent({
  emits: ['cancel'],
  inheritAttrs: false,
  name: 'Modal',
  props: basicProps,
  setup(props, { emit, slots }) {
    const { destroyOnClose, draggable, open } = toRefs(props);
    const attrs = useAttrs({ excludeDefaultKeys: false });
    useModalDragMove({
      destroyOnClose,
      draggable,
      open,
    });

    const onCancel = (e: Event) => {
      emit('cancel', e);
    };

    return () => {
      const propsData = { ...unref(attrs), ...props, onCancel } as Recordable;
      return <Modal {...propsData}>{extendSlots(slots)}</Modal>;
    };
  },
});
