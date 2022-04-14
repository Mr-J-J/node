## Node.JS 的 KNXnet/IP

**新：** [加入 Gitter.im 聊天室！](https://gitter.im/knx-js/Lobby)

一个功能齐全的 [KNXnet/IP 协议栈](https://www.knx.org/en-us/knx/technology/developing/devices/ip-devices/index.php) 纯 Javascript，能够进行多播通话 （路由）和单播（隧道）。 将 KNX 添加到您的 Node.JS 应用程序现在终于轻而易举了。

* 宽 DPT（数据点类型）支持（支持 DPT1 - DPT20）
* 可扩展设备支持（二元灯、调光器……）
* 您不需要安装一个专门的 eibd 守护程序及其神秘的依赖项，最重要的是，
* 如果你有一个 IP 路由器和一个支持 IP 多播的网络，你可以在几秒钟内开始与 KNX 对话！
＃＃ 安装

确保您的机器有 Node.JS（4.x 或更高版本）并执行以下操作：

`npm install knx`

＃＃ 用法

最后，这是一个**可靠的** KNX 连接，无需任何配置即可轻松工作。 要获得基本的 KNX 监视器，您只需要在 Node 中运行它：

```js
var knx = require('knx');
var connection = knx.Connection({
 handlers: {
  connected: function() {
    console.log('Connected!');
  },
  event: function (evt, src, dest, value) {
  console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
    new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    evt, src, dest, value);
  }
 }
});
```

啊，KNX电报，真高兴：

```
> 2016-09-24 05:34:07 **** KNX 事件：“GroupValue_Write”，src：“1.1.100”，dest：“5/0/8”，值：1
2016-09-24 05:34:09 **** KNX 事件：“GroupValue_Write”，src：“1.1.100”，dest：“5/1/15”，值：0
2016-09-24 05:34:09 **** KNX 事件：“GroupValue_Write”，src：“1.1.100”，dest：“5/0/8”，值：0
2016-09-24 05:34:17 **** KNX 事件：“GroupValue_Write”，src：“1.1.100”，dest：“5/1/15”，值：0
2016-09-24 05:34:17 **** KNX 事件：“GroupValue_Write”，src：“1.1.100”，dest：“5/0/8”，值：1
```

## 开发文档

- [Basic API usage](../master/README-API.md)
- [List of supported datapoints](../master/README-datapoints.md)
- [List of supported events](../master/README-events.md)
- [eibd/knxd compatibility](../master/README-knxd.md)
- [On resilience](../master/README-resilience.md)
