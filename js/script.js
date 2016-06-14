// get and store data by ajax
var Data={}
var apiURL = 'http://apis.baidu.com/heweather/weather/free?city='
$('.search-bar').bind('focus', function() {
		$.ajax({
		type: "GET",
		dataType: 'json',
		url: apiURL + $('.search-bar').val(),
		beforeSend: function(request) {
			request.setRequestHeader('apikey', '90fd79ea108aea2f4429dece83ac9192');
		},
		success: function(request) {
			var responseData = request['HeWeather data service 3.0'][0]
			if (responseData.status) {
				var aqi = responseData.aqi
				var basic = responseData.basic
				var dailyForecast = responseData.daily_forecast
				var hourlyForecast = responseData.hourly_forecast
				var suggestion = responseData.suggestion
				var status = responseData.status
				console.log(suggestion)

				var maxTempList = []
				var minTempList = [] 
				var dayWeatherList = [] 
				var nightWeatherList = [] 

				// format data as need
				for(var i=0; i < dailyForecast.length; i++ ) {
					maxTempList.push(dailyForecast[i].tmp.max)
					minTempList.push(dailyForecast[i].tmp.min)
					dayWeatherList.push(dailyForecast[i].cond.txt_d)
					nightWeatherList.push(dailyForecast[i].cond.txt_n)
				}
				Data.maxTempList = maxTempList
				Data.minTempList = minTempList
				Data.dayWeatherList = dayWeatherList
				Data.nightWeatherList = nightWeatherList
				console.log(Data)
			}
	 	}
	})
})
$('.search-bar').trigger('focus')
// 
console.log(Data)


// canvas






$(document).ajaxSuccess(function() {
		// tempertature line
var templine = $('#templine')[0];
console.log(typeof templine)
if (templine.getContext) {
	templine.width =  window.innerWidth - 40
	templine.height = 300
	var ctx = templine.getContext('2d')
	console.log(ctx)
	ctx.beginPath()
	
	drawUpperLine(Data.maxTempList)
	ctx.strokeStyle = '#eee'
	ctx.stroke()
}
function drawUpperLine(data) {
	var temp = 0
	console.log(data)
	ctx.moveTo(0, data[0]*8)
	for(var g=0; g<data.length; g++) {
		ctx.lineTo(temp, data[g]*8)
		ctx.font = 'bold 16px Arial'
		ctx.textAlign = "start"
		ctx.fillText(data[g], temp, data[g]*8 - 9)
		temp+=100
	}
}
function drawUnderLine() {

}
function darwDot() {

}
})




