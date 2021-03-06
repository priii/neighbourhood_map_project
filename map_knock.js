var map,
bounds,
markers =[];
//These are the best restaurants in Mountain View that will be shown to the user.
var locations = [
  {title: 'orens hummus ', location: {lat: 37.3948, lng: -122.0787}},
  {title: 'Taqueria La Espuela ', location: {lat: 37.3929, lng: -122.0803}},
  {title: 'Niji Sushi ', location: {lat: 37.3922, lng: -122.0792}},
  {title: 'Crepevine ', location: {lat: 37.3925, lng: -122.0800}},
  {title: 'Xanh Restaurant ', location: {lat: 37.3949, lng: -122.0786}}
];

// Google Map initialization
function initMap(){
  //Constructor creates a new map- only center and zoom are required.
   map = new google.maps.Map(document.getElementById('map'),{
     center: {lat: 37.386051, lng: -122.083855},
     zoom: 13
     });
     //knockout initializing
     var view_Model = new viewModel();
     ko.applyBindings(view_Model);
   }

var viewModel = function(){
  var self = this;
  var largeInfoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
   // this code is taken from  Google Maps API Course on Udacity
   // The following group uses the location array tocreate an array of markers on initialize.
      self.locations = ko.observableArray(locations);

      self.locations().forEach(function(location) {
          var marker = new google.maps.Marker({
        map: map,
        position: location.location,
        title: location.title,
        animation: google.maps.Animation.DROP

        });

      location.marker = marker;
      // push the marker to our array of markers.
      markers.push(marker);
      //  extend the boundaries of the map for each marker
      bounds.extend(marker.position);
      // create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function(){
        populateInfoWindow(this, largeInfoWindow);
      });
  });

  map.fitBounds(bounds);
  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }

};
