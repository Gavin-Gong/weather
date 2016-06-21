// get and store data by ajax
var apiURL = 'http://apis.baidu.com/heweather/weather/free?city='
    // var apiURL = 'https://api.heweather.com/x3/weather?cityid='
    // 设置星期排序数组
var Data = {}
convertWeekList()

function convertWeekList(weeklist) {
    var weeklist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    var date = new Date()
    var nowWeek = date.getDay() + 1
    var arr_1 = weeklist.slice(0, nowWeek)
    var arr_2 = weeklist.slice(nowWeek)
    Data.WeekList = arr_2.concat(arr_1)
}


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
                var now = responseData.now
                console.log(responseData)

                var maxTempList = []
                var minTempList = []
                var dayWeatherList = []
                var nightWeatherList = []
                var dayWeatherCodes = []
                var nightWeatherCodes = []
                var air = aqi.city.aqi + '|' + aqi.city.qlty
                var nowTemp = now.tmp
                var nowWeather = now.cond.txt
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
                Data.nowTemp = nowTemp
                Data.nowWeather = nowWeather
                Data.air = air
                console.log(Data)
            }
        }
    })
})
$('.search-bar').trigger('focus')


// canvas
$(document).ajaxSuccess(function() {
    // tempertature line
    fillWeather(Data)
    drawWeatherCanvas('templine', Data)


})

function drawWeatherCanvas(canvasId, Data) {
    //const
    var STARTx = 40

    var templine = document.getElementById('templine')
    templine.width = window.innerWidth
    templine.height = 500
    var intervalWidth = Math.floor((templine.width - 2 * STARTx) / 6) // 点与点之间的距离
    console.log(intervalWidth)
    var ctx = templine.getContext('2d')
    var intervalWidth_1 = Math.floor((templine.width - 2 * STARTx) / 6) // why not same as intervalWidth?
    console.log(intervalWidth_1)


    // canvas style
    ctx.strokeStyle = '#eee'
    ctx.lineWidth = 2

    if (templine.getContext) {
        drawUpperLine(Data.maxTempList)

        drawUnderLine(Data.minTempList)

        darwUpperDots(Data.maxTempList)

        drawUnderDots(Data.minTempList)

        drawWeatherText(Data.dayWeatherList, Data.WeekList)

        drawWeatherIcon(Data.dayWeatherCodes)

    }

    function drawUpperLine(data) {
        var temp = STARTx
        ctx.beginPath()
        ctx.moveTo(40, data[0] * 4)
        for (var g = 0; g < data.length; g++) {
            ctx.lineTo(temp, data[g] * 4)
            ctx.fillStyle = '#fff'
            ctx.font = '12px'
            ctx.textAlign = "center"
            ctx.fillText(data[g]+ '°', temp, data[g] * 4 - 15)
            temp += intervalWidth
        }
        ctx.stroke()
    }

    function drawUnderLine(data) {
        var temp = STARTx
        ctx.beginPath()
        ctx.moveTo(40, data[0] * 4 + 100)
        for (var g = 0; g < data.length; g++) {
            ctx.lineTo(temp, data[g] * 4 + 100)
            ctx.fillStyle = '#fff'
            ctx.font = '12px'
            ctx.textAlign = "center"
            ctx.fillText(data[g]+ '°', temp, data[g] * 4 + 25 + 100)
            temp += intervalWidth
        }
        ctx.stroke()
    }

    function darwUpperDots(data) {
        var temp = STARTx
        ctx.beginPath()
        for (var k = 0; k < data.length; k++) {
            ctx.moveTo(temp, data[k] * 4)
            ctx.arc(temp, data[k] * 4, 5, 0, 2 * Math.PI)
            temp += intervalWidth
        }
        ctx.fill()
    }

    function drawUnderDots(data) {
        var temp = STARTx
        ctx.beginPath()
        for (var k = 0; k < data.length; k++) {
            ctx.moveTo(temp, data[k] * 4 + 100)
            ctx.arc(temp, data[k] * 4 + 100, 5, 0, 2 * Math.PI)
            temp += intervalWidth
        }
        ctx.fill()
    }

    function drawWeatherText(dataWeather, dataWeek) {
        var temp = STARTx
        ctx.fillStyle = '#fff'
        ctx.font = '12px 华文细黑'
        ctx.textAlign = "center"
        ctx.beginPath()
        for (var d = 0; d < dataWeather.length; d++) {
            ctx.fillText(dataWeek[d], temp, 300)
            ctx.fillText(dataWeather[d], temp, 330)
            temp += intervalWidth
        }
    }

    function drawWeatherIcon(IconCodes) {
        var temp = STARTx + 10
        var baseIconUrl = 'http://www.heweather.com/weather/images/icon/' //加载天气IOCN
        var imagesObjectArr = new Array()
        for (var p = 0; p < IconCodes.length; p++) {
            imagesObjectArr[p] = new Image()
            imagesObjectArr[p].src = baseIconUrl + IconCodes[p] + '.png'
            imagesObjectArr[p].onload = (function() {
                console.log(imagesObjectArr[p])
                // ctx.drawImage(imagesObjectArr[p], temp * 4 - 110, 1130, 100, 100)
                ctx.drawImage(imagesObjectArr[p], temp, 1130, 100, 100)
            })()
            temp += (intervalWidth + 145)
        }
    }
}




function fillWeather(WeatherData) {
    var tempEle = $('.temperature')
    var weatherEle = $('.weather')
    var airEle = $('.air')
    tempEle.text(WeatherData.nowTemp + '°')
    console.log(WeatherData.nowTemp)
    weatherEle.text(WeatherData.nowWeather)
    airEle.text(WeatherData.air) 
    console.log(WeatherData.nowWeather)
}
