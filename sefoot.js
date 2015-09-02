var login = document.getElementById("lol");
var sign = document.getElementById("sign");
login.onclick = function(){
	console.log("login");
	var url = "http://www.sefoot.com/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1";
	var arg = "fastloginfield=username&username=lvpidadiao&cookietime=2592000&password=1157039&quickforward=yes&handlekey=ls";
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		console.log(xhr.readyState);
		if (xhr.readyState == 4)  
		{
			console.log(xhr.status);
			if(xhr.status == 200)  
			{  
			}  
		}
	};
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
	xhr.setRequestHeader("Content-Legnth", arg.length);
	xhr.send(arg);
};
sign.onclick = function(){
	console.log("sign");
	var url = "http://www.sefoot.com/plugin.php?id=dsu_amupper&ppersubmit=true&formhash=3c0f9753&infloat=yes&handlekey=dsu_amupper&inajax=1&ajaxtarget=fwin_content_dsu_amupper";
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4)
		{
			if(xhr.status == 200)
			{
				console.log(xhr.responseText);
			}
		}
	};
	xhr.open("GET", url, true);
	xhr.send(null);
};
