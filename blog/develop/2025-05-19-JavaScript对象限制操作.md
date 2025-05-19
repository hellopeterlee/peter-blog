---
slug: javascript-object-limit-operation
title: JavaScript对象限制操作：冻结、密封与不可扩展
date: 2025-05-19
authors: peterlee
tags: [js, develop]
keywords: [js, develop]
image: https://media.istockphoto.com/id/1323369382/photo/collection-of-colorful-summer-frozen-desserts-bottom-border-on-a-pink-background.jpg?s=2048x2048&w=is&k=20&c=NlamEsgAEZXJ3vTKLCoHlaNWWqpjX4JmYs3bu4knULQ=
---
JavaScript对象限制操作：冻结(Object.freeze)、密封(Object.freeze)与不可扩展(Object.preventExtensions)
<!-- truncate -->

![](https://media.istockphoto.com/id/1323369382/photo/collection-of-colorful-summer-frozen-desserts-bottom-border-on-a-pink-background.jpg?s=2048x2048&w=is&k=20&c=NlamEsgAEZXJ3vTKLCoHlaNWWqpjX4JmYs3bu4knULQ=)

# JavaScript对象限制操作：冻结、密封与不可扩展

在JavaScript中，我们可以通过三种方法限制对象的修改行为，分别是`Object.freeze()`、`Object.seal()`和`Object.preventExtensions()`。这些方法在不同程度上限制了对象的可变性，对于创建不可变数据或保护对象结构非常有用。

## 1. 不可扩展对象 (Object.preventExtensions)

禁止对象添加新属性，但允许修改和删除现有属性。

```javascript
const obj = { name: "John" };
Object.preventExtensions(obj);

obj.age = 30;  // 静默失败或TypeError(严格模式)
obj.name = "Mike";  // 允许修改
delete obj.name;    // 允许删除
```

检查是否可扩展：
```javascript
Object.isExtensible(obj); // false
```

## 2. 密封对象 (Object.seal)
禁止添加/删除属性，但允许修改现有属性的值。

```javascript
const sealedObj = { role: "admin" };
Object.seal(sealedObj);

sealedObj.role = "user";  // 允许修改
sealedObj.age = 25;       // 失败
delete sealedObj.role;    // 失败
检查是否被密封：

javascript
Object.isSealed(sealedObj); // true
```

## 3. 冻结对象 (Object.freeze)
最高限制级别：

禁止添加/删除属性
禁止修改现有属性值
禁止修改属性描述符
```javascript
const frozenObj = { id: 123 };
Object.freeze(frozenObj);

frozenObj.id = 456;  // 静默失败
frozenObj.name = "test"; // 失败
delete frozenObj.id; // 失败
```

检查是否被冻结：

```javascript
Object.isFrozen(frozenObj); // true
```

## 对比总结
| 限制方法                  | 添加属性 | 删除属性 | 修改值 | 修改属性描述符 | 检查方法               |
|--------------------------|----------|----------|--------|----------------|------------------------|
| `Object.preventExtensions` | ❌       | ✅       | ✅     | ✅             | `Object.isExtensible()` |
| `Object.seal`             | ❌       | ❌       | ✅     | ❌             | `Object.isSealed()`     |
| `Object.freeze`           | ❌       | ❌       | ❌     | ❌             | `Object.isFrozen()`     |



## 注意事项
浅冻结：这些操作都是浅层的，嵌套对象不受影响
严格模式：在严格模式下违规操作会抛出TypeError
不可逆：一旦应用这些限制，无法撤销


## 实际应用场景
配置对象保护
防止意外修改核心数据
提高性能（V8引擎会优化冻结对象）
作为不可变数据的简单实现