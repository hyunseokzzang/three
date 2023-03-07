import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' ;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
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
    scene.fog = new THREE.Fog('black', 1, 15)
    // scene.background = new THREE.Color('#fff')
	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
    camera.position.set(0, 0, 2)
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

	// const directionalLight = new THREE.PointLight('white', 1);
	// directionalLight.position.x = 0;
	// directionalLight.position.y = 1;
	// directionalLight.position.z = 0;
    // directionalLight.castShadow = true;
	// scene.add(directionalLight);
    const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6 ); 
    // hemiLight.castShadow = true;
    scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight);
    // scene.add(hemiLightHelper);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.01,
    });
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff,
    });
    const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

    const points = new THREE.Points(torusGeometry, pointsMaterial);
    const lines = new THREE.LineSegments(torusGeometry, lineMaterial);
    console.log(lineMaterial)
    // scene.add(lines);
    console.log(lines)
    scene.add(points);
    
    //loader
    let logoMesh; 
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        '/images/mx_logo.gltf', 
        gltf => {
            logoMesh = gltf.scene.children[0];
            logoMesh.position.x = -0.75
            logoMesh.position.z = 12
            scene.add(logoMesh)
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
    gsap.registerPlugin(ScrollTrigger)
    
    const item = gsap.utils.toArray('.scroll-item');

    gsap.to(
        points.scale,
        {
            scrollTrigger : {
                trigger : item[1],
                scrub : true,
            },
            x : 2,
            y : 2,
            z : 2
        }
    )
    gsap.timeline({
        scrollTrigger :{
            trigger : item[1],
            scrub : 1,
            pin : true,
            markers : true,
            start : 'center center'

        }
    }).from(
        item[1].querySelector('div'),
        {   
            opacity : 0,
            y : 50   
        }
    )
    .to(
        item[1].querySelector('div'),
        {
            duration : 2,
            opacity : 0,
            y : -50   
        },
        '+=100'
    )
    gsap.to(
        camera.position,
        {
            scrollTrigger : {
                trigger : item[2],
                scrub : true,
            },
            z : -1
        }
    )
    gsap.to(
        camera.rotation,
        {
            scrollTrigger : {
                trigger : item[2],
                scrub : true,
            },
            z : 3
        }
    )
    gsap.to(
        points.rotation,
        {
            scrollTrigger : {
                trigger : item[2],
                scrub : true,
            },
            x : 2,
        }
    )

    gsap.from(
        item[2].querySelector('h2'),
        {
            scrollTrigger : {
                trigger : item[2],
                scrub : 3,
                pin : true,
                markers: true,
            },
            start : 'center center',
            opacity : 0,
            x : -200   
        }
    )
    
    gsap.to(
        camera.rotation,
        {
            scrollTrigger : {
                trigger : item[3],
                scrub : true,
            },
            z : 0
        }
    )
    gsap.to(
        camera.position,
        {
            scrollTrigger : {
                trigger : item[3],
                scrub : true,
            },
            z : 20
        }
    )

	const clock = new THREE.Clock();
	function draw() {
		const delta = clock.getDelta();

        points.rotation.y += delta
        // if(logoMesh) {
        //     logoMesh.position.x = -(moveX / 50);
        //     logoMesh.position.y = moveY / 50;

        //     console.log(logoMesh.position.x)
        // }

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