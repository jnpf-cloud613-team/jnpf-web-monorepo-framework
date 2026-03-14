import type { VNode } from 'vue';

import type { LoadingProps } from './typing';

import { createVNode, defineComponent, h, reactive, render } from 'vue';

import Loading from './Loading.vue';

export function createLoading(props?: Partial<LoadingProps>, target?: HTMLElement, wait = false) {
  let vm: Nullable<VNode> = null;
  const data = reactive({
    loading: true,
    tip: '',
    ...props,
  });

  const LoadingWrap = defineComponent({
    render() {
      return h(Loading, { ...data });
    },
  });

  vm = createVNode(LoadingWrap);

  if (wait) {
    setTimeout(() => {
      render(vm, document.createElement('div'));
    }, 0);
  } else {
    render(vm, document.createElement('div'));
  }

  function close() {
    if (vm?.el && vm.el.parentNode) {
      vm.el.remove();
    }
  }

  function open(target: HTMLElement = document.body) {
    if (!vm || !vm.el) {
      return;
    }
    target.append(vm.el as HTMLElement);
  }

  if (target) {
    open(target);
  }
  return {
    get $el() {
      return vm?.el as HTMLElement;
    },
    close,
    get loading() {
      return data.loading;
    },
    open,
    setLoading: (loading: boolean) => {
      data.loading = loading;
    },
    setTip: (tip: string) => {
      data.tip = tip;
    },
    vm,
  };
}
