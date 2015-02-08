//Setup to handle zip code submit.
window.onload = init;
function init() {
  var button = document.getElementById("zipcodeSubmit");
  button.onclick = handleSubmit;
  }
function handleSubmit() {
  var zipTextInput = document.getElementById("zipcode");
  var zipcode = zipTextInput.value;
  var url = "http://opentable.herokuapp.com/api/restaurants?zip="+zipcode+"&callback=updateRestaurantList";
  getRestaurantsNearby(url);
}
//Check if browser supports geolocation API
function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getZipcode);
  } else {
    alert("Sorry, no browser geolocation support");
  }
}

//TODO: Get zip code from lat and long position. Probably just display on Googple map object
function getZipcode(position) {
    var coordinates = position.coords.latitude + ',' + position.coords.longitude;

    var div = document.getElementById("location");
    div.innerHTML = "Your zip code is ";

}


function getRestaurantsNearby(url) {
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
