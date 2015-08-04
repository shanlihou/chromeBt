var xhr = new XMLHttpRequest();
var urlList = new Array();
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
		displayContent:function(){
			if (xhr.readyState==4)
			{// 4 = "loaded"
				if (xhr.status==200)
				{// 200 = "OK"
					var urlRe = new RegExp("http://www\.btava\.com/magnet/detail/hash/[A-F0-9]+", "g");
					var titleRe = new RegExp("\" title=\"[^\"]+", "g");
					var sizeRe = new RegExp("Size:[^ ]+", "g");
					urlList.length = 0;
					var i = 0;
					var result;
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
						if(result == null)
						{
							break;
						}
						urlItem.url = result;
						result = titleRe.exec(xhr.responseText);
						if(result == null)
						{
							break;
						}
						urlItem.title = result.toString().substring(9);
						console.log(result.toString().substring(9));
						result = sizeRe.exec(xhr.responseText);
						if(result == null)
						{
							break;
						}
						urlItem.size = result.toString().substring(5);
						console.log(result.toString().substring(5));
						console.log(urlItem);
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
		},
			//存储dom
		$addItemDiv:$('addItemDiv'),
		$addItemInput:$('addItemInput'),
		$txtTaskTitle:$('txtTaskTitle'),
		$taskItemList:$('taskItemList'),
		//指针
		index:window.localStorage.getItem('Tasks:index'),
		tagSearch:function(code){
			xhr.onreadystatechange = Tasks.displayContent;
			xhr.open("GET", "http://www.btava.com/search/" + encodeURIComponent(code), true);
			xhr.send(null);
		},
		//初始化
		init:function(){
			if(!Tasks.index){
				window.localStorage.setItem('Tasks:index',Tasks.index=0);
			}
			xhr.onreadystatechange = Tasks.displayContent; // Implemented elsewhere.
			xhr.open("GET", 'http://www.btava.com/search/wanz-213', true);
			xhr.send(null);
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
					Tasks.tagSearch($('txtTaskTitle').value);/*
					var task={
						id:0,
						task_item:$('txtTaskTitle').value,
						add_time:new Date(),
						is_finished:false
					};
					Tasks.Add(task);
					Tasks.AppendHtml(task);
					Tasks.$txtTaskTitle.value='';
					Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
					chrome.runtime.sendMessage({cmd: "mycmd"}, function(response) {  console.log(response); });*/
				}
				ev.preventDefault();
			},true);
			//取消
			Tasks.$txtTaskTitle.addEventListener('blur',function(){
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			},true);
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
			},true);
			Tasks.$taskItemList.appendChild(oDiv);	
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
