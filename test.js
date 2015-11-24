var urlList = new Array();
var urlIndex = 0;
var PAN_URL = "http://pan.baidu.com/";
var PASSPORT_BASE = "https://passport.baidu.com/";
var PASSPORT_URL = PASSPORT_BASE + "v2/api/";
var ACCEPT_HTML = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
var token = '';
var urlMag = '';
var vcodeGet = '';
var selectIds = '';
var cPrev = {
	disable:true,
	url:''
};
var cNext = {
	disable:true,
	url:''
};
var codeSave = '';
(function(){
	var $=function(id){return document.getElementById(id);}
	var Tasks = {
		show:function(obj){
			obj.className='';
			return this;
		},
		hide:function(obj){
			obj.className='hide';
			return this;
		},
		getMovieCode:function(url){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4)
				{// 4 = "loaded"
					if (xhr.status==200)
					{// 200 = "OK"
						var re = new RegExp("itemreviewed\">[^<]+", "g");
						var result;
						Tasks.$state.innerHTML = 'got movie code';
						while(1){
							result = re.exec(xhr.responseText);
							if (result == null)
							{
								break;
							}
							console.log(result.toString().substring(14));
							Tasks.tagSearch(result.toString().substring(14));
						}
						
					}
					else
					{
						Tasks.$state.innerHTML = xhr.stateText;
					}
				}
			}; // Implemented elsewhere.
			xhr.open("GET", url, true);
			xhr.send(null);
			Tasks.$state.innerHTML = 'get code';


		},
		cancelTask:function(taskId){
			console.log(taskId);
			var timeStamp = new Date().getTime();
			var urlCancel = PAN_URL + 'rest/2.0/services/cloud_dl' + '?bdstoken=' + token + 
				'&task_id=' + taskId + '&method=cancel_task&app_id=250528' +
				'&t=' + timeStamp + '&channel=chunlei&clienttype=0&web=1';
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
			};
			xhr.open("GET", urlCancel, true);
			xhr.send(null);
			Tasks.$state.innerHtml = 'rm task:' + taskId;

		},
		addTask:function(url, fileIds, vcode, vcodeInput){
			var timeStamp = new Date().getTime();
			var urlAdd = PAN_URL + "rest/2.0/services/cloud_dl?channel=chunlei&clienttype=0&web=1" +
			                "&bdstoken=" + token;
			var data = "method=add_task&app_id=250528" + "&file_sha1=" + '' + //file_sha1
				"&save_path=" + encodeURIComponent('/') + "&selected_idx=" + fileIds +
				"&task_from=1" + "&t=" + timeStamp + "&" + "source_url" +
				"=" + encodeURIComponent(url) + "&type=4";
			if (vcode != '')
			{
				data += "&input=" + vcodeInput + "&vcode=" + vcode;
			}
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				var success = -1;
				if (xhr.readyState == 4)
				{
					console.log(xhr.responseText);
					var jsonRe = JSON.parse(xhr.responseText);
					if (jsonRe.error_code)
					{
						Tasks.$state.innerHTML='errMsg is:' + jsonRe.error_msg + ':' + urlIndex;
						if (jsonRe.error_code == -19)
						{
							var img = document.createElement('img');
							success = 2;
							console.log(success);
							console.log(jsonRe.img);
							img.setAttribute('src', jsonRe.img);
							img.setAttribute('id', 'codeImg');
							Tasks.$vCode.appendChild(img);
							Tasks.show(Tasks.$eCode);
							Tasks.$eEdit.focus();
							urlMag = url;
							vcodeGet = jsonRe.vcode;
							selectIds = fileIds;
						}
						else
						{
							success = 0;
						}
					}
					else
					{
						Tasks.$state.innerHTML='retCode is :' + jsonRe.rapid_download + ':' + urlIndex;
						if (jsonRe.rapid_download == 0)
						{
							console.log('cancel');
							Tasks.cancelTask(jsonRe.task_id.toString());
							success = 0;
						}
						else
						{
							success = 1;
						}
					}
				}
				else
				{
					Tasks.$state.innerHTML=xhr.statusText;
				}
				console.log('success:' + success);

				if (success == 0)
				{
					urlIndex++;
					if (urlIndex < urlList.length)
					{
						Tasks.queryMagnet(urlIndex);
					}
				}
			};
			xhr.open("POST", urlAdd, true);
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.send(data);
			Tasks.$state.innerHTML='add:' + urlIndex;
		},
		queryMagnet:function(id){
			var url = urlList[id].url;
			if (Tasks.$engine.value == 'kitty')
			{
				Tasks.kittyMagnet(url);
			}
			else
			{
				Tasks.spreadMagnet(url);
			}
		},
		isLogin:function(){
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
							Tasks.$state.innerHTML = 'not login';
						}
						else
						{
							var userName = result.toString().substring(10);
							console.log(userName);
							Tasks.$state.innerHTML = 'login:' + userName;
						}
					}
					else
					{
						Tasks.$state.innerHTML = 'get magnet failed ' + xhr.statusText;
					}
				}
			};
			xhr.open("GET", url, true);
			xhr.send(null);
			Tasks.$state.innerHTML='is login?';

		},

		spreadMagnet:function(url){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4)
				{// 4 = "loaded"a
					if (xhr.status==200)
					{// 200 = "OK"
						var urlRe = new RegExp('<a id=\"magnetDownload\" href=\"[^\"]+', "g");
						var result;
						Tasks.$state.innerHTML = "get magnet finished";
						result = urlRe.exec(xhr.responseText);
						console.log(result);
						if(result == null)
						{
							Tasks.$state.innerHTML = 'not find magnet';
						}
						else
						{
							var magnet = result.toString().substring(29);
							console.log(magnet);
							Tasks.kittyMagnet(magnet);
						}
					}
					else
					{
						Tasks.$state.innerHTML = 'get magnet failed ' + xhr.statusText;
					}
				}
			};
			xhr.open("GET", url, true);
			xhr.send(null);
			Tasks.$state.innerHTML='get magnet:' + urlIndex;
		},
		kittyMagnet:function(url){
			console.log(url);
			var xhr = new XMLHttpRequest();
			urlPost = PAN_URL + "rest/2.0/services/cloud_dl?channel=chunlei&clienttype=0&web=1" +
					"&bdstoken=" + token;
			var data = "method=query_magnetinfo&app_id=250528" + "&source_url=" +
				encodeURIComponent(url) +
				"&save_path=" + encodeURIComponent('/') + "&type=4";
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4)
				{// 4 = "loaded"a
					Tasks.$state.innerHTML='query finished'
					if (xhr.status==200)
					{// 200 = "OK"
						console.log('respon is:');
						console.log(xhr.responseText);
						var magInfo = JSON.parse(xhr.responseText);
						var strSel = '';
						var j = 0;
						for (var i = 0; i < magInfo.magnet_info.length; i++)
						{
							var temp = (magInfo.magnet_info)[i].file_name;
							
							console.log(temp);
							if (temp.search(/\.mp4$/i) != -1
								|| temp.search(/\.wmv$/i) != -1
								|| temp.search(/\.avi$/i) != -1
								|| temp.search(/\.rmvb$/i) != -1
								|| temp.search(/\.flv$/i) != -1
								|| temp.search(/\.mkv$/i) != -1)
							{
								if (j != 0)
								{
									strSel += ',';
								}
								strSel += (i + 1);
								j++;
							}
						}
						console.log(strSel);
						Tasks.addTask(url, strSel, '', '');
					}
					else
					{
						Tasks.$state.innerHTML=xhr.statusText + ':' + urlIndex;
						urlIndex++;
						if (urlIndex < urlList.length)
						{
							Tasks.queryMagnet(urlIndex);
						}
					}
				}
			};
			xhr.open("POST", urlPost, true);
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.send(data);
			Tasks.$state.innerHTML='query';
		},
		openLogin:function(){
			Tasks.show(Tasks.$eLogin).hide(Tasks.$bOpenLogin);
		},
		closeLogin:function(){
			Tasks.show(Tasks.$bOpenLogin).hide(Tasks.$eLogin);
		},
		login:function(){
			Tasks.$state.innerHTML='start login';
			var loginUse = new login();
			var userName = Tasks.$eUserName.value;
			var password = Tasks.$ePassword.value;
			loginUse.getBaiduID(userName, password);
		},
			//存储dom
		$addItemDiv:$('addItemDiv'),
		$addItemInput:$('addItemInput'),
		$txtTaskTitle:$('txtTaskTitle'),
		$taskItemList:$('taskItemList'),
		$state:$('state'),
		$token:$('token'),
		$bOpenLogin:$('bOpenLogin'),
		$eLogin:$('eLogin'),
		$bLogin:$('bLogin'),
		$eUserName:$('eUserName'),
		$ePassword:$('ePassword'),
		$bPackUp:$('bPackUp'),
		$vCode:$('vCode'),
		$eCode:$('eCode'),
		$eEdit:$('eEdit'),
		$engine:$('engine'),
		$bPrev:$('prev'),
		$bNext:$('next'),
		//指针
		index:window.localStorage.getItem('Tasks:index'),

		tagSearch:function(code){
			console.log(Tasks.$engine.value);
			if (Tasks.$engine.value == 'kitty')
			{
				Tasks.kittySearch(code, null);
			}
			else
			{
				Tasks.spreadSearch(code);
			}
		},
		spreadSearch:function(code){
			Tasks.$state.innerHTML = "spread search:" + code;
			var url = "http://www.bt2mag.com/search/" + encodeURIComponent(code);
			Tasks.spreadUrl(url);
		},
		spreadUrl:function(url){
			var xhr = new XMLHttpRequest();
			console.log(url);
			xhr.onreadystatechange = function(){
				console.log(xhr.readyState);
				if (xhr.readyState == 4)
				{
					if (xhr.status == 200)
					{
						var urlRe = new RegExp('http://www\.bt2mag\.com/magnet/detail/hash/[^\"]+', "g");
						var titleRe = new RegExp("\" title=\"[^\"]+", "g");
						var sizeRe = new RegExp("Size:[^ ]+", "g");
						var prevRe = new RegExp("[^\"]+\"><span class=\"glyphicon glyphicon\-chevron\-left", "g");
						//var prevRe = new RegExp("[^\"]+><span class=", "g");
						var nextRe = new RegExp("[^\"]+\">Next", "g");
						urlList.length = 0;
						var i = 0;
						var result;
						Tasks.$state.innerHTML = "search finished";
						while(1)
						{
							var urlItem={
								id:0,
								url:'',
								title:'',
								size:''
							};
							urlItem.id = i;
							result = urlRe.exec(xhr.responseText);
							console.log(result);
							if(result == null)
							{
								break;
							}
							urlItem.url = result.toString();
							result = titleRe.exec(xhr.responseText);
							console.log(result);
							if(result == null)
							{
								break;
							}
							urlItem.title = result.toString().substring(9);
							result = sizeRe.exec(xhr.responseText);
							console.log(result);
							if(result == null)
							{
								break;
							}
							urlItem.size = result.toString().substring(5);
							urlList.push(urlItem);
							i++;
						}
						if (i == 0)
						{
							Tasks.$state.innerHTML = 'not find';
						}
						for(var i=0,len=urlList.length;i<len;i++){ 
							Tasks.Add(urlList[i]); 
							Tasks.AppendHtml(urlList[i]); 
						}
						var index = 0;
						result = prevRe.exec(xhr.responseText);
						console.log(result);
						if (result != null)
						{
							Tasks.$bPrev.disabled = false;
							index = result.toString().indexOf("\"><span");
							cPrev = {
								disable:false,
								url:'http://www.bt2mag.com' + result.toString().substring(0,index)
							};
						}
						else
						{
							Tasks.$bPrev.disabled = true;
							cPrev = {
								disable:true
							};
						}
						result = nextRe.exec(xhr.responseText);
						console.log(result);
						if (result != null)
						{
							Tasks.$bNext.disabled = false;
							index = result.toString().indexOf("\">Next");
							console.log(index);
							cNext = {
								disable:false,
								url:'http://www.bt2mag.com' + result.toString().substring(0,index)
							};
						}
						else
						{
							Tasks.$bNext.disabled = true;
							cNext = {
								disable:true
							};
						}
						Tasks.SetButton();
					}
					else
					{
						console.log('log status:' + xhr.statusText);
						Tasks.$state.innerHTML = 'status is :' + xhr.statusText;
					}
				}

			};
			xhr.open("GET", url, true);
			xhr.send(null);
		},
		kittySearch:function(code, page){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4)
				{// 4 = "loaded"
					console.log('status:' + xhr.status);
					if (xhr.status==200)
					{// 200 = "OK"
						var urlRe = new RegExp("Detail</a><a href=\"[^\"]+", "g");
						var titleRe = new RegExp("<td class\=\"?name\"?>([^<]+)", "g");
						var sizeRe = new RegExp("<td class=\"?size\"?>([^<]+)", "g");
						var infoRe = new RegExp("class=\"action\"><a href=\"");
						var prevRe = new RegExp("\\d+\">«<");
						var nextRe = new RegExp("\\d+\">»<");
						urlList.length = 0;
						var i = 0;
						var result;
						console.log('torrent:' + code);
						Tasks.$state.innerHTML = "search finished";
						while(1)
						{
							var urlItem={
								id:0,
								url:'',
								title:'',
								size:''
							};
							urlItem.id = i;
							result = urlRe.exec(xhr.responseText);
							console.log(result);
							if(result == null)
							{
								break;
							}
							urlItem.url = result.toString().substring(19);
							result = titleRe.exec(xhr.responseText);
							console.log(result);
							if(result == null)
							{
								break;
							}
							urlItem.title = result.toString().substring(15);
							result = sizeRe.exec(xhr.responseText);
							console.log(result);
							if(result == null)
							{
								break;
							}
							urlItem.size = result.toString().substring(15);
							urlList.push(urlItem);
							i++;
						}
						if (i == 0)
						{
							Tasks.$state.innerHTML = 'not find';
						}
						
						for(var i=0,len=urlList.length;i<len;i++){ 
							Tasks.Add(urlList[i]); 
							Tasks.AppendHtml(urlList[i]); 
						}

						var index = 0;
						result = prevRe.exec(xhr.responseText);
						console.log(result);
						if (result != null)
						{
							Tasks.$bPrev.disabled = false;
							index = result.toString().indexOf("\">«<");
							cPrev = {
								disable:false,
								url:result.toString().substring(0,index)
							};
						}
						else
						{
							Tasks.$bPrev.disabled = true;
							cPrev = {
								disable:true
							};
						}
						result = nextRe.exec(xhr.responseText);
						console.log(result);
						if (result != null)
						{
							Tasks.$bNext.disabled = false;
							index = result.toString().indexOf("\">»<");
							console.log(index);
							cNext = {
								disable:false,
								url:result.toString().substring(0,index)
							};
						}
						else
						{
							Tasks.$bNext.disabled = true;
							cNext = {
								disable:true
							};
						}
						codeSave = code;
						Tasks.SetButton();
					}
					else
					{
						console.log('log status:' + xhr.statusText);
						Tasks.$state.innerHTML = 'status is :' + xhr.statusText;
					}
				}
			};
			if (page == null)
				xhr.open("GET", "http://www.torrentkitty.org/search/" + encodeURIComponent(code), true);
			else
				xhr.open("GET", "http://www.torrentkitty.net/search/" + encodeURIComponent(code) + '/' + page, true);
			console.log(encodeURIComponent(code));
			xhr.send(null);
			Tasks.$state.innerHTML = "kitty search:" + code;
		},
		getCurTab:function(){
			chrome.windows.getCurrent(function(wnd){
				chrome.tabs.getAllInWindow(wnd.id, function(tabs){
					for (var i = 0; i < tabs.length; i++){
						if (tabs[i].selected == true){
							console.log(tabs[i].url);
							if (tabs[i].url.indexOf("movie.douban.com") == -1){
								urlList.length = 0;
								for (var j = 0, len = window.localStorage.length; j < len; j++)
								{
									var key = window.localStorage.key(j);
									if (/url_\d+/.test(key))
									{
										urlList.push(JSON.parse(window.localStorage.getItem(key)));
									}
								}
								urlList.sort(function(a, b){
									return a.id - b.id;
								});
								for (var j = 0, len = urlList.length; j < len; j++)
								{
									Tasks.AppendHtml(urlList[j]);
								}

							}
							else
							{
								console.log('del all');
								var j = 0;
								while(j < window.localStorage.length)
								{
									var key = window.localStorage.key(j);
									console.log(j + ':' + len + ':' + key);
									if (/url_\d+/.test(key))
									{
										window.localStorage.removeItem(key);
										continue;
									}
									j++;
								}
								Tasks.getMovieCode(tabs[i].url);
							}
							break;
						}
					}
				});
			});
		},
		//初始化
		clickPrev:function(){
			if (Tasks.$engine.value != 'kitty')
			{
				Tasks.RemoveAll();
				Tasks.spreadUrl(cPrev.url);
			}
			else
			{
				Tasks.RemoveAll();
				Tasks.kittySearch(codeSave, cPrev.url);
			}
		},
		clickNext:function(){
			if (Tasks.$engine.value != 'kitty')
			{
				Tasks.RemoveAll();
				Tasks.spreadUrl(cNext.url);
			}
			else
			{
				Tasks.RemoveAll();
				Tasks.kittySearch(codeSave, cNext.url);
			}
		},
		init:function(){
			if(!Tasks.index){
				window.localStorage.setItem('Tasks:index',Tasks.index=0);
				
			}
			//Tasks.$bOpenLogin.disabled = true;
			Tasks.GetButton();
			token = window.localStorage.getItem('token');
			Tasks.$token.innerHTML = token;
			Tasks.getCurTab();	
			if (window.localStorage.getItem('engine') != null)
			{
				Tasks.$engine.value = window.localStorage.getItem('engine');
			}
			
			/*注册事件*/
			//打开添加文本框
			Tasks.$addItemDiv.addEventListener('click',function(){
				Tasks.show(Tasks.$addItemInput).hide(Tasks.$addItemDiv);
				Tasks.$txtTaskTitle.focus();
			},true);
			//回车添加
			Tasks.$txtTaskTitle.addEventListener('keyup',function(ev){
				var ev=ev || window.event;
				if(ev.keyCode==13){
					Tasks.RemoveAll();
					Tasks.tagSearch($('txtTaskTitle').value);
					Tasks.$txtTaskTitle.value='';
					Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
				}
				ev.preventDefault();
			},true);
			Tasks.$eEdit.addEventListener('keyup', function(ev){
				var ev=ev || window.event;
				if (ev.keyCode == 13){
					var codeImg = document.getElementById('codeImg');
					Tasks.addTask(urlMag, selectIds, vcodeGet, Tasks.$eEdit.value);
					Tasks.$vCode.removeChild(codeImg);
					Tasks.$eEdit.value = '';
					Tasks.hide(Tasks.$eCode);
				}
				ev.preventDefault();
			}, true);
			//取消
			Tasks.$txtTaskTitle.addEventListener('blur',function(){
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			},true);
			Tasks.$bOpenLogin.onclick=Tasks.openLogin; 
			Tasks.$bLogin.onclick=Tasks.login;
			Tasks.$bPackUp.onclick=Tasks.closeLogin;
			Tasks.$bPrev.onclick = Tasks.clickPrev;
			Tasks.$bNext.onclick = Tasks.clickNext;
			window.addEventListener('load', function(){
				Tasks.$engine.onchange = function(){
					window.localStorage.setItem('engine', Tasks.$engine.value);
				};	
			});
			Tasks.isLogin();
		},
		//增加
		SetButton:function(){
			window.localStorage.setItem('cPrev', JSON.stringify(cPrev));
			window.localStorage.setItem('cNext', JSON.stringify(cNext));
			window.localStorage.setItem('codeSave', JSON.stringify(codeSave));
		},
		GetButton:function(){
			cPrev = JSON.parse(window.localStorage.getItem('cPrev'));
			cNext = JSON.parse(window.localStorage.getItem('cNext'));
			codeSave = JSON.parse(window.localStorage.getItem('codeSave'));
			if (cPrev != null)
			{
				Tasks.$bPrev.disabled = cPrev.disable;
			}
			else
			{
				Tasks.$bPrev.disabled = true;
			}
			
			if (cNext != null)
			{
				Tasks.$bNext.disabled = cNext.disable;
			}
			else
			{
				Tasks.$bNext.disabled = true;
			}
		},
		Add:function(urlItem){
			//更新指针
			window.localStorage.setItem("url_" + urlItem.id, JSON.stringify(urlItem));
		},
		//修改
		Edit:function(task){
			window.localStorage.setItem("task:"+ task.id, JSON.stringify(task));
		},
		//删除
		Del:function(urlItem){
			window.localStorage.removeItem("url_"+ urlItem.id);
		},
		AppendHtml:function(urlItem){
			var oDiv=document.createElement('div');
			oDiv.className='urlItem';
			oDiv.setAttribute('id','url_' + urlItem.id);
			oDiv.setAttribute('title', urlItem.url);
			var spanIndex = document.createElement('span');
			var textIndex = document.createTextNode(urlItem.id);

			var spanTitle = document.createElement('span');
			spanTitle.className = 'red';
			var textTitle = document.createTextNode(urlItem.title);

			var spanSize = document.createElement('span');
			spanSize.classNmae = 'urlSize';
			var textSize = document.createTextNode(urlItem.size);
			
			spanIndex.appendChild(textIndex);
			spanTitle.appendChild(textTitle);
			spanSize.appendChild(textSize);

			oDiv.appendChild(spanIndex);
			oDiv.appendChild(spanTitle);
			oDiv.appendChild(spanSize);

			oDiv.addEventListener('click',function(){
				urlIndex = urlItem.id;
				Tasks.queryMagnet(urlIndex);
			},true);
			Tasks.$taskItemList.appendChild(oDiv);	
		},
		RemoveAll:function(){
			while(Tasks.$taskItemList.hasChildNodes()) //当div下还存在子节点时 循环继续
			{
				var tmp = Tasks.$taskItemList.firstChild;
				window.localStorage.removeItem(tmp.getAttribute('id'));
				Tasks.$taskItemList.removeChild(tmp);
			}
		}
	}
	Tasks.init();
})();
