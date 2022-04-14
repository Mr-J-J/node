## 数据点类型

|DPT   	  | Description       | Value type  	| Example  	| Notes |
|---	    |---	                  |---	|---	|---	|
|DPT1   	| 1-bit control  	      | Boolean/Numeric	|  true/"true"/1 false/"false"/0 | |
|DPT2   	| 1-bit control w/prio  | Object  	| {priority: 0, data: 1}  	|   |
|DPT3   	| 4-bit dimming/blinds  | Object  	| {decr_incr: 1, data: 0}  	|   data: 3-bit (0..7)|
|DPT4   	| 8-bit character  	|   String	| "a"  	|   1st char must be ASCII	|
|DPT5   	| 8-bit unsigned int  | Numeric | 127  	|  0..255 	|
|DPT6   	| 8-bit signed int  	| Numeric | -12  	|  -128..127 	|
|DPT7   	| 16-bit unsigned int  | Numeric  |   	|  0..65535 	|
|DPT8   	| 16-bit signed integer | Numeric |   	|  -32768..32767 |
|DPT9   	| 16-bit floating point | Numeric |   	|   	|
|DPT10   	| 24-bit time + day of week 	|   Date	|  new Date() |   only the time part is used, see note |
|DPT11   	| 24-bit date 	|   Date	|  new Date() |   only the date part is used, see note |
|DPT12   	| 32-bit unsigned int | Numeric |   	|   	|
|DPT13   	| 32-bit signed int   | Numeric |   	|   	|
|DPT14   	| 32-bit floating point | Numeric |   	|  incomplete: subtypes |
|DPT15   	| 32-bit access control |  |   	|   incomplete|
|DPT16   	| ASCII string 	|  String |   	|   	|
|DPT17   	| Scene number 	|   	|   	|  incomplete|
|DPT18   	| Scene control 	|   	|   	|   incomplete|
|DPT19   	| 8-byte Date and Time 	|  Date | new Date() |   	|
|DPT20-255 | feel free to contribute! 	|   |  |   	|


添加新的 DPT 时，请确保添加相应的单元测试
在 `test/dptlib` 子目录下。 单元测试带有一个小助手
提供样板代码以编组和解组测试用例的库。

以 DPT5 的单元测试为例，它携带单字节有效负载。
它的一些子类型（例如，百分比为 5.001，角度为 5.003）
需要按比例放大或缩小，而其他子类型*绝对不能*按比例缩放：

```js
// 没有子类型的 DPT5：没有缩放
commontest.do('DPT5', [
  { apdu_data: [0x00], jsval: 0},
  { apdu_data: [0x40], jsval: 64},
  { apdu_data: [0x41], jsval: 65},
  { apdu_data: [0x80], jsval: 128},
  { apdu_data: [0xff], jsval: 255}
]);
// 5.001 百分比 (0=0..ff=100%)
commontest.do('DPT5.001', [
  { apdu_data: [0x00], jsval: 0 },
  { apdu_data: [0x80], jsval: 50},
  { apdu_data: [0xff], jsval: 100}
]);
// 5.003 角度 (度 0=0, ff=360)
commontest.do('DPT5.003', [
  { apdu_data:  [0x00], jsval: 0 },
  { apdu_data:  [0x80], jsval: 181 },
  { apdu_data:  [0xff], jsval: 360 }
]);
```

## 日期和时间 DPT（DPT10、DPT11）
请记住，sJavacript 和 KNX 的时间和日期的基本类型非常不同。

- DPT10 是时间 (hh:mm:ss) 加上“星期几”。 这个概念在 JS 中不可用，因此您将获取/设置常规的 *Date* Js 对象，但 *请记住*您需要_忽略_日期、月份和年份。 转换为“Mon, Jul 1st 12:34:56”的*完全相同的数据报*将在一周后评估为“Mon, Jul 8th 12:34:56”的完全不同的 JS 日期。 被警告！
- DPT11 是日期 (dd/mm/yyyy)：同样适用于 DPT11，您需要*忽略时间部分*。