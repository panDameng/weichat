'use strict'
//启动该程序时，必须将对应接口暴露到外网中，或者托管到服务器上
var Koa = require('koa');//引入koa框架
var sha1 = require('sha1');//引入加密模块
var path = require('path');
var wechat = require('./weichat/g.js');//引入创建的中间件
var util = require('./libs/util.js');//引入工具js文件
var config = require('./config.js');
var weixin = require('./weixin');
var wechat_file = path.join(__dirname, './config/wechat.txt');//本当前目录的文本文件，用于存储每时每刻的access_token的数据值

var app = new Koa();

app.use(wechat(config.weichat, weixin.reply));

app.listen(1234);
console.log('Listening: 1234');
