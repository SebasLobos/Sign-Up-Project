var express= require("express");
var bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

var app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

    const name = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
   
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/PUT YOUR ID HERE";
    const options = {
        method: "POST",
        auth: "sebas1:PUT YOUR API KEY HERE"
    }
    const request =  https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function (data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure.html", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
})
