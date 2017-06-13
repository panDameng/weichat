'use strict'

var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./util.js');

exports.parseXMLAsync = function(xml){//异步解析xml
	return new Promise(function(resolve, reject){
		xml2js.parseString(xml, {trim:true}, function(err, content){
			if(err) reject(err);
			else resolve(content);
		})
	})
}

function formatMessage(result){
	var message = {};
	if (typeof result === 'object'){
		var keys = Object.keys(result);//返回一个数组，其中包含对象的可枚举属性和方法的名称。
		for(var i = 0; i < keys.length; i++){
			var item = result[keys[i]];//键值对，值的1,2,3..
			var key = keys[i];//键值对，
			if (!(item instanceof Array) || item.length === 0){//如果不是数组或者数组为空
				continue;
			}
			if(item.length === 1){//数组内无嵌套时
				var val = item[0];
				if(typeof val === 'object'){//如果val是对象
					message[key] = formatMessage(val);
				}
				else{
					message[key] = (val || '').trim(); //.trim去掉字符串两端空格	
				}
			}
			else {//如果数组嵌套，重新遍历并调用
				message[key] = [];
				for(var j = 0, k = item.length; j = k; j++){
					message[key].push(formatMessage(item[j]));
				}
			}
		}
	}
	return message;
}

exports.formatMessage = formatMessage;

exports.tpl = function(content, message){
	var info = {};
	var type = 'text';
	var fromUserName = message.fromUserName;
	var toUserName = message.toUserName;
	if(Array.isArray(content)){//是数组说明是图文消息
		type = 'news';
	}
	type = content.type || type;
	info.content = content;
	info.createTime = new Date().getTime;
	info.msgType = type;
	info.toUserName = fromUserName;
	info.fromUserName = toUserName;
	return tpl.compiled(info)
}