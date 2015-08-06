var urlList = new Array();
var PAN_URL = "http://pan.baidu.com/";
var PASSPORT_BASE = "https://passport.baidu.com/";
var PASSPORT_URL = PASSPORT_BASE + "v2/api/";
var ACCEPT_HTML = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
var token = '';
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
		addTask:function(url, fileIds){
			var timeStamp = new Date().getTime();
			var urlAdd = PAN_URL + "rest/2.0/services/cloud_dl?channel=chunlei&clienttype=0&web=1" +
			                "&bdstoken=" + token;
			var data = "method=add_task&app_id=250528" + "&file_sha1=" + '' + //file_sha1
				"&save_path=" + encodeURIComponent('/') + "&selected_idx=" + fileIds +
				"&task_from=1" + "&t=" + timeStamp + "&" + "source_url" +
				"=" + encodeURIComponent(url) + "&type=4";
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4)
				{
					console.log(xhr.responseText);
					var jsonRe = JSON.parse(xhr.responseText);
					Tasks.$state.innerHTML='retCode is :' + jsonRe.rapid_download;
				}
				else
				{
					Tasks.$state.innerHTML=xhr.statusText;
				}
			};
			xhr.open("POST", urlAdd, true);
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.send(data);
			Tasks.$state.innerHTML='add';
		},
		queryMagnet:function(url){
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
						Tasks.addTask(url, strSel);
					}
					else
					{
						Tasks.$state.innerHTML=xhr.statusText;
					}
				}
			};
			xhr.open("POST", urlPost, true);
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.send(data);
			Tasks.$state.innerHTML='query';
		},
		getToken:function(){
			var timeStamp = new Date().getTime();
			console.log(timeStamp);
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4 )
				{
					if (xhr.status == 200)
					{
						var re = new RegExp("MYBDSTOKEN = \"[^\"]+", "g");
						var result = re.exec(xhr.responseText);
						if (result != null)
						{
							token = result.toString().substring(14);
							window.localStorage.setItem('token', token);
							Tasks.$token.innerHTML=token;
							console.log(token);
						}
						//console.log(jsonObj);
					}
					else
					{
						alert("Problem retrieving XML data:" + xhr.statusText);
					}
				}
			};
			xhr.open("GET", "http://pan.baidu.com/disk/home", true);/*
			xhr.setRequestHeader("Cookie", cookieStr);
			xhr.setRequestHeader("Accept", ACCEPT_HTML);
			xhr.setRequestHeader("Cache-control", "max-age=0");*/
			xhr.send(null);

		},
			//存储dom
		$addItemDiv:$('addItemDiv'),
		$addItemInput:$('addItemInput'),
		$txtTaskTitle:$('txtTaskTitle'),
		$taskItemList:$('taskItemList'),
		$state:$('state'),
		$token:$('token'),
		$bToken:$('bToken'),
		//指针
		index:window.localStorage.getItem('Tasks:index'),
		
		tagSearch:function(code){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4)
				{// 4 = "loaded"
					Tasks.$state.innerHTML = "idle";
					console.log(xhr.status);
					if (xhr.status==200)
					{// 200 = "OK"
						var urlRe = new RegExp("Detail</a><a href=\"[^\"]+", "g");
						var titleRe = new RegExp("<td class\=\"?name\"?>([^<]+)", "g");
						var sizeRe = new RegExp("<td class=\"?size\"?>([^<]+)", "g");
						urlList.length = 0;
						var i = 0;
						var result;
						console.log('torrent:' + code);
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
						for(var i=0,len=urlList.length;i<len;i++){
							Tasks.AppendHtml(urlList[i]);
						}
					}
					else
					{
						alert("Problem retrieving XML data:" + xhr.statusText);
					}
				}
			};
			xhr.open("GET", "http://www.torrentkitty.org/search/" + encodeURIComponent(code), true);
			xhr.send(null);
			Tasks.$state.innerHTML = "search";
		},
		getCurTab:function(){
			chrome.windows.getCurrent(function(wnd){
				chrome.tabs.getAllInWindow(wnd.id, function(tabs){
					for (var i = 0; i < tabs.length; i++){
						if (tabs[i].selected == true){
							console.log(tabs[i].url);
							if (tabs[i].url.indexOf("movie.douban.com") == -1){
								break;
							}
							Tasks.getMovieCode(tabs[i].url);
						}
					}
				});
			});
		},
		//初始化
		init:function(){
			if(!Tasks.index){
				window.localStorage.setItem('Tasks:index',Tasks.index=0);
				
			}
			token = window.localStorage.getItem('token');
			Tasks.$token.innerHTML = token;
			Tasks.getCurTab();	
			
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
				}
				ev.preventDefault();
			},true);
			//取消
			Tasks.$txtTaskTitle.addEventListener('blur',function(){
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			},true);
			Tasks.$bToken.onclick=Tasks.getToken;
		},
		//增加
		Add:function(task){
			//更新指针
			window.localStorage.setItem('Tasks:index', ++Tasks.index);
			task.id=Tasks.index;
			window.localStorage.setItem("task:"+ Tasks.index, JSON.stringify(task));
		},
		//修改
		Edit:function(task){
			window.localStorage.setItem("task:"+ task.id, JSON.stringify(task));
		},
		//删除
		Del:function(task){
			window.localStorage.removeItem("task:"+ task.id);
		},
		AppendHtml:function(urlItem){
			var oDiv=document.createElement('div');
			oDiv.className='urlItem';
			oDiv.setAttribute('id','url_' + urlItem.id);
			oDiv.setAttribute('title', urlItem.url);
			var spanTitle = document.createElement('span');
			spanTitle.className = 'urlTitle';
			var textTitle = document.createTextNode(urlItem.title);

			var spanSize = document.createElement('span');
			spanSize.classNmae = 'urlSize';
			var textSize = document.createTextNode(urlItem.size);

			spanTitle.appendChild(textTitle);
			spanSize.appendChild(textSize);
			oDiv.appendChild(spanTitle);
			oDiv.appendChild(spanSize);

			oDiv.addEventListener('click',function(){
				Tasks.queryMagnet(urlItem.url);
			},true);
			Tasks.$taskItemList.appendChild(oDiv);	
		},
		RemoveAll:function(){
			while(Tasks.$taskItemList.hasChildNodes()) //当div下还存在子节点时 循环继续
			{
				Tasks.$taskItemList.removeChild(Tasks.$taskItemList.firstChild);
			}
		},
		RemoveHtml:function(task){
			var taskListDiv=Tasks.$taskItemList.getElementsByTagName('div');
			for(var i=0,len=taskListDiv.length;i<len;i++){
				var id=parseInt(taskListDiv[i].getAttribute('id').substring(5));
				if(id==task.id){
					Tasks.$taskItemList.removeChild(taskListDiv[i]);
					break;
				}
			}
		}
	}
	Tasks.init();
})();
