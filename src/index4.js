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
    scene.fog = new THREE.Fog('white', 0, 500)
    scene.background = new THREE.Color('#fff')
	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
    camera.position.set(0, 0, 6)
    camera.rotation.set(0, 0, 0)


	scene.add(camera);


    // Controls 
    // const controls = new OrbitControls(camera, renderer.domElement);

	// Light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	const directionalLight = new THREE.PointLight('gray', 1);
	directionalLight.position.x = 0;
	directionalLight.position.y = 1;
	directionalLight.position.z = 0;
    directionalLight.castShadow = true;
	scene.add(directionalLight);

    const loader = new THREE.TextureLoader();
    const bright = loader.load('./texture/bright.png');

	// 그리기
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (Math.random() * 200);
        colorArray[i] = Math.random();
    }

    const particlePositionAttribute = new THREE.BufferAttribute(posArray, 3);
    particleGeometry.setAttribute('position', particlePositionAttribute);
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    console.log(particleGeometry)

    const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors : true,
        // color: 'blue',
        map : bright,
        transparent : true,
        alphaMap : bright,
        depthWrite : false,
        // blending : THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    const particleMesh2 = new THREE.Points(particleGeometry, particleMaterial);

    const depthNum = 30; //박스와 박스 사이 z값. 깊이
    let targetZNum = 0; //
    let moveZ = 0;
    let totalNum = 50;    
    const boxGroup = new THREE.Group();
    const addBox = (i) => {
        const imageMap = new THREE.TextureLoader().load(
            "https://source.unsplash.com/collection/" + i
        );
    
        const geometry = new THREE.BoxBufferGeometry(24, Math.random() * 18 + 10, 1);
        const material = new THREE.MeshPhongMaterial({
            map: imageMap,
        });
        const boxMesh = new THREE.Mesh(geometry, material);
        boxMesh.castShadow = true;
    
        let x = Math.random() * 100 - 100 / 2;
        let y = Math.random() * 100 - 100 / 2;
        let z = -i * depthNum;
        boxMesh.position.set(x, y, z);
        // boxMesh.rotation.set(x, y, z);
        boxGroup.add(boxMesh);
    };

    for (let i = 0; i <= totalNum; i++) {
        addBox(i);
        // console.log(i);
    }
    scene.add(boxGroup);
    scene.add(particleMesh);


    let mouseX = 0,
    mouseY = 0,
    moveX = 0,
    moveY = 0;

    gsap.to(
        particleMesh.rotation, 
        {
            x : 360,
            duration : 360,
            repeat : -1,
            delay:0,
            ease : 'linear',
            repeatDelay: 0
        }
    )

	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        moveZ += (targetZNum - moveZ) * 0.07;
        boxGroup.position.z = moveZ;
        moveX += (mouseX - moveX - window.innerWidth / 2) * 0.05;
        moveY += (mouseY - moveY - window.innerWidth / 2) * 0.05;
        boxGroup.position.x = -(moveX / 50);
        boxGroup.position.y = moveY / 50;

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);

	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}
    
    const scrollFunc = (event) => {
        // console.log(event.deltaY);
        if (event.deltaY <= -100) {
            if (targetZNum > 0) {
                targetZNum -= depthNum;
            }
        } else {
            if (targetZNum < totalNum * depthNum) {
                targetZNum += depthNum;
            }
        }
        // console.log(targetZNum);
    };

	// 이벤트
	window.addEventListener('resize', setSize);
    window.addEventListener("wheel", scrollFunc);
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

	draw();
}