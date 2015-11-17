var PASSPORT_BASE = 'https://passport.baidu.com/';
var PASSPORT_LOGIN = PASSPORT_BASE + 'v2/api/?login';
var PASSPORT_URL = PASSPORT_BASE + 'v2/api/';
function login() {
	this.token = ''
	login.getToken = function(){
		console.log('get token');
		url = PASSPORT_URL
			+ '?getapi&tpl=pp&apiver=v3'
			+ '&tt='
			+ Date.parse(new Date())
			+ '&class=login&logintype=basicLogin';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					console.log(xhr.responseText);
					var re = new RegExp('"token" : "[^"]+', 'g');
					var result = re.exec(xhr.responseText);
					if (result != null)
					{
						tmp = result.toString().substring(11);
						console.log(tmp);
						this.token = tmp;
						login.checkLogin();
					}

				}
				else
				{
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);

	};
	this.getBaiduID = function(){
		url = PASSPORT_URL
			+ '?getapi&tpl=mn&apiver=v3'
			+ '&tt=' 
			+ Date.parse(new Date())
			+ '&class=login&logintype=basicLogin';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					console.log(xhr.responseText);
					login.getToken();
				}
				else
				{
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);
	};
	login.checkLogin = function(username){
		url = PASSPORT_URL
			+ '?logincheck'
			+ '&token='
			+ this.token
			+ '&tpl=mm&apiver=v3'
			+ '&tt='
			+ Date.parse(new Date())
			+ '&username='
			+ encodeURIComponent(username)
			+ '&isphone=false';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					console.log(xhr.responseText);
				}
				else
				{
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);

	};
	login.getPub = function(){
		url = PASSPORT_BASE 
			+ 'v2/getpublickey'
			+ '?token='
			+ this.token
			+ '&tpl=pp&apiver=v3&tt='
			+ Date.parse(new Date());
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					console.log(xhr.responseText);
					tmp = xhr.responseText.toString();
					var result = tmp.replace(/'/g, '"');  
					var obj = JSON.parse(result);
					console.log(obj);
					var encryptStr = cryptico.encrypt('410015216', obj.pubkey);
					console.log(encryptStr);
					login.postLogin('', '分是否收费', encryptStr.cipher, obj.key, '');
				}
				else
				{
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);

	};
	login.postLogin = function(codeString, username, password, rsaKey, vcode){
		var url = PASSPORT_LOGIN;
		var data = 'staticpage=https%3A%2F%2Fpassport.baidu.com%2Fstatic%2Fpasspc-account%2Fhtml%2Fv3Jump.html'
			+ '&charset=UTF-8'
			+ '&token='
			+ this.token
			+ '&tpl=pp&subpro=&apiver=v3'
			+ '&tt='
			+ Date.parse(new Date())
			+ '&codestring='
			+ codeString
			+ '&safeflg=0&u=http%3A%2F%2Fpassport.baidu.com%2F'
			+ '&isPhone='
			+ '&quick_user=0&logintype=basicLogin&logLoginType=pc_loginBasic&idc='
			+ '&loginmerge=true'
			+ '&username='
			+ encodeURIComponent(username)
			+ '&password='
			+ encodeURIComponent(password)
			+ '&verifycode='
			+ vcode
			+ '&mem_pass=on'
			+ '&rsakey='
			+ rsaKey
			+ '&crypttype=12'
			+ '&ppui_logintime='
			+ Math.floor(Math.random()*(58535 - 52000 + 1) + 52000)
			+ '&callback=parent.bd__pcbs__28g1kg';
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					console.log(xhr.responseText);
				}
				else
				{
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.send(data);

	};

}
