var S = require('superagent')
var apikey="c396dbc1dadd4fd09c61b4a2ae65ba9a";
var url = "http://www.tuling123.com/openapi/api";

var obj = {
    key:"c396dbc1dadd4fd09c61b4a2ae65ba9a",
    info:"你是谁",
    userid: "123456"
}
S.post(url).send(obj).end(function(err,data,body){
    console.log(err)
    console.log(data)
    console.log(body)
})