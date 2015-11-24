function record(){
	record.postUser = function(){
		url = 'https://api.bmob.cn/1/classes/userInfo';
		data = '{"name":"dashuitong","passwd":"889914","time":"2015.01.05"}';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				console.log(xhr.responseText);
			
			}
			else
			{
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.setRequestHeader("X-Bmob-Application-Id","f959535a39bb9dec9ac4dab32e5961c5");
		xhr.setRequestHeader("X-Bmob-REST-API-Key","17342bb32e2df845778bb70391b1c4a6");
		xhr.send(data);
		console.log("post");

	};
	var pubKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChKUoDzmcdMaqHy/gysILD7Qu2\n54wYvn6EuCZcEhONESSphpz7gJ37u/dWBpwkTgxX5HLbFSNSbJyqX2aCQQqUuPdd\nm+9pOTzL9LkXwOG34FrhXXC0FmOaRn/Yx/vPUL+HIM7yOyqqnEzw16yAtjNwq0Ev\n+jUvGrcm+TI7hMWolQIDAQAB\n-----END PUBLIC KEY-----'
	var enc = derDecode.getAll(pubKey, 'password');
	console.log(enc);
};
record();
