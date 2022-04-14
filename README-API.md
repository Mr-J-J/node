## 连接到您的 KNX IP 路由器

默认情况下*您只需要指定一个包含处理 KNX 事件的函数的“处理程序”对象*。 所有其他选项都有默认值，可以根据您的需要覆盖。

```js
var connection = new knx.Connection( {
  // KNX路由器或接口的ip地址和端口
  ipAddr: '127.0.0.1', ipPort: 3671, 
  // 如果您需要指定多播接口（例如，如果您有多个）
  interface: 'eth0',
  // 我们想使用的 KNX 物理地址
  physAddr: '15.15.15',
  // 设置打印在控制台上的消息的日志级别。 这可以是“错误”、“警告”、“信息”（默认）、“调试”或“跟踪”。
  loglevel: 'info',
  // 不自动连接，而是使用connection.Connect()建立连接
  manualConnect: true,  
  // 使用多播（路由器）隧道 - 并非所有路由器都支持！ 请参阅 README-resilience.md
  forceTunneling: true,
  // 在每个数据报之间至少等待 10 毫秒
  minimumDelay: 10,
  // 启用此选项以抑制带有传出 L_Data.req 请求的确认标志。 LoxOne 需要这个
  suppress_ack_ldatareq: false,
  // 14/03/2020 在隧道模式下，通过发出新的 emitEvent 来回显发送的消息，因此具有相同组地址的其他对象可以接收发送的消息。 默认为假。
  localEchoInTunneling:false,
  // 在此处定义您的事件处理程序：
  handlers: {
    // 在发送任何东西之前等待连接建立！
    connected: function() {
      console.log('Hurray, I can talk KNX!');
      // 向 DPT1 组地址写入任意布尔请求
      connection.write("1/0/0", 1);
      // 您还可以写入显式数据点类型，例如。 DPT9.001 是温度摄氏度
      connection.write("2/1/0", 22.5, "DPT9.001");
      // 你也可以发出一个 READ 请求并传递一个回调来捕获响应
      connection.read("1/0/1", (src, responsevalue) => { ... });
    },
    // 获得所有 KNX 事件的通知：
    event: function(evt, src, dest, value) { console.log(
        "event: %s, src: %j, dest: %j, value: %j",
        evt, src, dest, value
      );
    },
    // 收到连接错误通知
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});
```

**重要**：connection.write() 将只接受*原始 APDU 有效负载*和 DPT。
这实际上意味着对于 * 读取和写入二进制文件以外的任何内容
switch*（例如，对于调光器控制），您需要声明一个或多个 *datapoints*。

### 根据 DPT 声明数据点

数据点关联*端点*（由组地址标识，例如“1/2/3”）
带有*DPT*（数据点类型），以便*序列化*与 KNX 之间的值
工作正常（例如，温度为 16 位浮点数），并且正在转换值
到 Javascript 对象并返回。

```js
// 声明一个简单的二进制控制数据点
var binary_control = new knx.Datapoint({ga: '1/0/1', dpt: 'DPT1.001'});
// 将其绑定到活动连接
binary_control.bind(connection);
// 将新值写入总线
binary_control.write(true); // or false!
// 发送读取请求，并在响应时触发回调
binary_control.read( function (response) {
    console.log("KNX response: %j", response);
  };
// 或声明一个调光器控制
var dimmer_control = new knx.Datapoint({ga: '1/2/33', dpt: 'DPT3.007'});
// 声明一个二进制 STATUS 数据点，它将自动读取其值
var binary_status = new knx.Datapoint({ga: '1/0/1', dpt: 'DPT1.001', autoread: true});
```

数据点需要绑定到连接。 这可以在他们的
创建，*或*使用他们的`bind()`调用。 重要的是要强调之前
你开始定义数据点（以及我们稍后会看到的设备），你的代码
*需要确保已建立连接*，通常通过在“已连接”处理程序中声明它们：

```js
var connection = knx.Connection({
  handlers: {
    connected: function() {
      console.log('----------');
      console.log('Connected!');
      console.log('----------');
      var dp = new knx.Datapoint({ga: '1/1/1'}, connection);
      // 现在发送几个请求：
      dp.read((src, value) => {
        console.log("**** RESPONSE %j reports current value: %j", src, value);
      });
      dp.write(1);
    }
  }
});
```

### 声明你的设备

您可以定义一个设备（基本上是一组与
物理 KNX 设备，例如。 二进制开关），以便您拥有更高级别的控制：
```js
var light = new knx.Devices.BinarySwitch({ga: '1/1/8', status_ga: '1/1/108'}, connection);
console.log("The current light status is %j", light.status.current_value);
light.control.on('change', function(oldvalue, newvalue) {
  console.log("**** LIGHT control changed from: %j to: %j", oldvalue, newvalue);
});
light.status.on('change', function(oldvalue, newvalue) {
  console.log("**** LIGHT status changed from: %j to: %j", oldvalue, newvalue);
});
light.switchOn(); // or switchOff();
```

这有效地创建了一对通常与二进制文件相关联的数据点
开关，一个用于控制它，另一个用于获取状态反馈（例如，通过
手动操作）

### 写入原始缓冲区

如果您自己对值进行编码，则可以使用 `writeRaw(groupaddress: string, buffer: Buffer, bitlength?: Number, callback?: () => void)` 编写原始缓冲区。

第三个（可选）参数 `bitlength` 对于数据点类型是必需的
其中位长度不等于缓冲区字节长度 * 8。
dpt 1（位长 1）、2（位长 2）和 3（位长 4）就是这种情况。
对于其他 dpts，该参数可以省略。
```js
// 将原始缓冲区写入 dpt 1 的组地址（例如 light on = value true = Buffer<01>），位长为 1
connection.writeRaw('1/0/0', Buffer.from('01', 'hex'), 1)
// 将原始缓冲区写入具有 dpt 9 的组地址（例如温度 18.4 °C = 缓冲区<0730>），无位长
connection.writeRaw('1/0/0', Buffer.from('0730', 'hex'))
```

### 断开连接

为了彻底断开连接，您必须发送 Disconnect-Request 并给 KNX-IP-Stack 足够的时间来接收来自 IP 网关的 Disconnect-Response。 大多数 IP 网关都会有一个超时和干净的陈旧连接，即使您没有完全断开连接，但取决于并行活动连接数的限制，这将限制您重新连接的能力，直到超时过去。

对于 NodeJS 在脚本退出时进行清理，这需要类似 [async-exit-hook](https://www.npmjs.com/package/async-exit-hook):

```js
const exitHook = require('async-exit-hook');

exitHook(cb => {
  console.log('Disconnecting from KNX…');
  connection.Disconnect(() => {
    console.log('Disconnected from KNX');
    cb();
  });
});
```
