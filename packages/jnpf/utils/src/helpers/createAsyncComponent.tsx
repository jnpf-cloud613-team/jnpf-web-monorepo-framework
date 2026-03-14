import { defineAsyncComponent } from 'vue';

import { Spin } from 'ant-design-vue';

interface Options {
  delay?: number;
  loading?: boolean;
  retry?: boolean;
  size?: 'default' | 'large' | 'small';
  timeout?: number;
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { delay = 100, loading = false, retry = true, size = 'small', timeout = 30000 } = options;
  return defineAsyncComponent({
    // errorComponent
    // Defining if component is suspensible. Default: true.
    // suspensible: false,
    delay,
    loader,
    loadingComponent: loading ? <Spin size={size} spinning={true} /> : undefined,
    /**
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError: retry
      ? (error, retry, fail, attempts) => {
          if (/fetch/.test(error.message) && attempts <= 3) {
            // retry on fetch errors, 3 max attempts
            retry();
          } else {
            // Note that retry/fail are like resolve/reject of a promise:
            // one of them must be called for the error handling to continue.
            fail();
          }
        }
      : () => {},
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    // TODO
    timeout,
  });
}
