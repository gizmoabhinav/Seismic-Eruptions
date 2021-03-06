var rainbow = new Rainbow();
rainbow.setSpectrum('#A52A2A', '#FF0000', '#800080', '#FF00FF', "#2f9898", "#266fc1", "#0000ff", "#00FFFF", "#50f950", "#FFFF00");
var sphereParent = new THREE.Object3D();
var radius = new Array();
var latVal = new Array();
var lonVal = new Array();
var colors = new Array();
var depths = new Array();
var d = new Date();
var curr_year,curr_month,curr_date;
var curr_date = d.getDate();

var mag = getURLParameter("mag");
var startdate = getURLParameter("startdate");
if(startdate == undefined){
	startdate = "2009/1/1";
}
var enddate = getURLParameter("enddate");
if(enddate == undefined){
	curr_year = d.getFullYear();
	curr_month = d.getMonth()+1;
	curr_date = d.getDate();
	enddate = curr_year+'/'+curr_month+'/'+curr_date;
}
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
function loadquakes(){
var script = document.createElement('script');
script.src = 'http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime='+startdate+'%2000:00:00&minmagnitude='+mag+'&format=geojson&callback=eqfeed_callback&endtime='+enddate+'%2023:59:59&orderby=time-asc&minlatitude='+Math.min(getURLParameter("y1"),getURLParameter("y2"),getURLParameter("y3"),getURLParameter("y4"))+'&maxlatitude='+Math.max(getURLParameter("y1"),getURLParameter("y2"),getURLParameter("y3"),getURLParameter("y4"))+'&minlongitude='+Math.min(getURLParameter("x1"),getURLParameter("x2"),getURLParameter("x3"),getURLParameter("x4"))+'&maxlongitude='+Math.max(getURLParameter("x1"),getURLParameter("x2"),getURLParameter("x3"),getURLParameter("x4"));
document.getElementsByTagName('body')[0].appendChild(script);
var count = 0;
var maxdepth = 0;
var mindepth = 999;
var maxmag = 0;
var minmag = 999;
var size;

window.eqfeed_callback = function(results) {
	size = results.features.length;
	if(size==0){
		alert("No earthquakes inside the cross section in given time range");
		return;
	}
	var mindepth = 999;
	var maxdepth = 0;
	for (var i = 0; i < size; i++){
		if(rect(convertCoordinatesx(results.features[i].geometry.coordinates[0]),convertCoordinatesy(results.features[i].geometry.coordinates[1]))){
			count++;
			if(results.features[i].geometry.coordinates[2]>maxdepth)maxdepth=results.features[i].geometry.coordinates[2];
			if(results.features[i].geometry.coordinates[2]<mindepth)mindepth=results.features[i].geometry.coordinates[2];
			if(results.features[i].properties.mag<minmag)mag=results.features[i].properties.mag;
			if(results.features[i].properties.mag>maxmag)maxmag=results.features[i].properties.mag;
			radius[i] = 0.0025*Math.pow(2,(results.features[i].properties.mag)*4/(10));
			latVal[i] = results.features[i].geometry.coordinates[0];
			lonVal[i] = results.features[i].geometry.coordinates[1];
			depths[i] = results.features[i].geometry.coordinates[2];
		}
	}
	$("#info").html("</br></br>total earthquakes : "+size+"</br>minimum depth : "+mindepth+" km</br>maximum depth : "+maxdepth+" km</br></br></br><div class='ui-body ui-body-a'><p><a href='http://github.com/gizmoabhinav/Seismic-Eruptions'>Link to the project</a></p></div>");
	$("#startdate").html("Start date : "+timeConverter(startdate));
	$("#enddate").html("End date : "+timeConverter(enddate));
	$("#magcutoff").html("Cutoff magnitude : "+mag);
	//alert("earthquake count : "+count);
	rainbow.setNumberRange(0, maxdepth);
	for(var i=0;i<size;i++){
		var sphereGeometry = new THREE.SphereGeometry( radius[i], 8, 8 );
		var sphereMaterial = new THREE.MeshPhongMaterial( { color: parseInt('0x'+rainbow.colourAt(results.features[i].geometry.coordinates[2])) , overdraw: false } );
		var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
		sphere.position.set(convertCoordinatesx(latVal[i])-leftTileLimit-2,-convertCoordinatesy(lonVal[i])+topTileLimit+2,1.0-(depths[i]/1000));
		sphereParent.add( sphere );
	}
	sphereParent.position.set(0,0,0);
	scene.add(sphereParent);
	// generate the box
	var vertex1 = new THREE.Vector3( x1-leftTileLimit-2, -y1+topTileLimit+2,1 );
	var vertex2 = new THREE.Vector3( x2-leftTileLimit-2, -y2+topTileLimit+2,1 );
	var vertex3 = new THREE.Vector3( x3-leftTileLimit-2, -y3+topTileLimit+2,1 );
	var vertex4 = new THREE.Vector3( x4-leftTileLimit-2, -y4+topTileLimit+2,1 );
	var vertex5 = new THREE.Vector3( x1-leftTileLimit-2, -y1+topTileLimit+2,1.0-(maxdepth/1000) );
	var vertex6 = new THREE.Vector3( x2-leftTileLimit-2, -y2+topTileLimit+2,1.0-(maxdepth/1000) );
	var vertex7 = new THREE.Vector3( x3-leftTileLimit-2, -y3+topTileLimit+2,1.0-(maxdepth/1000) );
	var vertex8 = new THREE.Vector3( x4-leftTileLimit-2, -y4+topTileLimit+2,1.0-(maxdepth/1000) );
	var box = new THREE.Geometry();
	box.vertices.push( vertex1 );
	box.vertices.push( vertex2 );
	box.vertices.push( vertex3 );
	box.vertices.push( vertex4 );
	box.vertices.push( vertex5 );
	box.vertices.push( vertex6 );
	box.vertices.push( vertex7 );
	box.vertices.push( vertex8 );
	box.faces.push( new THREE.Face3( 6,5,4 ) );
	box.faces.push( new THREE.Face3( 4,7,6 ) );
	box.faces.push( new THREE.Face3( 4,5,6 ) );
	box.faces.push( new THREE.Face3( 6,7,4 ) );
	box.faces.push( new THREE.Face3( 4,1,0 ) );
	box.faces.push( new THREE.Face3( 5,1,4 ) );
	box.faces.push( new THREE.Face3( 0,1,4 ) );
	box.faces.push( new THREE.Face3( 4,1,5 ) );
	box.faces.push( new THREE.Face3( 1,2,5 ) );
	box.faces.push( new THREE.Face3( 5,2,6 ) );
	box.faces.push( new THREE.Face3( 5,2,1 ) );
	box.faces.push( new THREE.Face3( 6,2,5 ) );
	box.faces.push( new THREE.Face3( 2,3,6 ) );
	box.faces.push( new THREE.Face3( 6,3,7 ) );
	box.faces.push( new THREE.Face3( 6,3,2 ) );
	box.faces.push( new THREE.Face3( 7,3,6 ) );
	box.faces.push( new THREE.Face3( 3,0,7 ) );
	box.faces.push( new THREE.Face3( 7,0,3 ) );
	box.faces.push( new THREE.Face3( 7,0,4 ) );
	box.faces.push( new THREE.Face3( 4,0,7 ) );
	var rectmaterial = new THREE.MeshBasicMaterial({color: 0x770000,transparency : true,opacity:0.05,wireframe : false});
	mesh = new THREE.Mesh(box, rectmaterial);
    //scene.add(mesh);
	var lines = new THREE.Geometry();
	lines.vertices.push( vertex1 );
	lines.vertices.push( vertex2 );
	lines.vertices.push( vertex3 );
	lines.vertices.push( vertex4 );
	lines.vertices.push( vertex1 );
	lines.vertices.push( vertex5 );
	lines.vertices.push( vertex6 );
	lines.vertices.push( vertex7 );
	lines.vertices.push( vertex8 );
	lines.vertices.push( vertex5 );
	lines.vertices.push( vertex6 );
	lines.vertices.push( vertex2 );
	lines.vertices.push( vertex3 );
	lines.vertices.push( vertex7 );
	lines.vertices.push( vertex8 );
	lines.vertices.push( vertex4 );
	// lines
	var line = new THREE.Line( lines, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1 } ) );
	scene.add( line );
	controls.target.z = 1.0-(maxdepth/2000);
	
}
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
document.getElementById("frame").src="frame.html?x1="+getURLParameter('x1')+"&x2="+getURLParameter('x2')+"&x3="+getURLParameter('x3')+"&x4="+getURLParameter('x4')+"&y1="+getURLParameter('y1')+"&y2="+getURLParameter('y2')+"&y3="+getURLParameter('y3')+"&y4="+getURLParameter('y4')+"&startdate="+startdate+"&enddate="+enddate+"&mag="+mag;
		