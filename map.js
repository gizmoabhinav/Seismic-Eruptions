var map = L.map('map').setView([50, -50], 2);
	var track = new L.KML("plates.kml", {async: true});
   // track.on("loaded", function(e) { map.fitBounds(e.target.getBounds()); });
	map.addLayer(track);
    
	map.invalidateSize(false);
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

	// Initialize the legend control and add it to the map
	//var legendControl = new L.Control.Legend();

	//legendControl.addTo(map);

	var layerControl = new L.Control.Layers({
		'MapQuest Satellite': baseLayer,
		'PRCC Earthquake Risk Zones': prccEarthquakesLayer,
		'OSM map' : osmmapLayer,
		'Cloudmade' : baseLayer2
	});

	layerControl.addTo(map);
	