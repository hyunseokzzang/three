import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' ;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import dat from 'dat.gui';
import gsap from 'gsap';

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

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;

    // gsap.to(camera.position, {
    //     x : 1,
    //     z : 2,
    //     y: 1,
    //     duration:3
    // })

	scene.add(camera);
    
    document.querySelector('#prev').addEventListener('click', () => {

        gsap.to(camera.position, {
            z : -3,
            duration:3
        })

    })

    document.querySelector('#next').addEventListener('click', () => {

        gsap.to(camera.position, {
            x : -1,
            z : 1,
            y : 1,
            duration:3
        })

    })


    // Controls 
    // const controls = new OrbitControls(camera, renderer.domElement);

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

    // Loader 
    const gltfLoader = new GLTFLoader();
    
    let logoMesh;
    gltfLoader.load(
        '/images/mx_logo.gltf',
        gltf => {
            logoMesh = gltf.scene.children[0];
            scene.add(logoMesh)

            console.log(logoMesh);

            const logoMeshPositionArray = logoMesh.geometry.attributes.position.array;

            const particleGeometry = new THREE.BufferGeometry();
            const paricleCount = 1000;
            const particlePositions = new Float32Array(logoMeshPositionArray);
            const particleColors = new Float32Array(logoMeshPositionArray);

            for (let i = 0; i < logoMeshPositionArray.length; i++) {
                particlePositions[i] = (Math.random() - 0.5) * 10;
                // particleColors[i] = Math.random()
            }

            particleGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(particlePositions, 3)
            )

            const particleMaterial = new THREE.PointsMaterial({
                size : 0.03,
                // vertexColors : true
                color : 'white'
            })

            const particles = new THREE.Points(particleGeometry, particleMaterial)
            particles.position.set(0, 0, 0)
            scene.add(particles)
            console.log(particles)
            const setShape = (e) => {
                const type = e.target.dataset.type;
                let array;
                
                switch (type) {
                    case 'random':
                        array = particlePositions;
                        console.log('random');
                        break;
                    case 'logo':
                        array = logoMeshPositionArray;
                        console.log('logo');
                        break;
                }

                particleGeometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(array, 3)
                )


            }

            const btnWrapper = document.createElement('div');
            btnWrapper.classList.add('btns');

            const randomBtn = document.createElement('button');
            randomBtn.dataset.type = 'random';
            randomBtn.style.cssText = 'position:absolute; left:20px; top:20px;'
            randomBtn.innerHTML = 'Random';
            btnWrapper.append(randomBtn);
            
            const logoBtn = document.createElement('button');
            logoBtn.dataset.type = 'logo';
            logoBtn.style.cssText = 'position:absolute; left:20px; top:50px;'
            logoBtn.innerHTML = 'Logo';
            btnWrapper.append(logoBtn);

            document.body.append(btnWrapper);
            btnWrapper.addEventListener('click' , setShape)
        }
    );

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

    // scene.background = cubeTexture;

    // scene
	// AxesHelper
	// const axesHelper = new THREE.AxesHelper(3);
	// scene.add(axesHelper);

	// // GridHelper
	// const gridHelper = new THREE.GridHelper(10);
	// scene.add(gridHelper);

	// Dat GUI
	const gui = new dat.GUI();
	gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
	gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

	// 그리기
    
    let moveX;
    let moveY;

	const clock = new THREE.Clock();
	function draw() {
		const delta = clock.getDelta();

        moveX += (mouseX - moveX - window.innerWidth / 2) * 0.05;
        moveY = (mouseY - moveY - window.innerHeight / 2) * 0.05;

        if(logoMesh) {
            logoMesh.position.x = -(moveX / 50);
            logoMesh.position.y = moveY / 50;
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

    let mouseX;
    let mouseY;
    function mouseEvent(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        console.log(mouseX, mouseY);
    }
    console.log('hi');
    console.log('hello');

    document.addEventListener('mousemove', mouseEvent)
	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}