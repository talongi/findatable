
//Setup to handle zip code submit.
window.onload = init;
function init() {
  var button = document.getElementById("zipcodeSubmit");
  button.onclick = handleSubmit;
  getMyLocation();
  }
function handleSubmit() {
  var zipTextInput = document.getElementById("zipcode");
  var zipcode = zipTextInput.value;
  getRestaurantsNearby(zipcode);
}
//Check if browser supports geolocation API
function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showMap);
  } else {
    alert("Sorry, no browser geolocation support");
  }
}

var map;

function showMap(position) {
  var googleLatAndLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var mapOptions = {
    zoom: 15,
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, mapOptions);
  var title = "Your Location";
  var content = "You are here!";
  //addMarker(map, googleLatAndLong, title, content);
  getZipCode(googleLatAndLong);
}

function addMarker(map, latlong, title, content) {
  var markerOptions = {
    position: latlong,
    map: map,
    title: title,
    clickable: true
  };
  var marker = new google.maps.Marker(markerOptions);

  var infoWindowOptions = {
    content: content,
    position: latlong
  };

  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map);
  });
}

//Get zip code from lat and long position. Displays best guess location on map.
function getZipCode(coords) {
    var infowindow = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder();
    var div = document.getElementById("location");

    //Ping Google geocode API with lat and long for reverse lookup
    geocoder.geocode({'latLng': coords}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK){
        if (results[0]) {
          map.setZoom(15);
          marker = new google.maps.Marker({
            position: coords,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);

          //Look for zip code in results array
          var zip = '';
          for (var i=0, len=results[0].address_components.length; i<len; i++) {
            var ac = results[0].address_components[i];
            if (ac.types.indexOf('postal_code') >= 0) zip = ac.long_name;
          }
          if (zip != '') {
            div.innerHTML ='<p>We guess your zip code is ' + zip + "</p>";
            getRestaurantsNearby(zip);
          }
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });

}


function getRestaurantsNearby(zipcode) {
  var url = "http://opentable.herokuapp.com/api/restaurants?zip="+zipcode+"&callback=updateRestaurantList";
  var newScriptElement = document.createElement("script");
  newScriptElement.setAttribute("src", url);
  newScriptElement.setAttribute("id", "jsonp");
  var oldScriptElement = document.getElementById("jsonp");
  var head = document.getElementsByTagName("head")[0];
  if (oldScriptElement == null) {
    head.appendChild(newScriptElement);
  } else {
    head.replaceChild(newScriptElement, oldScriptElement);
  }

}


function updateRestaurantList(restaurants) {
  var restaurantDiv = document.getElementById("restaurants");
  if (restaurants.restaurants.length < 1) {
    restaurantDiv.innerHTML = "Sorry, no restaurants are using Open Table in your area. :("
  }
  for (var i = 0; i < restaurants.restaurants.length; i++) {
    var restaurant = restaurants.restaurants[i];
    var div = document.createElement("div");
    div.setAttribute("class","restaurantItem");
    div.innerHTML = restaurant.name;
    restaurantDiv.appendChild(div);
  }
}
