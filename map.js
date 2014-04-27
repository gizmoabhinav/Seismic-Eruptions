//load map
var speed = 1;
var map = L.map('map').setView([30, -0], 2);
map.invalidateSize(false);
// create timeline
var tl = new TimelineLite({onUpdate:updateSlider});
$("#slider").slider({
		value: 0,
		range: "min",
		min: 0,
		max: 315670898300,
		slide: function ( event, ui ) {
			$("#values").html(timeConverter(ui.value+1072921310700));
			//tl.seek();
			tl.pause();
			tl.progress(ui.value/315670898300);
		}
	});
tl.pause();
function updateSlider()
	{
		$("#slider").slider("value", (tl.progress()*315670898300));
		$("#values").html(timeConverter((tl.progress()*315670898300)+1072921310700));
	}
//time
function timeConverter(UNIX_timestamp){
 var a = new Date(UNIX_timestamp);
 var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = year+' '+month+' '+date+'  '+hour+':'+min+':'+sec ;
     return time;
 }
// load data from usgs
var size = 0;
var circles = new Array();
var time = new Array();
var stamp = new Array();
var script = document.createElement('script');
var snd = new Audio("tap.wav"); // buffers automatically when created

	script.src = 'values.js';
	document.getElementsByTagName('body')[0].appendChild(script);
	window.eqfeed_callback = function(results) {
	  
		size = results.features.length;
			for (var i = 0; i < 19774; i++){
				circles[i] = L.geoJson(results.features[i], {pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, {radius: results.features[i].properties.mag ,fillColor: "#ff0000",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8});}}).bindPopup("Place: <b>"+results.features[i].properties.place+"</b></br>Magnitude : <b>"+ results.features[i].properties.mag+"</b>");
				time[i] = timeConverter(results.features[i].properties.time);
				stamp[i] = results.features[i].properties.time
				// Adding events to the timeline
				//if(i==0)
				//tl.append(TweenLite.delayedCall(0,mapAdder,[i.toString]));
				if(i>0)
				tl.append(TweenLite.delayedCall(20*((results.features[i].properties.time-results.features[i-1].properties.time)/1000000000), mapAdder, [i.toString()]));
				
				//depths[i] = results.features[i].geometry.coordinates[2];
			}
			
			
			
	}
	function mapAdder(i){
		if(!map.hasLayer(circles[i]))
		map.addLayer(circles[i]);
		if(i>=20)
		mapRemover(i-20);
		
		$("#time").html(time[i]);
		snd.play();
		/*for(var j= Math.floor(tl.progress()*100)+1;j<19774;j++){
				if(map.hasLayer(circles[j])){
					map.removeLayer(circles[j]);
				}
			}*/
	}
	function mapRemover(i){
		if(map.hasLayer(circles[i]))
		map.removeLayer(circles[i]);
	}
// load plate boundaries
var track = new L.KML("plates.kml", {async: true});


///////////// Controls /////////////////

//plate controls   
   $('#plates').click(function () {
   if($("#plates").is(':checked'))
    map.addLayer(track);  // checked
	else
    map.removeLayer(track);  // unchecked
    });
//buttons
	function Play(){
		tl.resume();
	}
	function Pause(){
		tl.pause();
	}
	function SpeedUp(){
			speed*=1.05;
			tl.timeScale(speed);
	}
	function SpeedDown(){
		if(speed>=0.5)
			speed/=2;
			tl.timeScale(speed);
	}

//////////// Controls end //////////////

/////////////// Layers ////////////////

	var osmmapLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
	});
	var baseLayer2 = L.tileLayer('http://{s}.tile.cloudmade.com/82e1a1bab27244f0ab6a3dd1770f7d11/999/256/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	});
	var baseLayer = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>'
	});
	var prccEarthquakesLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/bclc-apec.map-rslgvy56/{z}/{x}/{y}.png', {
		attribution: 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
	});
	prccEarthquakesLayer.addTo(map);

	var layerControl = new L.Control.Layers({
		'MapQuest Satellite': baseLayer,
		'PRCC Earthquake Risk Zones': prccEarthquakesLayer,
		'OSM map' : osmmapLayer,
		'Cloudmade' : baseLayer2
	});

	layerControl.addTo(map);
	
	