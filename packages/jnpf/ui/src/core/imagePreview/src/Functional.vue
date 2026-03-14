<!-- eslint-disable no-unused-vars -->
<script lang="tsx">
import { computed, defineComponent, reactive, ref, unref, watchEffect } from 'vue';

import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

import rotateSvg from './svg/p-rotate.svg';
import resumeSvg from './svg/resume.svg';
import scaleSvg from './svg/scale.svg';
import unRotateSvg from './svg/unrotate.svg';
import unScaleSvg from './svg/unscale.svg';

enum StatueEnum {
  LOADING,
  DONE,
  FAIL,
}
interface ImgState {
  currentIndex: number;
  currentUrl: string;
  imgLeft: number;
  imgRotate: number;
  imgScale: number;
  imgTop: number;
  moveX: number;
  moveY: number;
  show: boolean;
  status: StatueEnum;
}
interface StateInfo {
  left: number;
  rotate: number;
  scale: number;
  top: number;
}

const props = {
  defaultWidth: {
    type: Number as PropType<number>,
  },
  imageList: {
    default: null,
    type: Array as PropType<string[]>,
  },
  index: {
    default: 0,
    type: Number as PropType<number>,
  },
  maskClosable: {
    type: Boolean as PropType<boolean>,
  },
  rememberState: {
    type: Boolean as PropType<boolean>,
  },
  scaleStep: {
    type: Number as PropType<number>,
  },
  show: {
    default: false,
    type: Boolean as PropType<boolean>,
  },
  zIndex: {
    default: 2000,
    type: Number as PropType<number>,
  },
};

const prefixCls = 'img-preview';
export default defineComponent({
  emits: ['imgLoad', 'imgError'],
  name: 'ImagePreview',
  props,
  setup(props, { emit, expose }) {
    const stateMap = new Map<string, StateInfo>();
    const imgState = reactive<ImgState>({
      currentIndex: 0,
      currentUrl: '',
      imgLeft: 0,
      imgRotate: 0,
      imgScale: 1,
      imgTop: 0,
      moveX: 0,
      moveY: 0,
      show: props.show,
      status: StatueEnum.LOADING,
    });

    const wrapElRef = ref<HTMLDivElement | null>(null);
    const imgElRef = ref<HTMLImageElement | null>(null);

    // 初始化
    function init() {
      initMouseWheel();
      const { imageList, index } = props;

      if (!imageList || imageList.length === 0) {
        throw new Error('imageList is undefined');
      }
      imgState.currentIndex = index;
      handleIChangeImage(imageList[index]);
    }

    // 重置
    function initState() {
      imgState.imgScale = 1;
      imgState.imgRotate = 0;
      imgState.imgTop = 0;
      imgState.imgLeft = 0;
    }

    // 初始化鼠标滚轮事件
    function initMouseWheel() {
      const wrapEl = unref(wrapElRef);
      if (!wrapEl) {
        return;
      }
      (wrapEl as any).onmousewheel = scrollFunc;
      // 火狐浏览器没有onmousewheel事件，用DOMMouseScroll代替
      document.body.addEventListener('DOMMouseScroll', scrollFunc);
      // 禁止火狐浏览器下拖拽图片的默认事件
      document.addEventListener('dragstart', () => {
        return false;
      });
    }

    const getScaleStep = computed(() => {
      const scaleStep = props?.scaleStep ?? 0;
      return (scaleStep ?? (scaleStep > 0 && scaleStep < 100)) ? scaleStep / 100 : imgState.imgScale / 10;
    });

    // 监听鼠标滚轮
    function scrollFunc(e: any) {
      e = e || window.event;
      e.delta = e.wheelDelta || -e.detail;

      e.preventDefault();
      if (e.delta > 0) {
        // 滑轮向上滚动
        scaleFunc(getScaleStep.value);
      }
      if (e.delta < 0) {
        // 滑轮向下滚动
        scaleFunc(-getScaleStep.value);
      }
    }
    // 缩放函数
    function scaleFunc(num: number) {
      if (imgState.imgScale <= 0.25 && num < 0) return;
      imgState.imgScale += num;
    }

    // 旋转图片
    function rotateFunc(deg: number) {
      imgState.imgRotate += deg;
    }

    // 鼠标事件
    function handleMouseUp() {
      const imgEl = unref(imgElRef);
      if (!imgEl) return;
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      imgEl.onmousemove = null;
    }

    // 更换图片
    function handleIChangeImage(url: string) {
      imgState.status = StatueEnum.LOADING;
      const img = new Image();
      img.src = url;
      img.addEventListener('load', (e: Event) => {
        if (imgState.currentUrl !== url) {
          const ele: any[] = e.composedPath();
          if (props.rememberState) {
            // 保存当前图片的缩放信息
            stateMap.set(imgState.currentUrl, {
              left: imgState.imgLeft,
              rotate: imgState.imgRotate,
              scale: imgState.imgScale,
              top: imgState.imgTop,
            });
            // 如果之前已存储缩放信息，就应用
            const stateInfo = stateMap.get(url);
            if (stateInfo) {
              imgState.imgScale = stateInfo.scale;
              imgState.imgTop = stateInfo.top;
              imgState.imgRotate = stateInfo.rotate;
              imgState.imgLeft = stateInfo.left;
            } else {
              initState();
              if (props.defaultWidth) {
                imgState.imgScale = props.defaultWidth / ele[0].naturalWidth;
              }
            }
          } else {
            if (props.defaultWidth) {
              imgState.imgScale = props.defaultWidth / ele[0].naturalWidth;
            }
          }

          ele &&
            emit('imgLoad', {
              dom: ele[0] as HTMLImageElement,
              index: imgState.currentIndex,
              url,
            });
        }
        imgState.currentUrl = url;
        imgState.status = StatueEnum.DONE;
      });
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      img.onerror = (e: any) => {
        const ele: EventTarget[] = e.composedPath();
        ele &&
          emit('imgError', {
            dom: ele[0] as HTMLImageElement,
            index: imgState.currentIndex,
            url,
          });
        imgState.status = StatueEnum.FAIL;
      };
    }

    // 关闭
    function handleClose(e: MouseEvent) {
      e && e.stopPropagation();
      close();
    }

    function close() {
      imgState.show = false;
      // 移除火狐浏览器下的鼠标滚动事件
      document.body.removeEventListener('DOMMouseScroll', scrollFunc);
      // 恢复火狐及Safari浏览器下的图片拖拽
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      document.ondragstart = null;
    }

    // 图片复原
    function resume() {
      initState();
    }

    expose({
      close,
      next: handleChange.bind(null, 'right'),
      prev: handleChange.bind(null, 'left'),
      resume,
      setRotate: (rotate: number) => {
        imgState.imgRotate = rotate;
      },
      setScale: (scale: number) => {
        if (scale > 0 && scale <= 10) imgState.imgScale = scale;
      },
    });

    // 上一页下一页
    function handleChange(direction: 'left' | 'right') {
      const { currentIndex } = imgState;
      const { imageList } = props;
      if (direction === 'left') {
        imgState.currentIndex--;
        if (currentIndex <= 0) {
          imgState.currentIndex = imageList.length - 1;
        }
      }
      if (direction === 'right') {
        imgState.currentIndex++;
        if (currentIndex >= imageList.length - 1) {
          imgState.currentIndex = 0;
        }
      }
      handleIChangeImage(imageList[imgState.currentIndex]);
    }

    function handleAddMoveListener(e: MouseEvent) {
      e = e || window.event;
      imgState.moveX = e.clientX;
      imgState.moveY = e.clientY;
      const imgEl = unref(imgElRef);
      if (imgEl) {
        imgEl.addEventListener('mousemove', moveFunc);
      }
    }

    function moveFunc(e: MouseEvent) {
      e = e || window.event;
      e.preventDefault();
      const movementX = e.clientX - imgState.moveX;
      const movementY = e.clientY - imgState.moveY;
      imgState.imgLeft += movementX;
      imgState.imgTop += movementY;
      imgState.moveX = e.clientX;
      imgState.moveY = e.clientY;
    }

    // 获取图片样式
    const getImageStyle = computed(() => {
      const { imgLeft, imgRotate, imgScale, imgTop } = imgState;
      return {
        marginLeft: `${imgLeft}px`,
        marginTop: `${imgTop}px`,
        maxHeight: '100%',
        maxWidth: props.defaultWidth ? 'unset' : '100%',
        transform: `scale(${imgScale}) rotate(${imgRotate}deg)`,
      };
    });

    const getIsMultipleImage = computed(() => {
      const { imageList } = props;
      return imageList.length > 1;
    });

    watchEffect(() => {
      if (props.show) {
        init();
      }
      if (props.imageList) {
        initState();
      }
    });

    const handleMaskClick = (e: MouseEvent) => {
      if (props.maskClosable && e.target && (e.target as HTMLDivElement).classList.contains(`${prefixCls}-content`)) {
        handleClose(e);
      }
    };

    const renderClose = () => {
      return (
        <div class={`${prefixCls}__close`} onClick={handleClose}>
          <CloseOutlined class={`${prefixCls}__close-icon`} />
        </div>
      );
    };

    const renderIndex = () => {
      if (!unref(getIsMultipleImage)) {
        return null;
      }
      const { currentIndex } = imgState;
      const { imageList } = props;
      return (
        <div class={`${prefixCls}__index`}>
          {currentIndex + 1} / {imageList.length}
        </div>
      );
    };

    const renderController = () => {
      return (
        <div class={`${prefixCls}__controller`}>
          <div class={`${prefixCls}__controller-item`} onClick={() => scaleFunc(-getScaleStep.value)}>
            <img src={unScaleSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={() => scaleFunc(getScaleStep.value)}>
            <img src={scaleSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={resume}>
            <img src={resumeSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={() => rotateFunc(-90)}>
            <img src={unRotateSvg} />
          </div>
          <div class={`${prefixCls}__controller-item`} onClick={() => rotateFunc(90)}>
            <img src={rotateSvg} />
          </div>
        </div>
      );
    };

    const renderArrow = (direction: 'left' | 'right') => {
      if (!unref(getIsMultipleImage)) {
        return null;
      }
      return (
        <div class={[`${prefixCls}__arrow`, direction]} onClick={() => handleChange(direction)}>
          {direction === 'left' ? <LeftOutlined /> : <RightOutlined />}
        </div>
      );
    };

    return () => {
      return (
        imgState.show && (
          <div class={prefixCls} onClick={handleMaskClick} onMouseup={handleMouseUp} ref={wrapElRef} style={{ zIndex: props.zIndex || 2000 }}>
            <div class={`${prefixCls}-content`}>
              {/* <Spin*/}
              {/*  indicator={<LoadingOutlined style="font-size: 24px" spin />}*/}
              {/*  spinning={true}*/}
              {/*  class={[*/}
              {/*    `${prefixCls}-image`,*/}
              {/*    {*/}
              {/*      hidden: imgState.status !== StatueEnum.LOADING,*/}
              {/*    },*/}
              {/*  ]}*/}
              {/* />*/}
              <img
                class={[`${prefixCls}-image`, imgState.status === StatueEnum.DONE ? '' : 'hidden']}
                onMousedown={handleAddMoveListener}
                ref={imgElRef}
                src={imgState.currentUrl}
                style={unref(getImageStyle)}
              />
              {renderClose()}
              {renderIndex()}
              {renderController()}
              {renderArrow('left')}
              {renderArrow('right')}
            </div>
          </div>
        )
      );
    };
  },
});
</script>
<style lang="scss">
.img-preview {
  position: fixed;
  inset: 0;
  z-index: 2000;
  user-select: none;
  background: rgb(0 0 0 / 50%);

  &-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
  }

  &-image {
    cursor: pointer;
    transition: transform 0.3s;
  }

  &__close {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 80px;
    height: 80px;
    overflow: hidden;
    color: #fff;
    cursor: pointer;
    background-color: rgb(0 0 0 / 50%);
    border-radius: 50%;
    transition: all 0.2s;

    &-icon {
      position: absolute;
      top: 46px;
      left: 16px;
      font-size: 16px;
    }

    &:hover {
      background-color: rgb(0 0 0 / 80%);
    }
  }

  &__index {
    position: absolute;
    bottom: 5%;
    left: 50%;
    padding: 0 22px;
    font-size: 16px;
    background: rgb(109 109 109 / 60%);
    border-radius: 15px;
    transform: translateX(-50%);
  }

  &__controller {
    position: absolute;
    bottom: 10%;
    left: 50%;
    display: flex;
    justify-content: center;
    width: 260px;
    height: 44px;
    padding: 0 22px;
    margin-left: -139px;
    background: rgb(109 109 109 / 60%);
    border-radius: 22px;

    &-item {
      display: flex;
      height: 100%;
      padding: 0 9px;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.2);
      }

      img {
        width: 1em;
      }
    }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    font-size: 28px;
    cursor: pointer;
    background-color: rgb(0 0 0 / 50%);
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background-color: rgb(0 0 0 / 80%);
    }

    &.left {
      left: 50px;
    }

    &.right {
      right: 50px;
    }
  }
}
</style>
