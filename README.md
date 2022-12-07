# pinia-plugin-persist-taro

[![NPM version](https://img.shields.io/npm/v/pinia-plugin-persist-taro?color=a1b858&label=)](https://www.npmjs.com/package/pinia-plugin-persist-taro)
[![NPM downloads](https://img.shields.io/npm/dm/pinia-plugin-persist-taro.svg?style=flat)](https://npmjs.com/package/pinia-plugin-persist-taro)

# 前言

> 基于京东小程序框架 Taro 的 pinia 的持久化插件，此插件适配了 Taro 框架，基于
> [pinia-plugin-persist-uni](https://github.com/Allen-1998/pinia-plugin-persist-uni)做了简单修改

# 使用说明

## 安装

`npm i pinia-plugin-persist-taro`

## 配置

### Vue2

```typescript
import Vue from 'vue'
import vueCompositionApi from '@vue/composition-api'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist-taro'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPersist)

Vue.use(vueCompositionApi)
Vue.use(pinia)

new Vue({
  pinia,
  render: (h) => h(App),
}).$mount('#app')
```

### Vue3

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist-taro'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp({}).use(pinia).mount('#app')
```

### Typescript

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["pinia-plugin-persist-taro"]
  }
}
```

## 基本用法

通过在你的 stroe 中配置 persist, 将会通过 TaroStorage 来持久化存储你的数据.

请配置 id，用于持久化存储时的 key。

```typescript
// store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('storeUser', {
  state: () => {
    id: 'user',
    return {
      firstName: 'allen',
      lastName: 'ttk',
      accessToken: 'xxxxxxxxxxxxx',
    }
  },
  actions: {
    setToken(value: string) {
      this.accessToken = value
    },
  },
  persist: {
    enabled: true,
  },
})
```

## 总结

新技术会带给我们更良好的开发体验，但是我们同样应该关注其社区环境，并力所能及的贡献出自己的一份力量。本插件开发的新路历程也是基于目前`pinia`的生态环境中没有专门服务于`Taro`的`数据持久化`插件。

该项目也是参考了`vuex-persistedstate`和`pinia-plugin-persist`,保持了使用习惯的同时又简化了使用配置。同时在搭建项目的过程中也接触到了`github-pages`以及`github actions`的配置使用，实现了说明文档自动部署和 npm 自动发包，可谓是收获满满。

对你有帮助或者喜欢的话请点个 Star。

## 参考

- [pinia-plugin-persist-uni](https://github.com/Allen-1998/pinia-plugin-persist-uni)
- [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)
- [pinia-plugin-persist](https://github.com/Seb-L/pinia-plugin-persist)
