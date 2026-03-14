<script lang="ts">
import type { PropType } from 'vue';

import { computed, defineComponent } from 'vue';

import { BasicTitle } from '@jnpf/ui';
import { isFunction } from '@jnpf/utils';

export default defineComponent({
  components: { BasicTitle },
  name: 'BasicTableTitle',
  props: {
    getSelectRows: {
      type: Function as PropType<() => Recordable[]>,
    },
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
    title: {
      type: [Function, String] as PropType<((data: Recordable) => string) | string>,
    },
  },
  setup(props) {
    const prefixCls = 'jnpf-basic-table-title';

    const getTitle = computed(() => {
      const { getSelectRows = () => {}, title } = props;
      let tit = title;

      if (isFunction(title)) {
        tit = title({
          selectRows: getSelectRows(),
        });
      }
      return tit;
    });

    return { getTitle, prefixCls };
  },
});
</script>
<template>
  <BasicTitle v-if="getTitle" :class="prefixCls" :help-message="helpMessage">
    {{ getTitle }}
  </BasicTitle>
</template>
<style lang="scss">
.jnpf-basic-table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
