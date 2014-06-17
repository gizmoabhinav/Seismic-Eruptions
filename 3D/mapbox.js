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
	camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
	camera.position.set(5, 0, 10);
	camera.lookAt(scene.position);
	scene.add(camera);
	
	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.getElementById("WebGLCanvas").appendChild( stats.domElement );
	
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
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
} 