/**
 * 全局复用的变量、组件、配置，各个模块之间共享
 * 通过单例模式实现,单例必须注意不受请求影响，例如用户信息这些需要根据请求获取的。后续如果有ssr需求，也不会影响
 */

interface ComponentsState {
  [key: string]: any;
}
interface commonState {
  [key: string]: any;
}
interface MessageState {
  copyPreferencesSuccess?: (title: string, content?: string) => void;
  createMessage?: any;
}

export interface IGlobalSharedState {
  api: commonState;
  components: ComponentsState;
  message: MessageState;
  stores: commonState;
}

class GlobalShareState {
  #api: commonState = {};
  #components: ComponentsState = {};
  #message: MessageState = {};
  #stores: commonState = {};

  /**
   * 定义框架内部各个场景的消息提示
   */
  public defineMessage({ copyPreferencesSuccess, createMessage }: MessageState) {
    this.#message = {
      copyPreferencesSuccess,
      createMessage,
    };
  }

  public getApi(): commonState {
    return this.#api;
  }
  public getComponents(): ComponentsState {
    return this.#components;
  }
  public getMessage(): MessageState {
    return this.#message;
  }
  public getStores(): commonState {
    return this.#stores;
  }

  public setApi(value: commonState) {
    this.#api = value;
  }
  public setComponents(value: ComponentsState) {
    this.#components = value;
  }
  public setStores(value: commonState) {
    this.#stores = value;
  }
}

export const globalShareState = new GlobalShareState();
