import type { Ref } from 'vue';

import { ref, watchEffect } from 'vue';

interface IntersectionObserverProps {
  onIntersect: IntersectionObserverCallback;
  root?: Ref<any>;
  rootMargin?: string;
  target: Ref<Element | null | undefined>;
  threshold?: number;
}

export function useIntersectionObserver({ onIntersect, root, rootMargin = '0px', target, threshold = 0.1 }: IntersectionObserverProps) {
  let cleanup = () => {};
  const observer: Ref<Nullable<IntersectionObserver>> = ref(null);
  const stopEffect = watchEffect(() => {
    cleanup();

    observer.value = new IntersectionObserver(onIntersect, {
      root: root ? root.value : null,
      rootMargin,
      threshold,
    });

    const current = target.value;

    current && observer.value.observe(current);

    cleanup = () => {
      if (observer.value) {
        observer.value.disconnect();
        target.value && observer.value.unobserve(target.value);
      }
    };
  });

  return {
    observer,
    stop: () => {
      cleanup();
      stopEffect();
    },
  };
}
