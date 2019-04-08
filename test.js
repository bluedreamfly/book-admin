// // const router = require('./helper/router');
// // const fs = require('fs');

// // let files = fs.readdirSync('./controller');
// // console.log(files);

// // var jwt = require('jsonwebtoken');

// // let token1 = '';
// // jwt.sign({
// //     data: 'foobar'
// //   }, 'secret', {  }, function(err, token) {
// //       if (err) console.log('err,...', err);
// //       console.log('token....', token);
// //     token1 = token;
// //   });

// //   setTimeout(() => {
// //       console.log(token1);
// //     jwt.verify(token1, 'secret', function(err, decoded) {
// //         if (err) {
// //             console.log('err', err);
// //           /*
// //             err = {
// //               name: 'TokenExpiredError',
// //               message: 'jwt expired',
// //               expiredAt: 1408621000
// //             }
// //           */
// //         }
// //         console.log('decoded', decoded);
// //       });
// //   }, 10 * 1000);

// var crypto = require('crypto');
// //加密
// function encrypt(str,secret){
// 	var cipher = crypto.createCipher('aes192',secret);
// 	var enc = cipher.update(str,'utf8','hex');
// 	enc += cipher.final('hex');

// 	return enc;
// }

// //解密
// function decrypt(str,secret){
// 	var decipher = crypto.createDecipher('aes192',secret);
// 	var dec = decipher.update(str,'hex','utf8');
// 	dec += decipher.final('utf8');
// 	return dec;
// }
// let origin = '1';
// let secret = 'piaoliuping';
// let result = encrypt(origin, secret);
// console.log(result);
// console.log('decrypt...', decrypt(result, secret));


//  const redis = require('./helper/redis')
//  const crypto = require('crypto');

 const redis = require('redis');
const util = require('util');
let client = redis.createClient();
client.get = client.get.bind(client);
const cget = util.promisify(client.get.bind(client))

cget('09d9c66ed4c2b6655825e75c083d096d').then(res => {
    console.log('setting.....gggg', res);
})
client.get('09d9c66ed4c2b6655825e75c083d096d', function(err, res) {
     console.log('setting.....', res);
 })

//  const md5 = crypto.createHash('md5');
//  console.log(md5.update('12345678').digest('hex'))

const getDateRange = (date) => {
    let oyear = date.getFullYear();
    let omonth = date.getMonth();
    let day = date.getDate();
    let month = omonth;
    let year = oyear;

    if (month == 11) {
        year += 1;
        month = 1;
    } else {
        month  = omonth + 2;
    }

    return {
        start: new Date(`${oyear}-${omonth + 1}-${1} 0:0:0`),
        end: new Date(`${year}-${month}-${1} 0:0:0`)
    }
}

let date = getDateRange(new Date());

console.log('date ....', date);
