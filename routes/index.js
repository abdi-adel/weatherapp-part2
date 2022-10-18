var express = require('express');
var router = express.Router();
var request = require('sync-request');

var cityList = [
  {name: "Paris", desc: "Couvert", img:"/images/picto-1.png", temp_min:2, temp_max: 19},
  {name: "Marseille", desc: "Couvert", img:"/images/picto-1.png", temp_min:6, temp_max: 12},
  {name: "Lyon", desc: "Couvert", img:"/images/picto-1.png", temp_min:8, temp_max: 11},
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/weather', function(req, res, next){
  res.render('weather', {cityList})
})

router.post('/add-city', function(req, res, next){
  
  var data = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&units=metric&lang=fr&appid=0c815b9455235455a301668a56c67b18`) 
  var dataAPI = JSON.parse(data.body)

  var alreadyExist = false;

  for(var i=0; i<cityList.length;i++){
    if(req.body.newcity.toLowerCase() == cityList[i].name.toLowerCase() ){
      alreadyExist = true;
    }
  }

  if(alreadyExist == false && dataAPI.name){
    cityList.push({
      name: req.body.newcity,
      desc:  dataAPI.weather[0].description,
      img: "http://openweathermap.org/img/wn/"+dataAPI.weather[0].icon+".png",
      temp_min: dataAPI.main.temp_min,
      temp_max: dataAPI.main.temp_max,
    })
  }
  

  res.render('weather', {cityList})
})

router.get('/delete-city', function(req, res, next){

  cityList.splice(req.query.position, 1)

  res.render('weather', {cityList})
})

module.exports = router;
