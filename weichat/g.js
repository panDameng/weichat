'use strict'
//Koa框架的generator生成器函数
var sha1 = require('sha1');//引入加密模块
var getRawBody = require('raw-body');//获取http模块中request对象，并拼接他的数据最终可得到一个xml数据
var util = require('./util.js');//工具包，
var Wechat = require('./weichat.js');

module.exports = function(opts){
    //var wechat = new Wechat(opts);//调用实例函数

    return function * (next){//使用generator生成器传入
        console.log(this.query);//打印出url地址中携带的参数。
        var that = this;//this永远指向当前对象的，赋值给that后的这个对象永远指向当前所在的对象
        var token = opts.token;//获取自填写的token值
        var signature = this.query.signature;//访问微信时url所带具体参数
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        //将三个参数进行字典排序，而signature是微信中对这几个参数字典排序并sha1加密的值
        var str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);

        if(this.method === 'GET'){//koa框架特有判断请求的类型.get是请求微信服务器,比如获取appsecret，
             if(sha === signature){//按照signature的生成方式生成sha，进行匹配。无实际意义但便于理解
                this.body = echostr + '';
            }
            else{
                this.body = 'wrong';
            }
        }
        else if(this.method === 'POST'){//post可以接收用户发过来的信息(消息),需要进行xml的解析和封装
            if(sha !== signature){//按照signature的生成方式生成sha，进行匹配。无实际意义但便于理解
                this.body = 'wrong';
                return false;
            }
            var data = yield getRawBody(this.req, {//接收xml形式的data数据
                length:this.length,
                limit:'1mb',
                encoding:this.charset
            })
            console.log(data.toString());
            var content = yield util.parseXMLAsync(data);//异步解析xml
            console.log(content);//可以查看输出得到数据是键值对，其value为数组，须在进一步解析
            var message = util.formatMessage(content.xml);//解析数组
            console.log(message);
            this.weixin = message;
            yield handler.call(this, next);//切换执行上下文，在新函数里的this实际上是指当前函数
            wechat.reply.call(this);//调用方法并修改执行上下文
            // if(message.MsgType ===  'event'){//判断当前是否为事件
            //     if(message.Event === 'subscribe'){//判断当前是否为订阅事件
            //         var now = new Date().getTime();
            //         that.status = 200;
            //         that.type = 'application/xml';
            //         that.body = msgxml;
            //         return 
            //     }
            // }
        }
       
    }
}
