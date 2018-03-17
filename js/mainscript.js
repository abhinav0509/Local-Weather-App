var latitude, longitude;
 var tempUnit = "C";
 var tempData = 0;

  var weatherIcons = {
   "clear-day": Skycons.CLEAR_DAY,
   "clear-night": Skycons.CLEAR_NIGHT,
   "rain": Skycons.RAIN,
   "sleet": Skycons.SLEET,
   "wind": Skycons.WIND,
   "fog": Skycons.FOG,
   "cloudy": Skycons.CLOUDY,
   "partly-cloudy-day": Skycons.PARTLY_CLOUDY_DAY,
   "partly-cloudy-night": Skycons.PARTLY_CLOUDY_NIGHT,
   "hail": null,
   "thunderstorm": null,
   "tornado": null
  };


$("#tempinfo").on('click',function() {
  //console.log("inside function")
  var tempInFa = 0;
  if (tempUnit === "C") {
   tempUnit = "F";
   tempInFa = Math.round((tempData * 9 / 5) + 32);
   $("#tempinfo").html(tempInFa + "&deg; " + tempUnit);

  } else if (tempUnit === "F") {
   tempUnit = "C"
   $("#tempinfo").html(tempData + "&deg; " + tempUnit);
  }

 });


  function reverseGeoCoding() {
   //console.log("latitude:" + latitude);

   $.ajax({

     url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&result_type=locality&key=AIzaSyBVFMuvvXzd_ArNXYbmIBXb0urigEuCIHM"

    })
    .done(function(data) {
     if (data.status === "OK") {
      $("#location-name").text(data.results[0].formatted_address);
     }
    })
    .fail(function() {
     $("#location-name").text("Accept it you are not on this planet!Location Unknown");
    })

  }

  function getWeatherData() {
   var url = "https://api.darksky.net/forecast/84de97c3c1652da3c8241584a0bee191/" + latitude + "," + longitude + "?callback=?&units=si"
   //console.log("latitude:" + latitude);
   //console.log(urlw);
   $.getJSON(url, function(response) {
    console.log(response);
    console.log(response.timezone);
  tempData = Math.round(response.currently.temperature);
   $("#tempinfo").html(tempData + "&deg; " + tempUnit);
    $("#summary").text(response.currently.summary);
    $("#date").text(new Date().toLocaleString());
    $("#humidity").text(response.currently.humidity * 100 + " %");
    $("#pressure").text(response.currently.pressure + " hPa");
    $("#windspeed").text(response.currently.windSpeed + " m/s");
    $("#visibility").text(response.currently.visibility + " Km");

    //$("#icon").text(response.currently.icon);
    if (weatherIcons.hasOwnProperty(response.currently.icon) && weatherIcons[response.currently.icon] !== null) {
     skycons = new Skycons({
      color: "rgb(255,255,255)"

     });
     skycons.add("sky-cons", weatherIcons[response.currently.icon]);
     skycons.play();
    }



   }, 'jsonp');

   $(".loading-icon").removeClass();


  }

  $(document).ready(function() {

   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
     latitude = position.coords.latitude;
     longitude = position.coords.longitude;
     reverseGeoCoding();
     getWeatherData();

    });

   } else {
    $("#location-name").text("Hello Alien!,We are unable to trace your location ");
   }


  });
