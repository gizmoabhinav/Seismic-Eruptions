//get url params
var mag = getURLParameter("mag");
if(mag == undefined){
	mag = 5;
}
var startyear = getURLParameter("startyear");
if(startyear == undefined){
	startyear = 2009;
}
var startmonth = getURLParameter("startmonth");
if(startmonth == undefined){
	startmonth = 1;
}
var startdate = getURLParameter("startdate");
if(startdate == undefined){
	startdate = 1;
}
var endyear = getURLParameter("endyear");
var endmonth = getURLParameter("endmonth");
var enddate = getURLParameter("enddate");
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

if(endyear == undefined){
	endyear = curr_year;
}
if(endmonth == undefined){
	endmonth = curr_month;
}
if(enddate == undefined){
	enddate = curr_date;
}
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
var depth = new Array();
var maxdepth = 0;
var mindepth =2000;
var circles_added = new MiniSet();
var script = document.createElement('script');
var snd = new Audio("tap.wav"); // buffers automatically when created
var rainbow = new Rainbow();
script.src = 'http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime='+startyear+'-'+startmonth+'-'+startdate+'%2000:00:00&minmagnitude='+mag+'&format=geojson&callback=eqfeed_callback&endtime='+endyear+'-'+endmonth+'-'+enddate+'%2023:59:59&orderby=time-asc';
/* script.onerror = function() {
    alert("The number of earthquakes in the given range of time and magnitude cutoff exceeds the limit of 20,000. Try again with a different parameters");
}​ */
document.getElementsByTagName('body')[0].appendChild(script);
window.eqfeed_callback = function(results) {
	  
	size = results.features.length;
	
	for (var i = 0; i < size; i++){
		circles[i] = L.geoJson(results.features[i], {pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, {radius: results.features[i].properties.mag ,fillColor: "#"+rainbow.colourAt(results.features[i].properties.mag),color: "#000",weight: 1,opacity: 1,fillOpacity: 1});}}).bindPopup("Place: <b>"+results.features[i].properties.place+"</b></br>Magnitude : <b>"+ results.features[i].properties.mag+"</b></br>Time : "+timeConverter(results.features[i].properties.time)+"</br>Depth : "+results.features[i].geometry.coordinates[2]+" km");
		//circles[i].addTo(map);
		time[i] = timeConverter(results.features[i].properties.time);
		stamp[i] = results.features[i].properties.time
		depth[i] = results.features[i].geometry.coordinates[2];
		if(depth[i]>maxdepth)maxdepth=depth[i];
		if(depth[i]<mindepth)mindepth=depth[i];
		// Adding events to the timeline
		//if(i==0)
		//tl.append(TweenLite.delayedCall(0,mapAdder,[i.toString]));
		if(i>0){
			tl.append(TweenLite.delayedCall(20*((results.features[i].properties.time-results.features[i-1].properties.time)/1000000000), mapAdder, [i.toString()]));
		}
	}
	
	$("#info").html("total earthquakes : "+size+"</br>minimum depth : "+mindepth+" km</br>maximum depth : "+maxdepth+" km");
	rainbow = new Rainbow();
	rainbow.setNumberRange(mindepth, maxdepth);
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
	circles[i].setStyle({fillOpacity : 1,fillColor: "#"+rainbow.colourAt(depth[i])});
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
				circles[i].setStyle({fillOpacity : 0.5,fillColor: "#"+rainbow.colourAt(depth[i])});
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