---
title: 拷贝
time: 2021-04-13
author: ru shui
category: 前端基础
tag:
  - frontend
  - copy
visitor: false
article: true
---


## 浅拷贝
```js
function shallowCopy(value) {
  if (!isObject(value)) return value

  var newObj = isArray(value) ? [] : {}

  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      newObj[key] = value[key]
    }
  }
  return newObj
}
```
1. 判断是否为对象
   + false：直接返回原值
   + true：执行下一步
2. 是数组还是对象
   + true：创建一个[]用于接收数组中的元素。
   + false: 创建一个{}用于接收对象中的元素。
3. 遍历对象的key，判断是否为实例属性
   + true：进行浅拷贝
   + false：忽略

## 深拷贝

### 深度优先(DFS)
```js{6,7}
function deepClone(value) {
  if (!isObject(value)) return value
  var newObj = isArray(value) ? [] : {}
  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      var v = value[key]
      newObj[key] = !isObject(v) ? v : deepClone(v)
    }
  }
  return newObj
}
```
深拷贝与浅拷的区别在于对对象内部值的判断，浅拷贝只是简单粗暴地进行复制，而深拷贝需要判断值是否为引用类型，如果是引用类型则进一步复制。

### 广度优先(BFS)
```js
/**
 * copy value for object
 * @param {Object} obj 
 * @param {any} key 
 * @param {Array<[obj: Object, key: string, value: any>} queue 
 */
function copyValue (obj, key, value, queue) {
  if (!isObject(value)) {
    obj[key] = value
  } else {
    queue.push([obj, key, value])
  }
}

/**
 * Deep clone base on BFS
 * @param {any} value The value you want to clone
 * @param {Array<[obj: Object, key: string, value: any>} queue 
 */
function deepClone(value, queue = []) {
  if (!isObject(value)) return value
  var newObj = !isArray(value) ? {} : []

  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      copyValue(newObj, key, value[key], queue)
    }
  }
  while (queue.length > 0) {
    var item = queue.shift()
    var obj = item[0]
    var key = item[1]
    var value = item[2]
    obj[key] = deepClone(value, queue)
  }
  return newObj
}
```
核心代码为`deepClone`。基于广度优先的拷贝方法要稍微复杂一点，需要使用到一个队列进行辅助。与基于DFS的拷贝类似，在复制对象内部值的时候需要判断是否为引用类型，这里将其抽离到`copyValue`的函数中。
对于`copyValue`，判断值是否为引用类型：
+ true：将其推入队列中，等待复制。
+ false：直接进行拷贝。
  
最后，我们需要清空队列中的引用值，这里需要用到`while (queue.length < 0)`，而不能先将`length`进行缓存，这是因为我们的队列每时每刻都在发生改变。