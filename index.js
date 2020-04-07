var Express = require("express");
var app =Express();
var port = process.env.PORT ||3000;
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var schedule = require('node-schedule');
const axios = require('axios');
const cheerio = require('cheerio');


app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	
	res.render("home");
	schedule.scheduleJob("12 20 * * 0-6", function(){

	axios.get('https://www.worldometers.info/coronavirus/country/us/').then((res)=>{

		const $ = cheerio.load(res.data);

		const njTotalCases = $("#usa_table_countries_today > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(2)").text();
		const njNewCases = $("#usa_table_countries_today > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(3)").text();
		const njTotalDeaths =$("#usa_table_countries_today > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(4)").text();
		const njNewDeaths = $("#usa_table_countries_today > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(5)").text();
		const njActiveCases = $("#usa_table_countries_today > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(6)").text();

		var coronainfoOutput = "Total Cases:\n"+njTotalCases+"\n\n"+"New Cases:"+njNewCases+"\n\n"+"Total Deaths:"+njTotalDeaths+"\n\n"+"New Deaths: \n"+njNewDeaths+"\n\n"+"Active Cases: "+njActiveCases;
		//string to be sent for outputting 
		var coronainfoOutputHeading="NJ COVID-19 Update\n----------------\n";

		client.messages
			 .create({
			body: coronainfoOutputHeading + coronainfoOutput,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: process.env.ANT_NUMBER
			})
			.then(message => console.log(message.sid));
	});
});

});


app.listen(port, function(){

	console.log("Server started")
});