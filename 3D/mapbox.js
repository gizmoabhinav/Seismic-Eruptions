var scene;
var camera; 
var cubeMesh;
initializeScene();

animateScene();
function initializeScene(){ 
	if(Detector.webgl){ 
		renderer = new THREE.WebGLRenderer({antialias:true});
		$("#controls").html("<font color='white'>WebGL Renderer</font>");
	} else { 
        renderer = new THREE.CanvasRenderer();
		$("#controls").html("<font color='white'>Canvas Renderer</font>");
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
	var cubeGeometry;
	if(Detector.webgl){
		planeGeometry = new THREE.PlaneGeometry( 1, 1, 1); 
	}
	else{
		planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 2,0,2);
	}
	var tileSource;
	if(Detector.webgl){
		tileSource = "tiles/6/"; 
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
			scene.add(cubeMesh);
		}
	}
	
	
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