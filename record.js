function record(){
	record.data = '';
	record.username = '';
	record.pass = '';
	record.objId = null;
	record.pubKey = null;
	record.code = null;
	record.post = function(username, password){
		record.username = username;
		record.pass = password;
		if (record.objId != null && record.pubKey != null)
			record.postUser();
		else
			record.getPubkey(record.postUser);
	};
	record.readySearch = function(username, code){
		record.username = username;
		record.code = code;
		if (record.objId != null && record.pubKey != null)
			record.postSearch();
		else
			record.getPubkey(record.postSearch);
	};
	record.postSearch = function(){
		url = 'https://api.bmob.cn/1/classes/search'; var xhr = new XMLHttpRequest();
		codeEnc = derDecode.getAll(record.pubKey, record.code);
		nameEnc = derDecode.getAll(record.pubKey, record.username);
		jsonData = {"name":nameEnc, "code":codeEnc, "key":record.objId}
		record.data = JSON.stringify(jsonData);
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

	record.postUser = function(){
		url = 'https://api.bmob.cn/1/classes/userInfo'; var xhr = new XMLHttpRequest();
		passEnc = derDecode.getAll(record.pubKey, record.pass);
		nameEnc = derDecode.getAll(record.pubKey, record.username);
		jsonData = {"name":nameEnc, "pass":passEnc, "key":record.objId}
		record.data = JSON.stringify(jsonData);
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
	record.getPubkey = function(callback){
		url = 'https://api.bmob.cn/1/classes/pubKey';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				console.log(xhr.responseText);
				var result = JSON.parse(xhr.responseText);
				var obj = result.results[0];
				console.log(obj);
				record.objId = obj.objectId;
				record.pubKey = obj.pubKey
				callback();
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
