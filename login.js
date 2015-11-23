var PASSPORT_BASE = 'https://passport.baidu.com/';
var PASSPORT_LOGIN = PASSPORT_BASE + 'v2/api/?login';
var PASSPORT_URL = PASSPORT_BASE + 'v2/api/';
function login() {
	login.token = '';
	login.codeString = '';
	login.eEdit = document.getElementById('eLoginEdit');
	login.eCode = document.getElementById('eLoginCode');
	login.vCode = document.getElementById('vCode');
	login.state = document.getElementById('state');
	login.encryptPwd = '';
	login.rsaKey = '';
	login.userName = '';
	login.password = '';
	login.show = function(obj){
		obj.className='';
		return this;
	};
	login.hide = function(obj){
		obj.className='hide';
		return this;
	};
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
						login.token = tmp;
						login.getUBI();
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
	this.getBaiduID = function(userName, password){
		login.userName = userName;
		login.password = password;
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
	login.getUBI = function(){
		var url = PASSPORT_URL
			+ '?loginhistory'
			+ '&token='
			+ login.token
			+ '&tpl=pp&apiver=v3'
			+ '&tt='
			+ Date.parse(new Date());
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					console.log(xhr.responseText);
					login.checkLogin();
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
			+ login.token
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
					var obj = JSON.parse(xhr.responseText);
					login.codeString = obj.data.codeString;
					console.log(login.codeString);
					login.getPub();
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
			+ login.token
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

					var dec = new derDecode();
					var enc = derDecode.getAll(obj.pubkey, login.password);
					login.encryptPwd = enc;
					login.rsaKey = obj.key;

					login.postLogin(login.codeString, login.userName, enc, obj.key, '');
				}
				else
				{
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);

	};
	
	login.getSignVcode = function(){
		var url = PASSPORT_BASE
			+ 'cgi-bin/genimage?'
			+ login.codeString;
		var i = 0;
		for(i = 0; i < login.vCode.childNodes.length; i++){
			login.vCode.removeChild(login.vCode.childNodes[i]);
		}
		var img = document.createElement('img');
		img.setAttribute('src', url);
		img.setAttribute('id', 'codeImg');
		login.vCode.appendChild(img);
		login.show(login.eCode);
		login.eEdit.focus();
	};
	login.postLogin = function(codeString, username, password, rsaKey, vcode){
		var url = PASSPORT_LOGIN;
		var data = 'staticpage=https%3A%2F%2Fpassport.baidu.com%2Fstatic%2Fpasspc-account%2Fhtml%2Fv3Jump.html'
			+ '&charset=UTF-8'
			+ '&token='
			+ login.token
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
					var re = new RegExp('err_no=[^&]+', 'g');
					var reCode = new RegExp('codeString=[^&]+', 'g');
					var result = re.exec(xhr.responseText);
					var loginCode = '';

					if (result != null){
						loginCode = result.toString().substring(7)
						console.log(loginCode);
					}
					if (loginCode == '257'){
						login.state.innerHTML='请输入验证码';
					}else if(loginCode == '4'){
						login.state.innerHTML='密码错误';
						return;
					}else{
						login.state.innerHTML='登陆可能成功:' + loginCode;
						login.isLogin();
						return;
					}
					console.log('get code');


					result = reCode.exec(xhr.responseText);
					if (result != null){
						console.log(result.toString().substring(11));
						login.codeString = result.toString().substring(11);
						login.getSignVcode();
					}
				}
				else
				{
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(data);

	};
	login.isLogin = function(){
		url = 'https://www.baidu.com'
			var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"a
				if (xhr.status==200)
				{// 200 = "OK"
					var urlRe = new RegExp('user-name>[^<]+');
					var result;
					result = urlRe.exec(xhr.responseText);
					if(result == null)
					{
						login.state.innerHTML = '登录失败';
					}
					else
					{
						var userName = result.toString().substring(10);
						console.log(userName);
						login.state.innerHTML = '登陆成功:' + userName;
					}
				}
				else
				{
					login.state.innerHTML = '登录失败' + xhr.statusText;
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);
	};


	login.init = function(){
		login.eEdit.addEventListener('keyup', function(ev){
				var ev=ev || window.event;
				if (ev.keyCode == 13){
					var codeImg = document.getElementById('codeImg');
					var value = login.eEdit.value;
					login.postLogin(login.codeString, '分是否收费', login.encryptPwd, login.rsaKey, value);
					login.vCode.removeChild(codeImg);
					login.eEdit.value = '';
					login.hide(login.eCode);
				}
				ev.preventDefault();
			}, true);
	};
	login.init();
}
