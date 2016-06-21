// get and store data by ajax
var Data = {}
var apiURL = 'http://apis.baidu.com/heweather/weather/free?city='
// var apiURL = 'https://api.heweather.com/x3/weather?cityid='
$('.search-bar').bind('focus', function() {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: apiURL + $('.search-bar').val(),
        beforeSend: function(request) {
            request.setRequestHeader('apikey', '90fd79ea108aea2f4429dece83ac9192');
            // request.setRequestHeader('apikey', '9ae75ecde7f146cca2a5c1653aed41c7');
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
                var dayWeatherCodes = []
                var nightWeatherCodes = []
                // format data as need
                for (var i = 0; i < dailyForecast.length; i++) {
                    maxTempList.push(dailyForecast[i].tmp.max)
                    minTempList.push(dailyForecast[i].tmp.min)
                    dayWeatherList.push(dailyForecast[i].cond.txt_d)
                    dayWeatherCodes.push(dailyForecast[i].cond.code_d)
                    nightWeatherList.push(dailyForecast[i].cond.txt_n)
                    nightWeatherCodes.push(dailyForecast[i].cond.code_n)
                }
                Data.maxTempList = maxTempList
                Data.minTempList = minTempList
                Data.dayWeatherList = dayWeatherList
                Data.nightWeatherList = nightWeatherList
                Data.nightWeatherCodes = nightWeatherCodes
                Data.dayWeatherCodes = dayWeatherCodes
                console.log(Data)
            }
        }
    })
})
$('.search-bar').trigger('focus')
    
// Data.maxTempList = [23, 45, 12, 35, 29, 33, 8]
// Data.minTempList = [29, 35, 22, 15, 29, 23, 18]
// Data.dayWeatherList = ['cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud']
// Data.nightWeatherList = ['cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud', 'cloud']

// 设置星期排序数组
convertWeekList()
function convertWeekList(weeklist) {
	var weeklist = ['周日','周一', '周二', '周三', '周四', '周五', '周六']
	var date = new Date()
	var nowWeek = date.getDay()
	var arr_1 = weeklist.slice(0,nowWeek)
	var arr_2 = weeklist.slice(nowWeek)
	Data.WeekList = arr_2.concat(arr_1) 
}
// canvas
$(document).ajaxSuccess(function() {
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
    ctx.lineWidth = 2
    drawUpperLine(intervalWidth, Data.maxTempList)

    drawUnderLine(intervalWidth, Data.minTempList)

    darwUpperDots(intervalWidth, Data.maxTempList)

    drawUnderDots (intervalWidth, Data.minTempList)

    drawWeatherText (intervalWidth, Data.dayWeatherList, Data.WeekList)

    drawWeatherIcon(intervalWidth, Data.dayWeatherCodes)
	// var weathericon = new Image()
	// weathericon.src = 'http://www.heweather.com/weather/images/icon/300.png'
	// weathericon.onload = function() {
	// 	ctx.drawImage(weathericon, 15, 380-40,50,50)
	// }

}

function drawUpperLine(width, data) {
    var temp = 40
    ctx.beginPath()
    ctx.moveTo(40, data[0] * 4)
    for (var g = 0; g < data.length; g++) {
        ctx.lineTo(temp, data[g] * 4)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = "center"
        ctx.fillText(data[g], temp, data[g] * 4 - 15)
        temp += width
    }
    ctx.stroke()
}

function drawUnderLine(width, data) {
    var temp = 40
    ctx.beginPath()
    ctx.moveTo(40, data[0] * 4 + 100)
    for (var g = 0; g < data.length; g++) {
        ctx.lineTo(temp, data[g] * 4 + 100)
        ctx.fillStyle = '#fff'
        ctx.font = '16px Arial'
        ctx.textAlign = "center"
        ctx.fillText(data[g], temp, data[g] * 4 + 25 + 100)
        temp += width
    }
    ctx.stroke()
}

function darwUpperDots(width, data) {
	var temp = 40
	ctx.beginPath()
	for(var k=0; k<data.length; k++) {
		ctx.moveTo(temp, data[k]*4)
		ctx.arc(temp, data[k]*4, 5, 0, 2 * Math.PI)
		temp+= width
	}
	ctx.fill()
}

function drawUnderDots (width, data) {
	var temp = 40
	ctx.beginPath()
	for(var k=0; k<data.length; k++) {
		ctx.moveTo(temp, data[k]*4+100)
		ctx.arc(temp, data[k]*4+100, 5, 0, 2 * Math.PI)
		temp+= width
	}
	ctx.fill()
}

function drawWeatherText (width, dataWeather, dataWeek) {
	var temp = 40

	ctx.fillStyle = '#fff'
    ctx.font = '16px 华文细黑'
    ctx.textAlign = "center"
    ctx.beginPath()
	for(var d=0; d<dataWeather.length; d++) {
		// ctx.moveTo(temp, 350)
		ctx.fillText(dataWeather[d], temp, 300)
		ctx.fillText(dataWeek[d], temp, 330)
		temp+=width
	}
}

function drawWeatherIcon(width, IconCodes) {
    var temp = 40
	var baseIconUrl = 'http://www.heweather.com/weather/images/icon/' //加载天气IOCN
	var imagesObjectArr = new Array()
	for(var p = 0; p < IconCodes.length; p++) {
		imagesObjectArr[p] = new Image()
		imagesObjectArr[p].src = baseIconUrl + IconCodes[p] + '.png'
		imagesObjectArr[p].onload = (function () {
            console.log(imagesObjectArr[p])
			ctx.drawImage(imagesObjectArr[p], temp-25, 380-40, 50, 50)
		})()
        temp += width
	}
}

})

// disable right-click menu
// $(document).bind('contextmenu', function() {
//     return false
// })
