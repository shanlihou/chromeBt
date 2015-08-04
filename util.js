var blockFunction = function(info){
	toast(info.url);
        return {cancel: true};
};
var toast = function(message){
	new Notification(message,{
		icon: '48.png',
		body: 'Time to make the toast.'
	});
}
