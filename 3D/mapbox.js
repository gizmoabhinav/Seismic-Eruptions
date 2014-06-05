var scene;
var camera; 
var cubeMesh;
initializeScene();
animateScene();
function initializeScene(){ 
	if(false){ 
		renderer = new THREE.WebGLRenderer({antialias:true}); 
	} else { 
        renderer = new THREE.CanvasRenderer(); 
    } 
    renderer.setClearColor(0x777777, 1);
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	renderer.setSize(canvasWidth, canvasHeight);
	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
	camera.position.set(5, 0, 10);
	camera.lookAt(scene.position);
	scene.add(camera);
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	var cubeGeometry = new THREE.CubeGeometry(1, 1, 1, 2,0,2);
	/*if(!Detector.webgl){
		cubeGeometry = new THREE.CubeGeometry(0.5, 0.5,0.5, 4, 4, 4); 
	}*/
	for(var j=0;j<4;j++){
		for(var i=0;i<4;i++){
			glassTexture = new THREE.ImageUtils.loadTexture("http://otile1.mqcdn.com/tiles/1.0.0/sat/6/"+(leftTileLimit+i)+"/"+(topTileLimit+j)+".png");
			//glassTexture = new THREE.ImageUtils.loadTexture("tiles/"+(21+i)+"/"+(11+j)+".jpg");
			glassTexture.wrapS = glassTexture.wrapT = THREE.RepeatWrapping;
			glassTexture.repeat.set( 1, 1 );
			var cubeMaterials = [
				new THREE.MeshBasicMaterial({color:0xFFFF00,transparent: true,opacity:0.01}),
				new THREE.MeshBasicMaterial({color:0x0000FF,transparent: true,opacity:0.01}),
				new THREE.MeshLambertMaterial({
					map:glassTexture,
					depthWrite: false,
					transparent: true,
					opacity: 0.5,
					side:THREE.DoubleSide,
					combine: THREE.MixOperation
				}),
				new THREE.MeshBasicMaterial({color:0x00FF00,transparent: true,opacity:0.3,side:THREE.DoubleSide}),
				new THREE.MeshBasicMaterial({color:0x00FFFF,transparent: true,opacity:0.01}),
				new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent: true,opacity:0.01})
			];
			var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
			cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cubeMesh.position.set(i+0.5-2, 0.0, j+0.5-2);
			scene.add(cubeMesh);
		}
	}
	// generate the rectangle
	var rectangle = new THREE.Geometry();
	rectangle.vertices.push( new THREE.Vector3( x1-leftTileLimit-2, 0.55, y1-topTileLimit-2 ) );
	rectangle.vertices.push( new THREE.Vector3( x2-leftTileLimit-2, 0.55, y2-topTileLimit-2 ) );
	rectangle.vertices.push( new THREE.Vector3( x3-leftTileLimit-2, 0.55, y3-topTileLimit-2 ) );
	rectangle.vertices.push( new THREE.Vector3( x4-leftTileLimit-2, 0.55, y4-topTileLimit-2 ) );
	rectangle.faces.push( new THREE.Face3( 2,1,0 ) );
	rectangle.faces.push( new THREE.Face3( 0,3,2 ) );
	rectangle.faces.push( new THREE.Face3( 0,1,2 ) );
	rectangle.faces.push( new THREE.Face3( 2,3,0 ) );
	var rectmaterial = new THREE.MeshBasicMaterial({color: 0x770000,opacity:0.3});
	rectmesh = new THREE.Mesh(rectangle,rectmaterial);
	scene.add(rectmesh);
	
	
	var ambientLight = new THREE.AmbientLight(0x101010, 10.0);
	scene.add(ambientLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
	directionalLight.position = camera.position;
	scene.add(directionalLight);
}
function animateScene(){
	requestAnimationFrame(animateScene);
	renderScene();
}
function renderScene(){
	renderer.render(scene, camera);
} 