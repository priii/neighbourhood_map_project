var map;
var markers =[];
// restaurant details

var restaurants = [
  { name: "Orean's Hummus",
    caption: ": Cozy Mediterranean restaurant",
    location: {lat: 37.3948, lng: -122.0787}
  },
  {
    name:"Taqueria La Espuela",
    caption:" : Mexican staples",
     location: {lat: 37.3929, lng: -122.0803}
  },
 {
   name: "Niji Sushi",
   caption:": Informal, bustling Japanese eatery",
   location: {lat: 37.3922, lng: -122.0792}
 },
 {
   name:"Crepevine",
   caption:": sweet & savory crêpes.",
   location: {lat: 37.3925, lng: -122.0800}
 },
 {
   name:"Xanh Restaurant",
   caption:": High-end Vietnamese dishes",
   location: {lat: 37.3949, lng: -122.0786}
    }
];

// // this code is taken from  Google Maps API Course on Udacity
function initMap(){
  //Constructor to create a new map.
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 37.386051, lng: -122.083855},
    zoom: 13
  });

  // Style the markers a bit. This will be our listing marker icon.
      var defaultIcon = makeMarkerIcon('0091ff');

      // Create a "highlighted location" marker color for when the user
      // mouses over the marker.
      var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the location array tocreate an array of markers on initialize.

  for(var i=0;i< restaurants.length; i++){
    // get the position from the location array.
    var position = restaurants[i].location;
    var name = restaurants[i].name;
    //create a marker per location, and put into markers array.

    var marker = new google.maps.Marker({
      map: map,
      position: position,
      name: name,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    var largeInfowindow = new google.maps.InfoWindow();

  var bounds = new google.maps.LatLngBounds();
  restaurants[i].marker = marker;
  // push the marker
  markers.push(marker);

  marker.addListener('click', function(){
    populateInfoWindow(this, largeInfowindow);
    });
  bounds.extend(markers[i].position);
  // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
}
//extending the boundaries.
map.fitBounds(bounds);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.name + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
              if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                  nearStreetViewLocation, marker.position);
                  infowindow.setContent('<div>' + marker.name + '</div><div id="pano"></div>');
                  var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                      heading: heading,
                      pitch: 30
                    }
                  };
                var panorama = new google.maps.StreetViewPanorama(
                  document.getElementById('pano'), panoramaOptions);
              } else {
                infowindow.setContent('<div>' + marker.name + '</div>' +
                  '<div>No Street View Found</div>');
              }
            }
            // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      }
      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).

      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }


// view model
function vm() {
  var self = this;
  self.query =  ko.observable('');
  //self.locations = ko.observableArray(restaurants);

  //search function
  // followed the below demo for search method
  // http://opensoul.org/2011/06/23/live-search-with-knockoutjs/

  self.clicked = ko.computed(function(){
        var query = self.query().toLowerCase();

        return ko.utils.arrayFilter(restaurants, function(restaurant){
        return restaurant.name.toLowerCase().indexOf(query)>=0;
        //var match = stringStartsWith(restaurant.name.toLowerCase(), query);
        //restaurant.marker.setVisible(match);
        //return match;
    });

  });

  self.showInfoWindow = function(loc) {
    google.maps.event.trigger(loc.marker, 'click');
  };
}
ko.applyBindings(new vm);
