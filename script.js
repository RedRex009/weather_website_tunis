/* insertion  time /date*/
$(document).ready(function() {
    $('.js-example-basic-single').select2({
        placeholder: 'Choisir une ville'
    });
    $('.js-example-basic-single').on('select2:select', function (e) {
    var data = e.params.data;
    
    console.log(data.id);
    getWeatherDataById(data.id);
    });
});

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Dimanche' , 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const months = ['Jan', 'Fev', 'Mar', 'Afr', 'May', 'Jun', 'Jul', 'out', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='0b4c1e581eded8cff76f2e961bede4f6';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    timeEl.innerHTML = (hour < 10? '0'+hour : hour) + ':' + (minutes < 10? '0'+minutes: minutes)

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]



}, 1000);



function getWeatherDataById (idVille) {

        fetch(`https://api.openweathermap.org/data/2.5/weather?id=${idVille}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        //console.log(data)
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&units=metric&lang=fr&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })
        
        
    })
}



getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidité</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>pression</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Vitesse du vent</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>lever du soleil</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Le coucher du soleil</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Nuit - ${Math.round(day.temp.night)}&#176;C</div>
                <div class="temp">Jour -  ${Math.round(day.temp.day)}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Nuit - ${Math.round(day.temp.night)}&#176;C</div>
                <div class="temp">Jour - ${Math.round(day.temp.day)}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}
