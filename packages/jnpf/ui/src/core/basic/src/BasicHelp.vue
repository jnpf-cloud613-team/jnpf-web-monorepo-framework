<script lang="tsx">
import type { CSSProperties, PropType } from 'vue';

import { computed, defineComponent, unref } from 'vue';

import { getPopupContainer, getSlot, isArray, isString } from '@jnpf/utils';

import { QuestionCircleFilled } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';

const props = {
  /**
   * Help text font color
   * @default: #ffffff
   */
  color: { default: '#ffffff', type: String },
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize: { default: '14px', type: String },
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth: { default: '600px', type: String },
  /**
   * Help text list
   */
  placement: { default: 'top', type: String },
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex: { type: Boolean },
  /**
   * Help text list
   */
  text: { type: [Array, String] as PropType<string | string[]> },
};

export default defineComponent({
  components: { Tooltip },
  name: 'BasicHelp',
  props,
  setup(props, { slots }) {
    const getTooltipStyle = computed((): CSSProperties => ({ color: props.color, fontSize: props.fontSize }));

    const getOverlayStyle = computed((): CSSProperties => ({ maxWidth: props.maxWidth }));

    function renderTitle() {
      const textList = isString(props.text) ? props.text.split('\n') : props.text;

      if (isArray(textList)) {
        return textList.map((text, index) => {
          return (
            <p key={text}>
              <>
                {props.showIndex ? `${index + 1}. ` : ''}
                {text}
              </>
            </p>
          );
        });
      }
      return null;
    }

    return () => {
      return (
        <Tooltip
          autoAdjustOverflow={true}
          getPopupContainer={() => getPopupContainer()}
          overlayClassName={`jnpf-basic-help__wrap`}
          overlayStyle={unref(getOverlayStyle)}
          placement={props.placement as 'right'}
          title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}>
          <span class="jnpf-basic-help">{getSlot(slots) || <QuestionCircleFilled />}</span>
        </Tooltip>
      );
    };
  },
});
</script>
<style lang="scss">
.jnpf-basic-help {
  display: inline-block;
  margin-left: 4px;
  font-size: 14px;
  color: var(--text-color-secondary);
  cursor: pointer;

  &:hover {
    color: var(--primary-color);
  }

  &__wrap {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
