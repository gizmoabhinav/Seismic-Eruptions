//load map
var speed = 6;
var map = L.map('map').setView([30, -0], 2);
map.invalidateSize(false);
map.on('contextmenu', function(e) {
    alert(e.latlng);
});
// create timeline
var tl = new TimelineLite({onUpdate:updateSlider});
tl.timeScale(speed);
tl.pause();
var d = new Date();
var curr_year = d.getFullYear();
var curr_month = d.getMonth()+1;
var curr_date = d.getDate();

//time stamp conversion
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
// load data from usgs and populate timeline accordingly
var size = 0;
var timediff = 0;
var starttime = 0;
var circles = new Array();
var time = new Array();
var stamp = new Array();
var magnitude = new Array();
var maxmag = 0;
var minmag =11;
var circles_added = new MiniSet();
var script = document.createElement('script');
var snd = new Audio("tap.wav"); // buffers automatically when created
var rainbow = new Rainbow();

script.src = 'http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime=2013-1-1%2000:00:00&minmagnitude=5&format=geojson&callback=eqfeed_callback&endtime='+curr_year+'-'+curr_month+'-'+curr_date+'%2023:59:59&orderby=time-asc';
document.getElementsByTagName('body')[0].appendChild(script);
window.eqfeed_callback = function(results) {
	  
	size = results.features.length;
	for (var i = 0; i < size; i++){
		circles[i] = L.geoJson(results.features[i], {pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, {radius: results.features[i].properties.mag ,fillColor: "#"+rainbow.colourAt(results.features[i].properties.mag),color: "#000",weight: 1,opacity: 1,fillOpacity: 1});}}).bindPopup("Place: <b>"+results.features[i].properties.place+"</b></br>Magnitude : <b>"+ results.features[i].properties.mag+"</b></br>Time : "+timeConverter(results.features[i].properties.time));
		//circles[i].addTo(map);
		time[i] = timeConverter(results.features[i].properties.time);
		stamp[i] = results.features[i].properties.time
		magnitude[i] = results.features[i].properties.mag;
		if(magnitude[i]>maxmag)maxmag=magnitude[i];
		if(magnitude[i]<minmag)minmag=magnitude[i];
		// Adding events to the timeline
		//if(i==0)
		//tl.append(TweenLite.delayedCall(0,mapAdder,[i.toString]));
		if(i>0){
			tl.append(TweenLite.delayedCall(20*((results.features[i].properties.time-results.features[i-1].properties.time)/1000000000), mapAdder, [i.toString()]));
		}
	}
	rainbow = new Rainbow();
	rainbow.setNumberRange(minmag, maxmag);
	timediff = results.features[size-1].properties.time-results.features[0].properties.time;
	starttime = results.features[0].properties.time;
	$("#slider").slider({
		value: 0,
		range: "min",
		min: 0,
		max: timediff,
		slide: function ( event, ui ) {
			$("#values").html(timeConverter(starttime));
			//tl.seek();
			tl.pause();
			tl.progress(ui.value/(timediff));
		}
	});
	
}
function updateSlider(){
	$("#slider").slider("value", (tl.progress()*timediff));
	$("#values").html(timeConverter((tl.progress()*timediff)+starttime));
}
function mapAdder(i){
	if(!map.hasLayer(circles[i])){
		circles[i].addTo(map);
		circles_added.add(i);
	}
	circles[i].setStyle({fillOpacity : 1,fillColor: "#"+rainbow.colourAt(magnitude[i])});
	if(i>=1){
		circles[i-1].setStyle({fillOpacity : 0.5});
	}
	if(i>=100){
		mapRemover(i-100);
	}
	circles_added.each(function(value) {
		if(value>i){
			mapRemover(value);
		}
	});
	$("#time").html(time[i]);
	snd.play();
}
function mapRemover(i){
	if(map.hasLayer(circles[i])){
		map.removeLayer(circles[i]);
		circles_added.remove(i);
	}
}
// load plate boundaries
var track = new L.KML("plates.kml", {async: true});


///////////// Controls /////////////////

//plate controls   
$('#plates').click(function () {
	if($("#plates").is(':checked')){
		map.addLayer(track);  // checked
	}
	else{
		map.removeLayer(track);  // unchecked
	}
});
//show all events
$('#all_events').click(function () {
	$('#overlay').fadeIn();
	if($("#all_events").is(':checked')){
		$("#slider").slider({ disabled: true });
		document.getElementById("play").disabled = true;
		document.getElementById("pause").disabled = true;
		document.getElementById("speedup").disabled = true;
		document.getElementById("speeddown").disabled = true;
		tl.pause();
		//tl.progress(1);
		for (var i = 0; i < size; i++){
			if(!map.hasLayer(circles[i])){
				circles[i].addTo(map);
				circles_added.add(i);
			}
		}
		$('#overlay').fadeOut();
	}
	else{
		tl.progress(0);
		tl.resume();
		//tl.progress(0);
		$("#slider").slider({ disabled: false });
		document.getElementById("play").disabled = false;
		document.getElementById("pause").disabled = false;
		document.getElementById("speedup").disabled = false;
		document.getElementById("speeddown").disabled = false;
		$('#overlay').fadeOut();
	}
});
//buttons
function Play(){
	tl.resume();
}
function Pause(){
	tl.pause();
}
function SpeedUp(){
	speed*=1.5;
	tl.timeScale(speed);
}
function SpeedDown(){
	if(speed>=0.5){
		speed/=2;
		tl.timeScale(speed);
	}
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
    attribution: 'Map data &copy; MapQuest, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>'
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
////////////// Loading data gif //////////////////////
$(window).load(function(){
	$('#overlay').fadeOut();
	$('#playback').fadeIn();
	tl.resume();
});