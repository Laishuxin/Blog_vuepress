# vite + vue + ts 环境配置

## 初始化

使用 vite 官方定制的模板进行初始化

```bash
yarn create @vitejs/app vite-vue-config --template vue-ts	# 这里使用vue-ts

 cd vite-vue-config
 yarn
 yarn dev
```

## 集成单元测试

1. 在项目的根目录下创建`./test/unit`用于存放单元测试文件
2. 安装 jest 依赖：`yarn add jest @types/jest --dev`

### 第一个测试文件

在`./test/unit/`下创建一个`index.spec.js`用于编写第一个测试文件。

```js
// ./tests/unit/index.spec.js
describe('first test', () => {
  test('1 + 1 = 2', () => {
    expect(1 + 1).toBe(2)
  })
})
```

完成之后，在`./package.json`中添加脚本：`"test:unit": jest`

然后在终端执行`yarn test:unit`就可以执行对应的单元测试。

### es6 语法支持

由于`jest`是基于 node 环境下的，所以需要用`babel`进行转义。

我们先在`./tests/unit/`下创建一个`add.js`文件，采用`es6`导出一个`add`方法。

```js
// ./tests/unit/add.js
export default function add(a, b) {
  return a + b
}
```

然后在`./test/unit/index.spec.js`中进行导入，

```js
// ./test/unit/index.spec.js
import add from './add'

// ...

describe('second test', () => {
  test('es6+?', () => {
    expect(add(1, 2)).toBe(3)
    console.log('success')
  })
})
```

运行`yarn test:unit`会报错，所以我们需要为使用`babel`进行转义

### [babel 转义](https://jestjs.io/docs/getting-started)

为`jest`配置`babel`转义，从而支持 es6 语法。

在项目的根目录下创建`./jest.config.js`，并添加转义规则

```js
module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
}
```

这里需要用到`babel-jest`，所以需要将其引入：`yarn add --dev babel-jest @babel/core @babel/preset-env`

由于使用到`babel`，我们还需要配置 babel，在项目的根目录下创建`./babel.config.js`

```js
// ./babel.config.js
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
}
```

完成之后，再次运行`yarn test:unit`可以发现单元测试已经可以正常运行了。

### vue 组件支持

我们尝试加入 vue 组件测试

```js
// ./tests/index.spec.js
import HelloWorld from '../../src/components/HelloWorld.vue'

describe('test components', () => {
  test('hello world', () => {
    console.log(HelloWorld)
  })
})
```

结果是解析错误，因为`jest`并不能正确识别`.vue`文件，需要使用`babel`进行转义

1. 为 jest 添加解析规则

   ```js
   // ./jest.config.js
   module.exports = {
     transform: {
       '^.+\\.jsx?$': 'babel-jest',
       '^.+\\.vue$': 'vue-jest',
     },
   }
   ```

2. 安装插件：`yarn add --dev vue-jest@next @vue/test-utils@next`

   注意：这里需要下载@next 版本才能支持 vue3

## ts 支持

1. 为`jest`添加转换规则

   ```js
   // ./jest.config.js
   module.exports = {
     transform: {
       '^.+\\.jsx?$': 'babel-jest',
       '^.+\\.vue$': 'vue-jest',
   +    '^.+\\.tsx?$': 'ts-jest',
     },
   }
   ```

2. 安装插件：`yarn add --dev ts-jest @babel/preset-typescript`

3. 配置`ts`中，`types`和`include`字段

   ```json
   // ./tsconfig.json
   {
     "compilerOptions": {
       "target": "esnext",
       "module": "esnext",
       "moduleResolution": "node",
       "strict": true,
       "jsx": "preserve",
       "sourceMap": true,
       "resolveJsonModule": true,
       "esModuleInterop": true,
       "lib": ["esnext", "dom"],
       "types": ["vite/client", "jest"]
     },
     "include": [
       "src/**/*.ts",
       "src/**/*.d.ts",
       "src/**/*.tsx",
       "src/**/*.vue",
       "tests"
     ]
   }
   ```

## eslint 支持

1. 插件安装

   `yarn add -D eslint eslint-plugin-vue @vue/eslint-config-typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin typescriptyarn prettier eslint-plugin-prettier @vue/eslint-config-prettier`

2. 配置`eslint`。在根目录下创建一个`.eslintrc`文件，用于配置`eslint`

   ```json
   // ./.eslintrc
   {
     "root": true,
     "env": {
       "browser": true,
       "node": true,
       "es6": true
     },
     "extends": [
       "plugin:vue/vue3-recommended",
       "eslint:recommended",
       "@vue/typescript/recommended",
       // "@vue/prettier",
       // "@vue/prettier/@typescript-eslint"
     ],
     "parserOptions": {
       "ecmaVersion":2020
     },
     "rules": {
       "semi": ["warn", "never"],
       "space-before-function-paren": ["warn", "always"],
       "quotes": ["warn", "single"],
       "comma-dangle": ["warn", "never"]
     }
   }


   // ./.eslintignore
   node_modules/*
   dist/*
   src/assets/*
   .vscode/*

   // ./.prettierrc
   {
     "singleQuote": true,
     "endOfLine": "lf",
     "bracketSpacing": true,
     "semi": false
   }
   ```

3. 配置脚本：在`packagae.json`添加规则

   `"lint": "eslint --ext ts,vue src/** --no-error-on-unmatched-pattern"`

4. 使用 eslint

   `yarn lint` or `yarn lint --fix`

## 配置 alias

1. 配置 vite

   ```ts
   // ./vite.config.ts
   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [vue()],
     resolve: {
       alias: [
         {
           find: '@',
           replacement: path.resolve(__dirname, '/src'),
         },
       ],
     },
   })
   ```

2. 配置`tsconfig`

   ```json
   // ./tsconfig.json
   "baseUrl": ".",
   "paths": {
       "@/*": ["src/*"]
   }
   ```

3. 配置`jest`

   ```js
   // ./jest.config.js
   module.exports = {
     transform: {
       '^.+\\.jsx?$': 'babel-jest',
       '^.+\\.vue$': 'vue-jest',
       '^.+\\.tsx?$': 'ts-jest',
     },
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/src/$1',
     },
   }
   ```

## scss 支持

1. 安装`scss`插件：`yarn add -D sass`

   由于`vite`在设计的时候就考虑到 css 预处理器的问题，所以这里不再不需要安装各种`loader`

2. 配置 vite。在`vite.config.ts`中，添加`css`字段

   ```ts
   // ./vite.config.ts
   css: {
     preprocessorOptions: {
       scss: {
         //additionalData: `@import "./src/assets/scss/global.scss";`
       }
     }
   }
   ```

这里，我们可以定义全局的`scss`文件，然后通过`additionalData`将其导入。

## postcss 支持

由于`vite`内置已经集成了`postcss`，所以我们只需要对`postcss`进行配置即可。

在根目录下创建一个`.postcss.config.js`文件进行配置。

1. 为`postcss`安装插件：`yarn add -D autoprefixer postcss-px-to-viewport`

   其中，`autoprefixer`是自动为`css`添加浏览器前缀。`postcss-px-to-viewport`是将`px`自动转换成`vw/vh`从而实现不同设备的适配。

2. 配置`.postcss.config.js`文件。在根目录下创建`postcss.config.js`文件：

   ```js
   module.exports = {
     plugins: [
       require('autoprefixer')({
         // overrideBrowserslist: ['last 2 versions'],
       }),
       require('postcss-px-to-viewport')({
         unitToConvert: 'px', // 要转化的单位
         viewportWidth: 750, // UI设计稿的宽度
         unitPrecision: 6, // 转换后的精度，即小数点位数
         propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
         viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
         fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
         selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
         minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
         mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
         replace: true, // 是否转换后直接更换属性值
         exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
         landscape: false, // 是否处理横屏情况
       }),
     ],
   }
   ```

## vue-router && vuex

1. 插件安装`yarn add vue-router@next vuex@next --save`

2. 导入`vue-router/vuex`

### vue-router

与`vue-cli`类似，我们创建`./src/router/index.ts`来存放`router`。

```ts
// ./src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HelloWorld,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

在`main.ts`中使用导出的`router`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index' // <====
import '@/assets/scss/main.scss'

createApp(App).use(router).mount('#app') // <====
```

## vuex

在`./src`创建一个`store`目录，用于存放`vuex`

```ts
// ./src/store/vuex/index.ts
import { createStore } from 'vuex'

const store = createStore({})
export default store
```

在`main.ts`中使用导出的`store`

## reference

[老司机带你一起做基于 vue3+vite+ts 的项目环境搭建](https://www.bilibili.com/video/BV1xr4y1A7H9?p=3&spm_id_from=pageDriver)

[jest-using babel](https://jestjs.io/docs/getting-started)

[移动端布局之 postcss-px-to-viewport（兼容 vant）](https://www.cnblogs.com/zhangnan35/p/12682925.html)

[Vue Router: A Tutorial for Vue 3](https://www.vuemastery.com/blog/vue-router-a-tutorial-for-vue-3/)
