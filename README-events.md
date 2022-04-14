## 事件

图书馆发布了大量信息，因此您可以全面了解幕后发生的事情。

### 连接事件

```js
// 通用组写入事件：具有 'src' 物理地址的设备写入 'dest' 组地址
connection.on('GroupValue_Write', function (src, dest, value) { ... });
// 通用 groupread 事件：物理地址为 'src' 的设备正在 KNX 上查询
//总线组地址'dest'的当前值
connection.on('GroupValue_Read', function (src, dest) { ... });
// 响应事件：物理地址为 'src' 的设备正在响应
// 读取请求组地址 'dest' 的当前值为 'value'
connection.on('GroupValue_Response', function (src, dest, value) { ... });

// 特定组地址事件：具有 'src' 物理地址的设备
// .. 写入群组地址
connection.on('GroupValue_Write_1/2/3', function (src, value) { ... });
// .. 或响应当前值
connection.on('GroupValue_Response_1/2/3', function (src, value) { ... });

// 还有一个通用的包罗万象的事件，它传递事件类型
// 作为它的第一个参数，以及所有其他信息
connection.on('event', function (evt, src, dest, value) { ... });)
// 通用的 catch-all 事件也可以与组地址一起使用
connection.on('event_1/2/3', function (evt, src, dest, value) { ... });)
```

以下是连接发出的事件的完整列表：
```
["GroupValue_Read", "GroupValue_Response", "GroupValue_Write",
"PhysicalAddress_Write",  "PhysicalAddress_Read", "PhysicalAddress_Response",
"ADC_Read", "ADC_Response", "Memory_Read", "Memory_Response", "Memory_Write",
"UserMemory", "DeviceDescriptor_Read", "DeviceDescriptor_Response",
"Restart", "OTHER"]
```

Other connection events:
```js
// 传出隧道请求没有得到任何确认
connection.on('unacknowledged', function (datagram) { ... });)
```

### Datapoint events

```js
// 数据点的值已更改
datapoint.on('change', function(oldvalue, newvalue){...});
```
