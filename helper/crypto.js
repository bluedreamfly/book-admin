var crypto = require('crypto');
var config = require('../config/index')
//加密
function encrypt(str){
    console.log(config.crypto.secret, str);
	var cipher = crypto.createCipher('aes192', config.crypto.secret);
	var enc = cipher.update(str,'utf8','hex');
	enc += cipher.final('hex');

	return enc;
}

//解密
function decrypt(str){
    console.log(config.crypto.secret, str);
	var decipher = crypto.createDecipher('aes192', config.crypto.secret);
	var dec = decipher.update(str,'hex','utf8');
	dec += decipher.final('utf8');
	return dec;
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}
