// get and store data by ajax
var Data = {}
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
                for (var i = 0; i < dailyForecast.length; i++) {
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
Data.maxTempList = [23, 45, 12, 35, 29, 33, 8]
Data.minTempList = [29, 35, 22, 15, 29, 23, 18]
Data.dayWeatherList = ['cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud']
Data.nightWeatherList = ['cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud']
Data.WeekList = ['周日','周一', '周二', '周三', '周四', '周五', '周六']
console.log(Data)
convertWeekList(Data.WeekList)
console.log(Data.WeekList)
// canvas
// $(document).ajaxSuccess(function() {
// tempertature line
var templine = $('#templine')[0];
console.log(typeof templine)
if (templine.getContext) {
    templine.width = window.innerWidth
    templine.height = 700
    var intervalWidth = Math.floor((templine.width-80) / 6) // 点与点之间的距离
    var ctx = templine.getContext('2d')
    console.log(ctx)
    ctx.strokeStyle = '#eee'
    ctx.beginPath()
    drawUpperLine(intervalWidth, Data.maxTempList)
    // ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    drawUnderLine(intervalWidth, Data.minTempList)
    ctx.stroke()

    ctx.beginPath()
    darwUpperDots(intervalWidth, Data.maxTempList)
    ctx.fill()

    ctx.beginPath()
    drawUnderDots (intervalWidth, Data.minTempList)
    ctx.fill()

    ctx.beginPath()
    drawWeatherText (intervalWidth, Data.dayWeatherList, Data.WeekList)
    // ctx.fill()
        // ctx.closePath()
}

function drawUpperLine(width, data) {
    var temp = 40
    console.log(data)
    ctx.moveTo(40, data[0] * 4)
    for (var g = 0; g < data.length; g++) {
        ctx.lineTo(temp, data[g] * 4)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = "center"
        ctx.fillText(data[g], temp, data[g] * 4 - 15)
        temp += width
    }
}

function drawUnderLine(width, data) {
    var temp = 40
    console.log(data)
    ctx.moveTo(40, data[0] * 4 + 100)
    for (var g = 0; g < data.length; g++) {
        ctx.lineTo(temp, data[g] * 4 + 100)
        ctx.fillStyle = '#fff'
        ctx.font = '16px Arial'
        ctx.textAlign = "center"
        ctx.fillText(data[g], temp, data[g] * 4 + 25 + 100)
        temp += width
    }
}

function darwUpperDots(width, data) {
	var temp = 40
	for(var k=0; k<data.length; k++) {
		ctx.moveTo(temp, data[k]*4)
		ctx.arc(temp, data[k]*4, 5, 0, 2 * Math.PI)
		temp+= width
	}
}
function drawUnderDots (width, data) {
	var temp = 40
	for(var k=0; k<data.length; k++) {
		ctx.moveTo(temp, data[k]*4+100)
		ctx.arc(temp, data[k]*4+100, 5, 0, 2 * Math.PI)
		temp+= width
	}
}

function drawWeatherText (width, dataWeather, dataWeek) {
	var temp = 40
	ctx.fillStyle = '#fff'
    ctx.font = '16px 华文细黑'
    ctx.textAlign = "center"
	for(var d=0; d<dataWeather.length; d++) {
		// ctx.moveTo(temp, 350)
		ctx.fillText(dataWeather[d], temp, 300)
		ctx.fillText(dataWeek[d], temp, 330)
		temp+=width
	}
	
}

function convertWeekList(weeklist) {
	var date = new Date()
	var nowWeek = date.getDay()
	var arr_1 = weeklist.slice(0,nowWeek)
	var arr_2 = weeklist.slice(nowWeek)
	Data.WeekList = arr_2.concat(arr_1) 
}

// })

// disable right-click menu
// $(document).bind('contextmenu', function() {
//     return false
// })
