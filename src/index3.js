import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' ;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import dat from 'dat.gui';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// ----- 주제: 

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputEncoding = THREE.sRGBEncoding;
	// Scene
	const scene = new THREE.Scene();
    // scene.fog = new THREE.Fog('black', 1, 15)
    // scene.background = new THREE.Color('#fff')
	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
    camera.position.set(0, 0, 6)
    camera.rotation.set(0, 0, 0)

    // gsap.to(camera.position, {
    //     x : 1,
    //     z : 2,
    //     y: 1,
    //     duration:3
    // })

	scene.add(camera);


    // Controls 
    const controls = new OrbitControls(camera, renderer.domElement);

	// Light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	const directionalLight = new THREE.PointLight('white', 1);
	directionalLight.position.x = 0;
	directionalLight.position.y = 1;
	directionalLight.position.z = 0;
    directionalLight.castShadow = true;
	scene.add(directionalLight);

    
    //loader
    let logoMesh; 
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        '/images/mx_logo.gltf', 
        gltf => {
            logoMesh = gltf.scene.children[0];
            scene.add(logoMesh)
        }
    )
    let mouseCharacter;
    let mixer;
    gltfLoader.load(
        '/images/mouse6.glb',
        glb => {
            mouseCharacter = glb.scene.children[0];
            mouseCharacter.position.set(0, 0, 0)
            mouseCharacter.scale.set(0.005, 0.005, 0.005);

            const pointsGeometry = mouseCharacter.geometry; 
            const pointsMaterial = new THREE.PointsMaterial({
                size: 0.01,
                color : '#fff'
            });

            const points = new THREE.Points(pointsGeometry, pointsMaterial)
            
            scene.add(points);
            // mixer = new THREE.AnimationMixer(mouseCharacter);
            // const actions = [];
            // actions[0] = mixer.clipAction(mouseCharacter.animations[0]);
            // actions[1] = mixer.clipAction(mouseCharacter.animations[1]);

            // actions[0].play();

        }
    )

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

    //floor 
    const floorGeometry = new THREE.PlaneGeometry(10, 10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color : 'skyblue'
    })
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -(Math.PI / 2);
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    
    // scene.add(floorMesh)

    // EnvironmentMap 
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const cubeTexture = cubeTextureLoader.setPath('./texture/sky/').load([
        'px.png', 'nx.png',
        'py.png', 'ny.png',
        'pz.png', 'nz.png'
    ]);

	// Dat GUI
	// const gui = new dat.GUI();
	// gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	// gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
	// gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

	// 그리기

	const clock = new THREE.Clock();
	function draw() {
		const delta = clock.getDelta();

        if (mixer) {
            mixer.update(delta);
        } 
            

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}