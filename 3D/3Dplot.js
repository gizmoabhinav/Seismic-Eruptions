var rainbow = new Rainbow();
rainbow.setSpectrum('#A52A2A', '#FF0000', '#800080', '#FF00FF', "#2f9898", "#266fc1", "#0000ff", "#00FFFF", "#50f950", "#FFFF00");
var sphereParent = new THREE.Object3D();
var radius = new Array();
var latVal = new Array();
var lonVal = new Array();
var colors = new Array();
var depths = new Array();
var d = new Date();
var curr_year = d.getFullYear();
var curr_month = d.getMonth()+1;
var curr_date = d.getDate();
var year = getURLParameter("y");
var month = getURLParameter("m");
var date = getURLParameter("d");
var magnitude = getURLParameter("mag");
var script = document.createElement('script');
script.src = 'http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime='+year+'-'+month+'-'+date+'%2000:00:00&minmagnitude='+magnitude+'&format=geojson&callback=eqfeed_callback&endtime='+curr_year+'-'+curr_month+'-'+curr_date+'%2023:59:59&orderby=time-asc&minlatitude='+Math.min(getURLParameter("y1"),getURLParameter("y2"),getURLParameter("y3"),getURLParameter("y4"))+'&maxlatitude='+Math.max(getURLParameter("y1"),getURLParameter("y2"),getURLParameter("y3"),getURLParameter("y4"))+'&minlongitude='+Math.min(getURLParameter("x1"),getURLParameter("x2"),getURLParameter("x3"),getURLParameter("x4"))+'&maxlongitude='+Math.max(getURLParameter("x1"),getURLParameter("x2"),getURLParameter("x3"),getURLParameter("x4"));
document.getElementsByTagName('body')[0].appendChild(script);
var count = 0;
var max = 0;
var size;
window.eqfeed_callback = function(results) {
	size = results.features.length;
	for (var i = 0; i < size; i++){
		if(rect(convertCoordinatesx(results.features[i].geometry.coordinates[0]),convertCoordinatesy(results.features[i].geometry.coordinates[1]))){
			count++;
			if(results.features[i].geometry.coordinates[2]>max)max=results.features[i].geometry.coordinates[2];
			radius[i] = 0.0025*Math.pow(2,results.features[i].properties.mag-magnitude+1);
			latVal[i] = results.features[i].geometry.coordinates[0];
			lonVal[i] = results.features[i].geometry.coordinates[1];
			depths[i] = results.features[i].geometry.coordinates[2];
		}
	}
	alert("earthquake count : "+count);
	rainbow.setNumberRange(0, max);
	for(var i=0;i<size;i++){
		var sphereGeometry = new THREE.SphereGeometry( radius[i], 2, 2 );
		var sphereMaterial = new THREE.MeshBasicMaterial( { color: parseInt('0x'+rainbow.colourAt(results.features[i].geometry.coordinates[2])) , overdraw: false } );
		var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		sphere.position.set(convertCoordinatesx(latVal[i])-leftTileLimit-2,0.5-(depths[i]/1000),convertCoordinatesy(lonVal[i])-topTileLimit-2);
		sphereParent.add( sphere );
	}
	sphereParent.position.set(0,0,0);
	scene.add(sphereParent);
}
function rect(x,y){
				
	bax = x2 - x1;
	bay = y2 - y1;
	dax = x4 - x1;
	day = y4 - y1;

	if ((x - x1) * bax + (y - y1) * bay < 0.0) return false;
	if ((x - x2) * bax + (y - y2) * bay > 0.0) return false;
	if ((x - x1) * dax + (y - y1) * day < 0.0) return false;
	if ((x - x4) * dax + (y - y4) * day > 0.0) return false;

	return true;
}