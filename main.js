const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const API_KEY = '837823cd32b24a911e5f1a92e271709f'
setInterval(() => { //Will be called continuously until the interval is cleared
    const time = new Date(); //Date is a class


    //Grab correct values for time and date
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    //Format the time. Utilize the indexes in the arrays on lines 10-11
    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat)
    + ':' +(minutes < 10? '0' +minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span`;

    //Format the date. Utilize the indexes in the arrays on lines 10-11
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
 }, 1000); //Call this function every one second

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`)
        .then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data){
    let {forecast} = data.current.weather[0]['main'];
    let {humidity, temp} = data.current;
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML= data.lat + 'N ' + data.lon + 'E'
    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
        <div>Forecast</div>
        <div>${forecast}</div>
     </div>
     <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
     </div>
     <div class="weather-item">
        <div>Current Temperature</div>
        <div>${Math.floor(temp)}&#176;F</div>
     </div>`;
        let otherDayForecast = ""
     data.daily.forEach((day, idx) =>{
         if (idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">Saturday</div>
                <div class="temp">Low - ${Math.floor(day.temp.night)} &#176;F</div>
                <div class="temp">High - ${Math.floor(day.temp.day)} &#176;F</div>
            </div>`
            
         }else{
            otherDayForecast +=
                `<div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Low - ${Math.floor(day.temp.night)} &#176;F</div>
                <div class="temp">High - ${Math.floor(day.temp.day)} &#176;F</div>
                </div>`  
        }
     })
     weatherForecastEl.innerHTML = otherDayForecast;
}


