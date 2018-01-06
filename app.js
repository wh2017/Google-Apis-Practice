var map;
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
  console.log(1234);
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
  // 地图上显示点
  initLocations.forEach(function(item) {
    console.log(123);
    new google.maps.Marker({ // 使用google.maps.Marker创建一个新的标记实例
      position: item.location, // 标记显示的位置
      map: map, // 标记显示的地图
      title: item.title  // 标记的名称，鼠标悬浮在marker上使显示
    });
    new google.maps.InfoWindow({
      content: 'this is 12a infowindow'
    });
    item.addListener('click', function() { // 信息窗体在点击marker时打开,
      infowindow.open(map, item); // 窗口打开所在的地图和位置
    });
  })
  // var marker = 
  // 创建信息窗口,信息窗口不会自动打开，需告诉在何时什么位置打开
  // var infowindow = new google.maps.InfoWindow({
  //   content: 'this is a infowindow'
  // });
  // marker.addListener('click', function() { // 信息窗体在点击marker时打开,
  //   infowindow.open(map, marker); // 窗口打开所在的地图和位置
  // });
}

var viewModel = function() {
  var self = this;
  console.log(123);
  initMap();
  self.inputValue = ko.observable();
  self.searchAddress = function() {
    console.log('click');
  }
};

ko.applyBindings(new viewModel());