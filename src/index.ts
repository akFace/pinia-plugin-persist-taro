import { PiniaPluginContext } from 'pinia'
import Taro from '@tarojs/taro'
console.log('🚀 ~ file: index.ts:3 ~ Taro', Taro)

setTimeout(() => {
  import('@tarojs/taro').then((res) => {
    console.log('🚀 ~ file: index.ts:8 ~ import ~ myTaro', res)
  })
}, 1500)

const isH5 = typeof alert === 'function'

export interface PersistStrategy {
  key?: string
  storage?: Storage
  paths?: string[]
}

export interface PersistOptions {
  enabled: true
  detached?: true
  enforceCustomStorage?: boolean
  H5Storage?: Storage
  strategies?: PersistStrategy[]
}

type Store = PiniaPluginContext['store']
type PartialState = Partial<Store['$state']>

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions
  }
}

const updateStorage = (strategy: PersistStrategy, store: Store, options?: PersistOptions) => {
  const storage = strategy.storage
  const storeKey = strategy.key || store.$id
  // 是否需要执行自定义存储
  const isCustomStorage = isH5 || options?.enforceCustomStorage

  if (strategy.paths) {
    const partialState = strategy.paths.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key]
      return finalObj
    }, {} as PartialState)
    if (isCustomStorage && storage) {
      storage.setItem(storeKey, JSON.stringify(partialState))
    } else {
      Taro.setStorage({ key: storeKey, data: JSON.stringify(partialState) })
    }
  } else if (isCustomStorage && storage) {
    storage.setItem(storeKey, JSON.stringify(store.$state))
  } else {
    Taro.setStorage({ key: storeKey, data: JSON.stringify(store.$state) })
  }
}

export default ({ options, store }: PiniaPluginContext): void => {
  if (options.persist?.enabled) {
    const defaultStrat: PersistStrategy[] = [
      {
        key: store.$id,
        storage: options.persist?.H5Storage || window?.sessionStorage,
      },
    ]

    const strategies = options.persist?.strategies?.length
      ? options.persist?.strategies
      : defaultStrat

    strategies.forEach((strategy) => {
      const storage = strategy.storage || options.persist?.H5Storage || window?.sessionStorage
      const storeKey = strategy.key || store.$id
      let storageResult
      if (isH5 || options.persist?.enforceCustomStorage) {
        storageResult = storage.getItem(storeKey)
      } else {
        storageResult = Taro.getStorageSync(storeKey)
      }

      if (storageResult) {
        store.$patch(JSON.parse(storageResult))
        updateStorage(strategy, store, options.persist)
      }
    })

    store.$subscribe(
      () => {
        strategies.forEach((strategy) => {
          updateStorage(strategy, store, options.persist)
        })
      },
      { detached: options.persist?.detached ? true : false }
    )
  }
}
