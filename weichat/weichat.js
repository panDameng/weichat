'use strict'

var Promise = require('bluebird');//引入promise库
var request = Promise.promisify(require('request'));//通过promisify化的request才拥有.then的方法
//查看获取accessToken的文档找到他的请求地址，并将其分解，便于后期维护和使用
var urlPrefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: urlPrefix + 'token?grant_type=client_credential'
}

function Wechat(opts)//创建一个原型函数
{
    var that = this;//this永远指向当前对象的，赋值给that后的这个对象永远指向当前所在的对象
    this.appID = opts.appID;//获取配置微信相关信息
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;//用于获取AccessToken的方法
    this.saveAccessToken = opts.saveAccessToken;//用于保存AccessToken的方法

    this.getAccessToken()//获取AccessToken的方法的具体实现
        .then(function(data){//第一步是将传来的数据进行json的转换
            try{
                data = JSON.parse(data);
            }
            catch(e){
                return that.updateAccessToken();//如果转换出错了说明是AccessToken失效了，调用更新方法
            }
            if(that.isValidAccessToken(data)){//转换成功后进行验证
                Promise.resolve();
            }else{
                return that.updateAccessToken();//验证失败进行更新
            }
        })
        .then(function(data){//转换成json数据成功后，获得data的内部值并保存
            that.access_token = data.access_token;//票据数据
            that.expires_in = data.expires_in;//过期时间
            that.saveAccessToken(data);
        })
}
Wechat.prototype.isValidAccessToken = function(data) {//在原型链上增加验证方法
    // body...
    if(!data || !data.access_token || !data.expires_in){
        return false;
    }
    var access_token = data.access_token;//获取传入的数据
    var expires_in = data.expires_in;
    var now = (new Date().getTime());
    if(now < expires_in){//当前时间是否小于过期时间
        return true;//未过期返回true
    }else{
        return false;
    }
};
Wechat.prototype.updateAccessToken = function(data) {//在原型链上增加验证方法
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;//得到请求的地址
    
    return  new Promise(function(resolve, reject){
        //传递http的get/post请求，默认get
        request({url:url, json:true}).then(function(response){
            var data = response.body;//获取请求携带的数据；
            var now = (new Date().getTime());//获取当前时间
            //过期时间，-20是指要提前20秒刷新防止网络延迟导致的时间不够，*1000,因为单位是ms
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;//将新的过期时间赋值过去

            resolve(data);
        })
    })
    
}

module.exports = Wechat;