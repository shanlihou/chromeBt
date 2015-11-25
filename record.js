function record(){
	record.data = '';
	record.username = '';
	record.pass = '';
	record.objId = '';
	record.post = function(username, password){
		record.username = username;
		record.pass = password;
		record.getPubkey();
	};
	record.postUser = function(){
		url = 'https://api.bmob.cn/1/classes/userInfo'; var xhr = new XMLHttpRequest();
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
		xhr.send(record.data);
		console.log("post");

	};
	record.getPubkey = function(){
		url = 'https://api.bmob.cn/1/classes/pubKey';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				console.log(xhr.responseText);
				var result = JSON.parse(xhr.responseText);
				var obj = result.results[0];
				console.log(obj);
				var pubKey = obj.pubKey;
				console.log(pubKey);
				console.log(record.username)
				console.log(record.pass)
				passEnc = derDecode.getAll(pubKey, record.pass);
				nameEnc = derDecode.getAll(pubKey, record.username);
				jsonData = {"name":nameEnc, "pass":passEnc, "key":obj.objectId}
				record.data = JSON.stringify(jsonData);
				record.postUser();
			}
			else
			{
			}
		};
		xhr.open("GET", url, true);
		xhr.setRequestHeader("X-Bmob-Application-Id","f959535a39bb9dec9ac4dab32e5961c5");
		xhr.setRequestHeader("X-Bmob-REST-API-Key","17342bb32e2df845778bb70391b1c4a6");
		xhr.send(null);
	};
};
record();
