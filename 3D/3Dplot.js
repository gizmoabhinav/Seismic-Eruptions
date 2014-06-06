var sphereParent = new THREE.Object3D();
var circles = new Array();
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


var particle_system_geometry = new THREE.Geometry();



window.eqfeed_callback = function(results) {
	size = results.features.length;
	for (var i = 0; i < size; i++){
		if(rect(convertCoordinatesx(results.features[i].geometry.coordinates[0]),convertCoordinatesy(results.features[i].geometry.coordinates[1]))){
			count++;
			//circles[i] = new Array(results.features[i].geometry.coordinates[0],results.features[i].geometry.coordinates[1],results.features[i].geometry.coordinates[2],results.features[i].properties.time,results.features[i].properties.mag);
			var radius = 0.03;//results.features[i].properties.mag;
			var sphereGeometry = new THREE.SphereGeometry( radius, 4, 2 );
			var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
			var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
			sphere.position.set(convertCoordinatesx(results.features[i].geometry.coordinates[0])-leftTileLimit-2,0,convertCoordinatesy(results.features[i].geometry.coordinates[1])-topTileLimit-2);
			sphereParent.add( sphere );
			particle_system_geometry.vertices.push(new THREE.Vector3D(results.features[i].geometry.coordinates[0])-leftTileLimit-2,0,convertCoordinatesy(results.features[i].geometry.coordinates[1])-topTileLimit-2);
		}
		sphereParent.position.set(0,0,0);
	}
	alert(count);
	//scene.add(sphereParent);
	var particle_system_material = new THREE.ParticleBasicMaterial({
  		color: 0xffffff,
  		size: 1
	});
	var particleSystem = new THREE.ParticleSystem(
  		particle_system_geometry,
    		particle_system_material
	);
	scene.add(particleSystem);

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
