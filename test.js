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
					var re = new RegExp("http://www\.btava\.com/magnet/detail/hash/[A-F0-9]+", "g");
					urlList.length = 0;
					var i = 0;
					while(1)
					{
						var result = re.exec(xhr.responseText);
						if(result == null)
						{
							break;
						}
						console.log(typeof(result));
						console.log(result);
						urlList[i] = result;
						i++;
					}
					for(var i=0,len=urlList.length;i<len;i++){
						console.log(typeof(urlList[i]));
						console.log(urlList[i]);
						var task={
							id:0,
							task_item:urlList[i],
							add_time:new Date(),
							is_finished:false
						};
						Tasks.AppendHtml(task);
					}
				}
				else
				{
					alert("Problem retrieving XML data:" + xhr.status);
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
					chrome.runtime.sendMessage({cmd: "mycmd"}, function(response) {  console.log(response); });
				}
				ev.preventDefault();
			},true);
			//取消
			Tasks.$txtTaskTitle.addEventListener('blur',function(){
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			},true);
			//初始化数据
			if(window.localStorage.length-1){
				var task_list=[];
				var key;
				for(var i=0,len=window.localStorage.length;i<len;i++){
					key=window.localStorage.key(i);
					if(/task:\d+/.test(key)){
						task_list.push(JSON.parse(window.localStorage.getItem(key)));
					}
				}
				for(var i=0,len=task_list.length;i<len;i++){
					console.log(typeof(task_list[i]));
					console.log(task_list[i]);
					Tasks.AppendHtml(task_list[i]);
				}
			}
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
		AppendHtml:function(task){
			var oDiv=document.createElement('div');
			oDiv.className='taskItem';
			oDiv.setAttribute('id','task_' + task.id);
			var addTime=new Date(task.add_time);
			var timeString=addTime.getMonth() + '-' + addTime.getDate() + ' ' + addTime.getHours() + ':' + addTime.getMinutes() + ':' + addTime.getSeconds();
			oDiv.setAttribute('title',timeString);
			var oLabel=document.createElement('label');
			oLabel.className= task.is_finished ? 'off' : 'on';
			var oSpan=document.createElement('span');
			oSpan.className='taskTitle';
			var oText=document.createTextNode(task.task_item);
			oSpan.appendChild(oText);
			oDiv.appendChild(oLabel);
			oDiv.appendChild(oSpan);
			//注册事件
			oDiv.addEventListener('click',function(){
				if(!task.is_finished){
					task.is_finished=!task.is_finished;
					var lbl=this.getElementsByTagName('label')[0];
					lbl.className= (lbl.className=='on') ? 'off' : 'on';
					Tasks.Edit(task);
				}else{
					if(confirm('是否确定要删除此项？\r\n\r\n点击确定删除，点击取消置为未完成。')){
						Tasks.Del(task);
						Tasks.RemoveHtml(task);
						chrome.runtime.sendMessage({cmd: "mycmd"}, function(response) {  console.log(response); });
					}else{
						task.is_finished=!task.is_finished;
						var lbl=this.getElementsByTagName('label')[0];
						lbl.className= (lbl.className=='on') ? 'off' : 'on';
						Tasks.Edit(task);
					}
				}
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
