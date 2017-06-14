'use strict'
var path = require('path');
var wechat = require('./weichat/g.js');//引入创建的中间件
var util = require('./libs/util.js');//引入工具js文件
var wechat_file = path.join(__dirname, './config/wechat.txt');//本当前目录的文本文件，用于存储每时每刻的access_token的数据值


var config = {//存测试号相关配置信息
    weichat:{//要严格保密
        appID:'wx7e4a4e60162094cf',
        appSecret:'ddd490501c1c256ddb862914c64619ef',
        token:'weichat_learn',
        getAccessToken: function(){
        	return util.readFileAsync(wechat_file);
        },
        saveAccessToken:function(data){
        	data = JSON.stringify(data);//将JSON数据转换为字符串
        	return util.writeFileAsync(wechat_file, data);
        }
    }
}
module.exports = config;
