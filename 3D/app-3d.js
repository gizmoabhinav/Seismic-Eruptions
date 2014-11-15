<<<<<<< HEAD
function timeConverter(e){var t=new Date(e),a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],r=t.getFullYear(),i=a[t.getMonth()],n=t.getDate(),o=(t.getHours(),t.getMinutes(),t.getSeconds(),r+" "+i+" "+n);return o}function loadquakes(){var e=document.createElement("script");e.src="http://comcat.cr.usgs.gov/fdsnws/event/1/query?starttime="+startdate+"%2000:00:00&minmagnitude="+mag+"&format=geojson&callback=eqfeed_callback&endtime="+enddate+"%2023:59:59&orderby=time-asc&minlatitude="+Math.min(getURLParameter("y1"),getURLParameter("y2"),getURLParameter("y3"),getURLParameter("y4"))+"&maxlatitude="+Math.max(getURLParameter("y1"),getURLParameter("y2"),getURLParameter("y3"),getURLParameter("y4"))+"&minlongitude="+Math.min(getURLParameter("x1"),getURLParameter("x2"),getURLParameter("x3"),getURLParameter("x4"))+"&maxlongitude="+Math.max(getURLParameter("x1"),getURLParameter("x2"),getURLParameter("x3"),getURLParameter("x4")),document.getElementsByTagName("body")[0].appendChild(e);var t,a=0,r=0,i=999;window.eqfeed_callback=function(e){if(t=e.features.length,0==t)return void alert("No earthquakes inside the cross section in given time range");for(var n=999,o=0,s=0;t>s;s++)rect(convertCoordinatesx(e.features[s].geometry.coordinates[0]),convertCoordinatesy(e.features[s].geometry.coordinates[1]))&&(a++,e.features[s].geometry.coordinates[2]>o&&(o=e.features[s].geometry.coordinates[2]),e.features[s].geometry.coordinates[2]<n&&(n=e.features[s].geometry.coordinates[2]),e.features[s].properties.mag<i&&(mag=e.features[s].properties.mag),e.features[s].properties.mag>r&&(r=e.features[s].properties.mag),radius[s]=.0025*Math.pow(2,4*e.features[s].properties.mag/10),latVal[s]=e.features[s].geometry.coordinates[0],lonVal[s]=e.features[s].geometry.coordinates[1],depths[s]=e.features[s].geometry.coordinates[2]);$("#info").html("</br></br>total earthquakes : "+t+"</br>minimum depth : "+n+" km</br>maximum depth : "+o+" km</br></br></br><div class='ui-body ui-body-a'><p><a href='http://github.com/gizmoabhinav/Seismic-Eruptions'>Link to the project</a></p></div>"),$("#startdate").html("Start date : "+timeConverter(startdate)),$("#enddate").html("End date : "+timeConverter(enddate)),$("#magcutoff").html("Cutoff magnitude : "+mag),rainbow.setNumberRange(0,o);for(var s=0;t>s;s++){var c=new THREE.SphereGeometry(radius[s],8,8),m=new THREE.MeshPhongMaterial({color:parseInt("0x"+rainbow.colourAt(e.features[s].geometry.coordinates[2])),overdraw:!1}),d=new THREE.Mesh(c,m);d.position.set(convertCoordinatesx(latVal[s])-leftTileLimit-2,-convertCoordinatesy(lonVal[s])+topTileLimit+2,1-depths[s]/1e3),sphereParent.add(d)}sphereParent.position.set(0,0,0),scene.add(sphereParent);var l=new THREE.Vector3(x1-leftTileLimit-2,-y1+topTileLimit+2,1),u=new THREE.Vector3(x2-leftTileLimit-2,-y2+topTileLimit+2,1),p=new THREE.Vector3(x3-leftTileLimit-2,-y3+topTileLimit+2,1),h=new THREE.Vector3(x4-leftTileLimit-2,-y4+topTileLimit+2,1),g=new THREE.Vector3(x1-leftTileLimit-2,-y1+topTileLimit+2,1-o/1e3),E=new THREE.Vector3(x2-leftTileLimit-2,-y2+topTileLimit+2,1-o/1e3),y=new THREE.Vector3(x3-leftTileLimit-2,-y3+topTileLimit+2,1-o/1e3),R=new THREE.Vector3(x4-leftTileLimit-2,-y4+topTileLimit+2,1-o/1e3),f=new THREE.Geometry;f.vertices.push(l),f.vertices.push(u),f.vertices.push(p),f.vertices.push(h),f.vertices.push(g),f.vertices.push(E),f.vertices.push(y),f.vertices.push(R),f.faces.push(new THREE.Face3(6,5,4)),f.faces.push(new THREE.Face3(4,7,6)),f.faces.push(new THREE.Face3(4,5,6)),f.faces.push(new THREE.Face3(6,7,4)),f.faces.push(new THREE.Face3(4,1,0)),f.faces.push(new THREE.Face3(5,1,4)),f.faces.push(new THREE.Face3(0,1,4)),f.faces.push(new THREE.Face3(4,1,5)),f.faces.push(new THREE.Face3(1,2,5)),f.faces.push(new THREE.Face3(5,2,6)),f.faces.push(new THREE.Face3(5,2,1)),f.faces.push(new THREE.Face3(6,2,5)),f.faces.push(new THREE.Face3(2,3,6)),f.faces.push(new THREE.Face3(6,3,7)),f.faces.push(new THREE.Face3(6,3,2)),f.faces.push(new THREE.Face3(7,3,6)),f.faces.push(new THREE.Face3(3,0,7)),f.faces.push(new THREE.Face3(7,0,3)),f.faces.push(new THREE.Face3(7,0,4)),f.faces.push(new THREE.Face3(4,0,7));var x=new THREE.MeshBasicMaterial({color:7798784,transparency:!0,opacity:.05,wireframe:!1});mesh=new THREE.Mesh(f,x);var T=new THREE.Geometry;T.vertices.push(l),T.vertices.push(u),T.vertices.push(p),T.vertices.push(h),T.vertices.push(l),T.vertices.push(g),T.vertices.push(E),T.vertices.push(y),T.vertices.push(R),T.vertices.push(g),T.vertices.push(E),T.vertices.push(u),T.vertices.push(p),T.vertices.push(y),T.vertices.push(R),T.vertices.push(h);var v=new THREE.Line(T,new THREE.LineBasicMaterial({color:16777215,opacity:1}));scene.add(v),controls.target.z=1-o/2e3}}function rect(e,t){return bax=x2-x1,bay=y2-y1,dax=x4-x1,day=y4-y1,0>(e-x1)*bax+(t-y1)*bay?!1:(e-x2)*bax+(t-y2)*bay>0?!1:0>(e-x1)*dax+(t-y1)*day?!1:(e-x4)*dax+(t-y4)*day>0?!1:!0}function getURLParameter(e){return decodeURIComponent((new RegExp("[?|&]"+e+"=([^&;]+?)(&|#|;|$)").exec(location.search)||[,""])[1].replace(/\+/g,"%20"))||null}function convertCoordinatesx(e){return e=parseFloat(e),e=64*(e+180)/360}function convertCoordinatesy(e){return e=parseFloat(e),e*=Math.PI/180,e=32*(1-Math.log(Math.tan(e)+1/Math.cos(e))/Math.PI)}function initializeScene(){Detector.webgl?(renderer=new THREE.WebGLRenderer({antialias:!0}),$("#rendererInfo").html("<font color='white'>WebGL Renderer</font>")):(renderer=new THREE.CanvasRenderer,$("#rendererInfo").html("<font color='white'>Canvas Renderer</font>")),renderer.setClearColor(7829367,1),canvasWidth=window.innerWidth,canvasHeight=window.innerHeight,renderer.setSize(canvasWidth,canvasHeight),document.getElementById("WebGLCanvas").appendChild(renderer.domElement),scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(25,canvasWidth/canvasHeight,1,100),camera.lookAt(new THREE.Vector3(midx-leftTileLimit-2,-midy+topTileLimit+2,1)),camera.position.set(.1953529215215685,-5.647229198648456,1.4347925563786978),camera.rotation.set(1.439025394333189,.03591325303244356,.004758846432708524),camera.up.set(0,0,1),scene.add(camera),stats=new Stats,stats.domElement.style.position="absolute",stats.domElement.style.top="0px",document.getElementById("WebGLCanvas").appendChild(stats.domElement),controls=new THREE.OrbitControls(camera,renderer.domElement),controls.target.x=midx-leftTileLimit-2,controls.target.y=-midy+topTileLimit+2,controls.target.z=1,controls.maxDistance=8;var e=new THREE.SphereGeometry(90,32,32),t=new THREE.MeshBasicMaterial;t.map=THREE.ImageUtils.loadTexture("../images/galaxy_starfield.png"),t.side=THREE.BackSide;var a=new THREE.Mesh(e,t);scene.add(a),group=new THREE.Object3D,planeGeometry=Detector.webgl?new THREE.PlaneGeometry(1,1,1):new THREE.PlaneGeometry(1,1,1,2,0,2);var r;r=Detector.webgl?"../images/tiles/6/":"http://otile1.mqcdn.com/tiles/1.0.0/sat/6/";for(var i=0;4>i;i++)for(var n=0;4>n;n++){glassTexture=new THREE.ImageUtils.loadTexture(r+(leftTileLimit+n)+"/"+(topTileLimit+i)+".png"),glassTexture.wrapS=glassTexture.wrapT=THREE.RepeatWrapping,glassTexture.repeat.set(1,1);var o=new THREE.MeshBasicMaterial({map:glassTexture,depthWrite:!1,depthTest:!1,transparent:!0,opacity:.5,side:THREE.DoubleSide,combine:THREE.MixOperation});cubeMesh=new THREE.Mesh(planeGeometry,o),cubeMesh.position.set(n+.5-2,-i-.5+2,1),group.add(cubeMesh)}scene.add(group);var s=new THREE.AmbientLight(1052688,10);scene.add(s);var c=new THREE.DirectionalLight(16777215,1);c.position=camera.position,scene.add(c)}function animateScene(){requestAnimationFrame(animateScene),renderScene(),stats.update()}function renderScene(){renderer.render(scene,camera)}function thumbnailToggle(){$("#thumbnail").is(":checked")?$("#iframe2d").fadeIn():$("#iframe2d").fadeOut()}function mapToggle(){$("#maptoggle").is(":checked")?(group.traverse(function(e){e.visible=!0}),group.visible=!0):(group.traverse(function(e){e.visible=!1}),group.visible=!1)}var rainbow=new Rainbow;rainbow.setSpectrum("#A52A2A","#FF0000","#800080","#FF00FF","#2f9898","#266fc1","#0000ff","#00FFFF","#50f950","#FFFF00");var sphereParent=new THREE.Object3D,radius=new Array,latVal=new Array,lonVal=new Array,colors=new Array,depths=new Array,d=new Date,curr_year,curr_month,curr_date,curr_date=d.getDate(),mag=getURLParameter("mag"),startdate=getURLParameter("startdate");void 0==startdate&&(startdate="2009/1/1");var enddate=getURLParameter("enddate");void 0==enddate&&(curr_year=d.getFullYear(),curr_month=d.getMonth()+1,curr_date=d.getDate(),enddate=curr_year+"/"+curr_month+"/"+curr_date),document.getElementById("frame").src="frame.html?x1="+getURLParameter("x1")+"&x2="+getURLParameter("x2")+"&x3="+getURLParameter("x3")+"&x4="+getURLParameter("x4")+"&y1="+getURLParameter("y1")+"&y2="+getURLParameter("y2")+"&y3="+getURLParameter("y3")+"&y4="+getURLParameter("y4")+"&startdate="+startdate+"&enddate="+enddate+"&mag="+mag;var leftTileLimit,topTileLimit,x1=convertCoordinatesx(getURLParameter("x1")),y1=convertCoordinatesy(getURLParameter("y1")),x2=convertCoordinatesx(getURLParameter("x2")),y2=convertCoordinatesy(getURLParameter("y2")),x3=convertCoordinatesx(getURLParameter("x3")),y3=convertCoordinatesy(getURLParameter("y3")),x4=convertCoordinatesx(getURLParameter("x4")),y4=convertCoordinatesy(getURLParameter("y4")),minx=Math.min(x1,x2,x3,x4),miny=Math.min(y1,y2,y3,y4),maxx=Math.max(x1,x2,x3,x4),maxy=Math.max(y1,y2,y3,y4);3-Math.ceil(maxx-minx)>=0&&3-Math.ceil(maxy-miny)>=0?(leftTileLimit=Math.floor(minx-(3-Math.ceil(maxx-minx))),topTileLimit=Math.floor(miny-(3-Math.ceil(maxy-miny)))):(leftTileLimit=Math.floor(minx),topTileLimit=Math.floor(miny));var midx=(maxx+minx)/2,midy=(maxy+miny)/2,scene,camera,cubeMesh,group;$.mobile.loading("show"),initializeScene(),$(window).load(function(){$.mobile.loading("hide"),animateScene(),loadquakes()});
=======
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
		
var leftTileLimit;
var topTileLimit;
var x1 = convertCoordinatesx(getURLParameter("x1"));
var y1 = convertCoordinatesy(getURLParameter("y1"));
var x2 = convertCoordinatesx(getURLParameter("x2"));
var y2 = convertCoordinatesy(getURLParameter("y2"));
var x3 = convertCoordinatesx(getURLParameter("x3"));
var y3 = convertCoordinatesy(getURLParameter("y3"));
var x4 = convertCoordinatesx(getURLParameter("x4"));
var y4 = convertCoordinatesy(getURLParameter("y4"));
var minx = Math.min(x1,x2,x3,x4);
var miny = Math.min(y1,y2,y3,y4);
var maxx = Math.max(x1,x2,x3,x4);
var maxy = Math.max(y1,y2,y3,y4);
if(3-Math.ceil(maxx-minx)>=0 && 3-Math.ceil(maxy-miny)>=0){					// temporary limit to the size of the rectangle
	leftTileLimit = Math.floor(minx-(3-Math.ceil(maxx-minx)));
	topTileLimit = Math.floor(miny-(3-Math.ceil(maxy-miny)));
}
else{
	leftTileLimit = Math.floor(minx);
	topTileLimit = Math.floor(miny);
}
var midx = ((maxx+minx)/2);
var midy = ((maxy+miny)/2);
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
/*
The 2D map has coordinates ranging from -180 to +180 from left to right and from +90 to -90 from top to bottom.
The 3D map projection ranges 64x64 units. The projection shows only 4x4 units of this area which is centred at 0,0,0.
This file finds the location of the point in this 3D projection corresponding to its latitude and longitude values. 
*/
function convertCoordinatesx(x){
	
	//converting the coordinates into new coordinate system
	x=parseFloat(x);
	x=((x+180)*64)/360;
	return x;
}
function convertCoordinatesy(y){
	
	//converting the coordinates into new coordinate system
	y = parseFloat(y);
	y = y*(Math.PI/180);
	y= (1 - (Math.log(Math.tan(y) + 1.0/Math.cos(y)) / Math.PI)) * 32;
	return y;
}
;var scene;
var camera; 
var cubeMesh;
var group;
$.mobile.loading('show');
initializeScene();
$(window).load(function(){
	$.mobile.loading('hide');
	animateScene();
	loadquakes();
});

function initializeScene(){ 
	if(Detector.webgl){ 
		renderer = new THREE.WebGLRenderer({antialias:true});
		$("#rendererInfo").html("<font color='white'>WebGL Renderer</font>");
	} else { 
        renderer = new THREE.CanvasRenderer();
		$("#rendererInfo").html("<font color='white'>Canvas Renderer</font>");
    } 
    renderer.setClearColor(0x777777, 1);
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	renderer.setSize(canvasWidth, canvasHeight);
	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(25, canvasWidth / canvasHeight, 1, 100);
	
	
	camera.lookAt(new THREE.Vector3(midx-leftTileLimit-2,-midy+topTileLimit+2,1));
	camera.position.set(0.1953529215215685,-5.647229198648456,1.4347925563786978);
	camera.rotation.set(1.439025394333189,0.03591325303244356,0.004758846432708524);
	
	camera.up.set( 0, 0, 1 );
	
	scene.add(camera);
	
	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.getElementById("WebGLCanvas").appendChild( stats.domElement );
	
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.x = midx-leftTileLimit-2;
	controls.target.y = -midy+topTileLimit+2;
	controls.target.z = 1;
	controls.maxDistance = 8;
	
	var starfieldgeometry  = new THREE.SphereGeometry(90, 32, 32)
	var starmaterial  = new THREE.MeshBasicMaterial()
	starmaterial.map   = THREE.ImageUtils.loadTexture('../images/galaxy_starfield.png')
	starmaterial.side  = THREE.BackSide
	var starmesh  = new THREE.Mesh(starfieldgeometry, starmaterial)
	scene.add(starmesh);
	
	group = new THREE.Object3D();
	if(Detector.webgl){
		planeGeometry = new THREE.PlaneGeometry( 1, 1, 1); 
	}
	else{
		planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 2,0,2);
	}
	var tileSource;
	if(Detector.webgl){
		tileSource = "../images/tiles/6/"; 
	}
	else{
		tileSource = "http://otile1.mqcdn.com/tiles/1.0.0/sat/6/"; 
	}
	for(var j=0;j<4;j++){
		for(var i=0;i<4;i++){
			
			glassTexture = new THREE.ImageUtils.loadTexture(tileSource+(leftTileLimit+i)+"/"+(topTileLimit+j)+".png");
			glassTexture.wrapS = glassTexture.wrapT = THREE.RepeatWrapping;
			glassTexture.repeat.set( 1, 1 );
			var planeMaterial = new THREE.MeshBasicMaterial({map:glassTexture,
					depthWrite: false,
					depthTest: false,
					transparent: true,
					opacity: 0.5,
					side:THREE.DoubleSide,
					combine: THREE.MixOperation});
			cubeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
			cubeMesh.position.set(i+0.5-2,-j-0.5+2,1.0);
			group.add(cubeMesh);
		}
	}
	
	scene.add(group);
	var ambientLight = new THREE.AmbientLight(0x101010, 10.0);
	scene.add(ambientLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
	directionalLight.position = camera.position;
	scene.add(directionalLight);
}
function animateScene(){
	requestAnimationFrame(animateScene);
	renderScene();
	stats.update();
}
function renderScene(){
	renderer.render(scene, camera);
	//$("#controls").html("<font color='white'>"+camera.position.x+","+camera.position.y+","+camera.position.z+";"+camera.rotation.x+","+camera.rotation.y+","+camera.rotation.z+"</font>");
}
function thumbnailToggle(){
	if($("#thumbnail").is(':checked')){
		$('#iframe2d').fadeIn();
	}
	else{
		$('#iframe2d').fadeOut();
	}
}
function mapToggle(){
	if($("#maptoggle").is(':checked')){
		group.traverse( function ( object ) { object.visible = true; } );
		group.visible = true;
	}
	else{
		group.traverse( function ( object ) { object.visible = false; } );
		group.visible = false;
	}
}

;
>>>>>>> c04dd00b6aa44bdfe5a8fc8010f6a82db8092183
