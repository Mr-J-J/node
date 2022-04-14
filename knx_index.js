var knx = require('knx');
const exitHook = require('async-exit-hook');

let KNX_IP = "192.168.1.151";
knxConnection = new knx.Connection({
    ipAddr: KNX_IP,
    ipPort: 3671,
    loglevel: 'info',
    handlers: {
        connected: function () {
            console.log("connected");
            knxConnection.read('0/0/6', function (response, value) {
                var binary_control = new knx.Datapoint({
                    ga: '0/0/5',
                    dpt: 'DPT1.001'
                });
                binary_control.bind(knxConnection);
                binary_control.write(true);//开
                setTimeout(() => {
                    binary_control.write(false);//关
                    
                }, 5000);
                
            });
            exitHook(cb => {
                console.log('Disconnecting from KNX…');
                knxConnection.Disconnect(() => {
                  console.log('Disconnected from KNX');
                  cb();
                });
            });
        },
        
        // 所有事件通知
        event: function(evt, src, dest, value) { console.log(
            "event: %s, src: %j, dest: %j, value: %j",
            evt, src, dest, value
          );
        },
        // 收到连接错误通知
        error: function(connstatus) {
          console.log("**** ERROR: %j", connstatus);
        }
        
    },
    
});

