var path = require("path");
const log4js = require('log4js');
log4js.configure({
  appenders: {
   cheese: {
    type: 'console',
    //  filename: 'log/cheese.log',
    //  maxLogSize:10000,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
	} 
},
  categories: { default: { appenders: ['cheese'], level: 'trace' } }
});

const logger = log4js.getLogger('cheese');

module.exports=logger

logger.trace('this is trace');
logger.debug('this is debug');
logger.info('this is info');
logger.warn('this is warn');
logger.error('this is error');
logger.fatal('this is fatal');