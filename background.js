// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.
var urlList=new Array();
urlList[0] = "*://*.baidu.com/"
chrome.webRequest.onBeforeRequest.addListener(
/*
	function(info) {
		/*
		var notification = webkitNotifications.createNotification(
		  '48.png',  // icon url - can be relative
		  'Hello!',  // notification title
		  'Lorem ipsum...'  // notification body text
		);
		
		notification.show();*/
		/*
		new Notification(info.url, {
			icon: '48.png',
			body: 'Time to make the toast.'
		  });
        return {cancel: true};
	},*/
	blockFunction,
  // filters
	{
		urls:urlList
	},
  // extraInfoSpec
  ["blocking"]);


chrome.runtime.onMessage.addListener(  function(request, sender, sendResponse) { 
		console.log("message of add Listener");
		toast("mycmd");
		chrome.webRequest.onBeforeRequest.removeListener(blockFunction);
		urlList.length = 0;
		if (window.localStorage.length-1){
			var key;
			for (var i = 0, len = window.localStorage.length; i < len; i ++){
				key = window.localStorage.key(i);
				if (/task:\d+/.test(key)){
					urlList.push(JSON.parse(window.localStorage.getItem(key)).task_item);
				}
			}
		}
		if (urlList.length == 0){
			urlList[0] = "*://*.baidu.com/";
		}
		chrome.webRequest.onBeforeRequest.addListener(
		blockFunction,
		{
			urls:urlList
		},
	  	["blocking"]);
		if (request.cmd== "mycmd") 
		sendResponse( "ok"); 
		});
