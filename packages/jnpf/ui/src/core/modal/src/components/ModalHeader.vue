<script lang="ts">
import type { PropType } from 'vue';

import { defineComponent } from 'vue';

import { BasicTitle } from '../../../basic';

export default defineComponent({
  components: { BasicTitle },
  emits: ['dblclick'],
  name: 'BasicModalHeader',
  props: {
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
    title: { type: String },
  },
});
</script>
<template>
  <BasicTitle :help-message="helpMessage">
    {{ title }}
  </BasicTitle>
</template>
