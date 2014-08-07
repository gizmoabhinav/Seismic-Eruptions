var map,mag,startdate,enddate,drawnItems;
// load plate boundaries
var track = new L.KML("plates.kml", {async: true});
//plate controls
function plateToggle(){
	if($("#plates").is(':checked')){
		map.addLayer(track);  // checked
	}
	else{
		map.removeLayer(track);  // unchecked
	}
}
$("#index").on("pageshow",function(event, ui){
$.mobile.loading('show');
map = L.map('map');
map.invalidateSize(true);
var baseLayer3 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});
var baseLayer2 = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {});
var baseLayer1 = L.tileLayer('http://{s}.tiles.mapbox.com/v3/bclc-apec.map-rslgvy56/{z}/{x}/{y}.png', {});
baseLayer1.addTo(map);
map.fitBounds([[50,40],[-20,-40]]);
map.setMaxBounds([[-90,180],[90,-180]]);
//get url params
mag = getURLParameter("mag");
if(mag == undefined){
	mag = 5;
}
startdate = getURLParameter("startdate");
if(startdate == undefined){
	startdate = "2009/1/1";
}
enddate = getURLParameter("enddate");
var speed = 6;
// create timeline
var tl = new TimelineLite({onUpdate:updateSlider});
tl.timeScale(speed);
tl.pause();
var d = new Date();
var curr_year,curr_month,curr_date;
if(enddate == undefined){
	curr_year = d.getFullYear();
	curr_month = d.getMonth()+1;
	curr_date = d.getDate();
	enddate = curr_year+'/'+curr_month+'/'+curr_date;
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
	var time = year+' '+month+' '+date;
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
var script = document.createElement('script');
var snd = new Audio("tap.wav"); // buffers automatically when created
var rainbow = new Rainbow();
script.src = 'http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime='+startdate+'%0000:00:00&minmagnitude='+mag+'&format=geojson&callback=eqfeed_callback&endtime='+enddate+'%0000:00:00&orderby=time-asc';
//script.src = 'values.js';
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
	
	$("#info").html("</br></br>total earthquakes : "+size+"</br>minimum depth : "+mindepth+" km</br>maximum depth : "+maxdepth+" km</br></br></br><div class='ui-body ui-body-a'><p><a href='http://github.com/gizmoabhinav/Seismic-Eruptions'>Link to the project</a></p></div>");
	$("#startdate").html("Start date : "+timeConverter(startdate));
	$("#enddate").html("End date : "+timeConverter(enddate));
	$("#magcutoff").html("Cutoff magnitude : "+mag);
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
			$("#date").html(timeConverter(starttime));
			//tl.seek();
			tl.pause();
			tl.progress(ui.value/(timediff));
		}
	});
	
}
function updateSlider(){
	$("#slider").slider("value", (tl.progress()*timediff));
	$("#date").html(timeConverter((tl.progress()*timediff)+starttime));
}
function mapAdder(i){
	if(!map.hasLayer(circles[i])){
		circles[i].addTo(map);
	}
	circles[i].setStyle({fillOpacity : 0.5,fillColor: "#"+rainbow.colourAt(depth[i])});
	/*if(i>=1){
		circles[i-1].setStyle({fillOpacity : 0.5});
	}*/
	i++;
	while(map.hasLayer(circles[i])){
		map.removeLayer(circles[i]);
		i++;
	}
	$("#time").html(time[i]);
	snd.play();
}
function mapRemover(i){
	if(map.hasLayer(circles[i])){
		map.removeLayer(circles[i]);
	}
}
///////////// Controls /////////////////

//buttons
$('#play').click(function (){
	tl.resume();
});
$('#pause').click(function (){
	tl.pause();
});
$('#speedup').click(function (){
	speed*=1.5;
	tl.timeScale(speed);
});
$('#speeddown').click(function (){
	if(speed>=0.5){
		speed/=2;
		tl.timeScale(speed);
	}
});
$('#changeparams').click(function (){
	tl.pause();
});
$('#editparamscancel').click(function (){
	tl.resume();
});
$('#editparamsenter').click(function (){
	tl.pause();
});
//////////// Controls end //////////////

$(window).load(function(){
	$.mobile.loading('hide');
	setTimeout(function(){ 
    		map.invalidateSize(); 
	}, 1);
	tl.resume();
});

/////////// Drawing Controls ///////////

var Line;
drawnItems = new L.FeatureGroup();
map.on('draw:created', function (e) {
	var type = e.layerType,
	Line = e.layer;
	drawnItems.addLayer(Line);
});
$('#index').click(function(){
	$('#playcontrols').fadeIn();
	$('#slider').fadeIn();
	$('#date').fadeIn();
	setTimeout(function(){ 
		$('#playcontrols').fadeOut();
	}, 5000);
	setTimeout(function(){ 
		$('#slider').fadeOut();
		$('#date').fadeOut();
	}, 12000);
});
$('#playback').hover(function(){
	$('#playcontrols').fadeIn();
	$('#slider').fadeIn();
	$('#date').fadeIn();
	setTimeout(function(){ 
		$('#slider').fadeOut();
		$('#date').fadeOut();
		$('#playcontrols').fadeOut();
	}, 8000);
});
setTimeout(function(){ 
    $('#slider').fadeOut();
	$('#date').fadeOut();
    $('#playcontrols').fadeOut();
}, 10000);
var drawingMode = false;
$('#drawingTool').click(function(){
	if(!drawingMode){
		tl.pause();
		$.mobile.showPageLoadingMsg();
		map.addLayer(drawnItems);
		$('#playback').fadeOut();
		$('#crosssection').fadeIn();
		for (var i = 0; i < size; i++){
			if(!map.hasLayer(circles[i])){
				circles[i].setStyle({fillOpacity : 0.5,fillColor: "#"+rainbow.colourAt(depth[i])});
				circles[i].addTo(map);
			}
		}
		$.mobile.hidePageLoadingMsg();
		drawingMode = true;
	}
});
$('#drawingToolDone').click(function(){
	if(drawingMode){
		$.mobile.showPageLoadingMsg();
		$('#playback').fadeIn();
		$('#crosssection').fadeOut();
		drawnItems.eachLayer(function (layer) {
			drawnItems.removeLayer(layer);
		});
		if(map.hasLayer(drawnItems)){
			map.removeLayer(drawnItems);
		}
		if(map.hasLayer(polygon)){
			map.removeLayer(polygon);
		}
		$.mobile.hidePageLoadingMsg();
		drawingMode = false;
		map.setZoom(2);
	}
});
$('#mapselector').change(function(){
	if(map.hasLayer(baseLayer1)){
		map.removeLayer(baseLayer1);
	}
	if(map.hasLayer(baseLayer2)){
		map.removeLayer(baseLayer2);
	}
	if(map.hasLayer(baseLayer3)){
		map.removeLayer(baseLayer3);
	}
	switch($('#mapselector').val()) {
    case '1':
        baseLayer1.addTo(map);
		if(map.hasLayer(baseLayer2)){
			map.removeLayer(baseLayer2);
		}
		if(map.hasLayer(baseLayer3)){
			map.removeLayer(baseLayer3);
		}
        break;
    case '2':
        baseLayer2.addTo(map);
		if(map.hasLayer(baseLayer3)){
			map.removeLayer(baseLayer3);
		}
		if(map.hasLayer(baseLayer1)){
			map.removeLayer(baseLayer1);
		}
        break;
    case '3':
        baseLayer3.addTo(map);
		if(map.hasLayer(baseLayer2)){
			map.removeLayer(baseLayer2);
		}
		if(map.hasLayer(baseLayer1)){
			map.removeLayer(baseLayer1);
		}
}
});
});
