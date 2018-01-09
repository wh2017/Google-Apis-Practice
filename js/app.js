var map, defaultIcon, defaultIcon, largeInfowindow;
var markers = [];
var initLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// 初始化的js函数加载地图
function initMap() {
  largeInfowindow = new google.maps.InfoWindow();
  defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
  var timeAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('search-within-text'));
  timeAutocomplete.bindTo('bounds', map);
  // 地图上显示点
  initLocations.forEach(function(item, index) {
    var marker = new google.maps.Marker({ // 使用google.maps.Marker创建一个新的标记实例
      position: item.location, // 标记显示的位置
      map: map, // 标记显示的地图
      title: item.title,
      icon: defaultIcon
    });
    markers.push(marker);
    marker.addListener('click', function() {
      marker.setIcon(highlightedIcon);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      // 2 秒钟后停止动画
      window.setTimeout(function(){
        marker.setAnimation(null);
      }, 2000);
      populateInfoWindow(this, largeInfowindow);
    });
  })
  
  // 打开信息窗体，同时关闭其余已经打开的信息窗体
  function populateInfoWindow(marker, infowindow) {
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.title + '&sort=newest&api-key=f4f76e351f2f4625a6e9190c3c49d40d';
    $.getJSON(url, function(data) {
      var items = [];
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        if (infowindow.marker) {
          infowindow.marker.setIcon(defaultIcon);
        }
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          if (infowindow.marker) {
            infowindow.marker.setIcon(defaultIcon);
          }
          infowindow.marker = null;
        });
        infowindow.setContent('<li class=article><a href="' + data.response.docs[0].web_url + '" target=_blank>' + data.response.docs[0].headline.main + '</a></li>');
        infowindow.open(map, marker);
      }
    })
    .error(function(error) {
      window.alert(error.responseText || 'We did not find any article matching this marker!');
    });
  }

  // 更改marker颜色
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
}

var viewModel = function() {
  var self = this;
  var hasMarker = true;
  self.inputValue = ko.observable();
  self.filterValue = ko.observable();
  self.filterArr = ko.computed(function() {
    if (!self.filterValue()) {
      return initLocations;
    } else {
      return initLocations.filter(function(item) {
        return item.title.toLowerCase().indexOf(self.filterValue().toLowerCase()) != -1;
      });
    }
  });
  // 点击筛选器或者输入地点筛选
  self.searchAddress = function(event) {
    var address = event.title || self.inputValue();
    if (!address) {
      window.alert('You must enter an area, or address.');
    } else {
      hasMarker = false;
      markers.forEach(function(item, index) {
        if(item.title.toLowerCase().indexOf(address.toLowerCase()) < 0) {
          markers[index].setMap(null)
        } else {
          hasMarker = true;
          markers[index].setAnimation(google.maps.Animation.BOUNCE);
          // 2 秒钟后停止动画
          window.setTimeout(function(){
            markers[index].setAnimation(null);
          }, 2000);
          markers[index].setMap(map);
          if(event.title) {
            largeInfowindow.setContent(event.title);
            largeInfowindow.open(map, markers[index]);
          }
        }
      })
    }
    // 找不到地点时
    if (!hasMarker) {
      window.alert('We did not find any places matching that search in initLocations!');
      initMap();
    }
  }

  // 输入筛选的地点时
  self.filterAddress = function() {
    if (self.filterValue()) {
      markers.forEach(function(item, index) {
        if(item.title.toLowerCase().indexOf(self.filterValue().toLowerCase()) < 0) {
          markers[index].setMap(null)
        } else {
          markers[index].setAnimation(google.maps.Animation.BOUNCE);
          // 2 秒钟后停止动画
          window.setTimeout(function(){
            markers[index].setAnimation(null);
          }, 2000);
          markers[index].setMap(map);
        }
      })
    }
  }
}
ko.applyBindings(new viewModel());