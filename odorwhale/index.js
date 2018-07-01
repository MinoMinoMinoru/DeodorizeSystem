// Import express and request modules
var express = require('express');
var request = require('request');
var exec = require('child_process').exec;

// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to  store them securely in environment variables.
var clientId = '374715646114.376556155424';
var clientSecret = '09406a900e3d13c2d7e4e8a5fbd1c688';

// Instantiates Express and assigns our app variable to it
var app = express();


// Again, we define a port we want to listen to
const PORT=4390;

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});


// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});


var count = 0;  //使用回数
var child;
var timetxt;
var now;
var month, date, hour, min, sec;
// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', function(req, res) {	//req :ブラウザから送られてくるものすべて

    //日付，時刻の取得
    //var now = new Date();

    if (count == 0){
        timetxt = "                  /aromaはありません．";
      }
    else{
      timetxt = "                  "+ month + "月" + date + "日" + hour + ":" + min + ":" + sec;
    }

    count ++;
    res.send('今日も研究お疲れ様です!!\n合計'+count+'回癒やしました。\nその調子で研究頑張ってください！\n-----前回の/aromaコマンド使用時刻-----\n'+timetxt);

    //サーボモータのみを動かす場合
    child = exec("python servo_motor.py", function (error, stdout, stderr) {
    	console.log(count+'回/aromaを実行しました．')
      //console.log('stdout: ' + stdout);
    	//console.log('stderr: ' + stderr);
    	if (error !== null) {
    	   console.log('exec error: ' + error);
    	}

      //日付，時刻の取得
      now = new Date();
      month = now.getMonth() + 1;
      date = now.getDate();
      hour = now.getHours();
      min = now.getMinutes();
      sec = now.getSeconds();
    });

});
