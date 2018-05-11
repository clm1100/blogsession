var qs1 = require('querystring');
var qs = require('qs');
var obj = {
    a:1,
    b:2,
    c:{
        r:22
    },
    d:[1,2,3,5,6]
}

console.log(qs1.stringify(obj));
console.log(qs.stringify(obj))
console.log(qs.parse(qs.stringify(obj)))