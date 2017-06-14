'use strict'

exports.reply = function* (next){
	var message = this.weixin;
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){//关注事件
			if(message.EventKey) {
				console.log('扫二维码进来：' + message.EventKey + '  '+ message.ticket);
			}
			console.log('扫二维码进来：2222' + message.EventKey + '  '+ message.ticket);
			this.body = '订阅成功';
		}
		else if(message.Event === 'unsubscribe') {
			console.log('无情取关');
			this.body = '';
		}
		else if(message.Event === 'LOCATION') {//上报地理位置
			//纬度 经度 准确度
			this.body = '您上报的位置是：' + message.Latitude + ' ' + message.Longitude + ' ' + message.Precision;
		}
		else if(message.Event === 'CLICK') {//点击了自定义菜单
			this.body = '您点击了自定义菜单：' + message.EventKey;
		}
		else if(message.Event === 'SCAN') {//已关注的用户进行二维码扫描事件
			console.log('关注后扫描二维码' + message.EventKey + ' ' +message.Ticket);//ticket，可用来换取二维码图片
			this.body = '已扫描了二维码信息';
		}
		else if(message.Event === 'VIEW') {//点击了自定义菜单
			this.body = '您点击了菜单中的链接' + message.EventKey;//此处EventKey就是url地址
		}
	}
	else if(message.MsgType === 'text'){
		var content = message.Content;
		var reply = '额。。。您说的' +  message.Content + '太复杂了';
		if(content === '1') {
			reply = '一心一意';
		}
		else if(content === '2'){
			reply = '两全其美';
		}
		else if(content === '3'){
			reply = '三生有幸';
		}
		else if(content === '4'){//回复图文消息，可以多条，所以为数组形式
			reply = [{
				title:'四海升平',
				description:'biubiubiu~~~描述',
				picUrl:'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1566782451,1486372524&fm=58',
				url:'https://github.com'
			},{
				title:'四通八达',
				description:'Duang滴Duang~~~描述',
				picUrl:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3999075674,3445011773&fm=58',
				url:'https://nodejs.org'
			}]
		}
		this.body = reply;
	}
	yield next;
}