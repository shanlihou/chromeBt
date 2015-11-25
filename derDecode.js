function subSeq(){
	var seq = '';
	var length = 0;
	var tab = 0;
};

function derDecode(){
	derDecode.getPubdecode = function(code){
		var re = new RegExp('-----BEGIN PUBLIC KEY-----[^-]+');
		var result = re.exec(code);
		if (result != null){
			var text =  result.toString().substring(26).replace(/\n/g, '');
			console.log(text);
			return text;
		}
		console.log('not find code');
		return null;
	};
	derDecode.getCode = function(hex, index){
		return parseInt(hex.substring(index * 2, index * 2 + 2), 16);
	};
	derDecode.getSeq = function(hex, start, length){
		return hex.substring(start * 2, start * 2 + length * 2);
	};
	derDecode.getSequence = function(hex){
		var retSeq = new subSeq();
		if (derDecode.getCode(hex, 1) > 127){
			retSeq.length = derDecode.getCode(hex, 2);
			retSeq.tab = 3 + retSeq.length;
			retSeq.seq = derDecode.getSeq(hex, 3, retSeq.length);
		}else{
			retSeq.length = derDecode.getCode(hex, 1);
			retSeq.tab = 2 + retSeq.length;
			retSeq.seq = derDecode.getSeq(hex, 2, retSeq.length);
		}
		console.log(retSeq);
		return retSeq;
	};

	derDecode.getAll = function(pubKey, passwd){
		code = derDecode.getPubdecode(pubKey);
		var hex = b64tohex(code);
		derDecode.print(hex);
		var seqAll = derDecode.getSequence(hex);
		var seqAlgori = derDecode.getSequence(seqAll.seq);
		var seqInt = derDecode.getSequence(seqAll.seq.substring(seqAlgori.tab * 2));
		var firstInt = derDecode.getSequence(seqInt.seq.substring(2));
		var N = derDecode.getSequence(firstInt.seq);
		var E = derDecode.getSequence(firstInt.seq.substring(N.tab * 2));
		var enc = getRSAEncryptValue(N.seq.substring(1), E.seq, passwd);

		return enc;
	};

	derDecode.print = function(hex){
		var len = hex.length;
		var i = 0;
		var str = '';
		for (i = 0; i < len; i++){
			str += hex.charAt(i) + ' ';
		}
		console.log(str);
	};
	derDecode.init = function(){
		console.log('init');
	};
};
derDecode();
