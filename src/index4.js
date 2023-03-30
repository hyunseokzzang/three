import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
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
    camera.position.set(0, 0, 50)
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

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (Math.random() * 200);
        colorArray[i] = Math.random();
    }

    const particlePositionAttribute = new THREE.BufferAttribute(posArray, 3);
    particleGeometry.setAttribute('position', particlePositionAttribute);
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    console.log(particleGeometry)

    const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        // color: 'blue',
        map: bright,
        transparent: true,
        alphaMap: bright,
        depthWrite: false,
        // blending : THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    const particleMesh2 = new THREE.Points(particleGeometry, particleMaterial);

    const depthNum = 50; //박스와 박스 사이 z값. 깊이
    let targetZNum = 0; //
    let moveZ = 0;
    let totalNum = 16;
    const boxGroup = new THREE.Group();
    const meshes = [];
    const projectName = [
        'EIPP',
        '국립부여박물관',
        '국립전주박물관',
        '대외경제정책연구원',
        '대전광역시사회서비스원',
        '대전보건대학교',
        '대전일자리경제진흥원',
        '대전테크노파크',
        '디엔에프',
        '범부처의료기기연구개발사업단',
        '브레인즈컴퍼니',
        '선박해양플랜트',
        '지란지교소프트',
        '청와대_국민품으로',
        '충청남도관광재단',
        '타운보드TV'
    ]

    function cover( texture, aspect ) {

        var imageAspect = texture.image.width / texture.image.height;
    
        if ( aspect < imageAspect ) {
    
                texture.matrix.setUvTransform( 0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5 );
    
        } else {
    
                texture.matrix.setUvTransform( 0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5 );
    
        }
    
    }
    const addBox = (i) => {
        const texture = new THREE.TextureLoader().load(
            "./images/project/img" + i + '.JPG',
            () => {
                cover(texture, window.innerWidth / window.innerHeight);
            }
        );
       

        const geometry = new THREE.BoxBufferGeometry(24, 24, 0.1);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
        });
        const boxMesh = new THREE.Mesh(geometry, material);
        boxMesh.name = projectName[i]
        boxMesh.castShadow = true;

        // let x = Math.random() * 100 - 100 / 2;
        // let y = Math.random() * 100 - 100 / 2;
        let x;

        if ((i % 2) > 0) {
            x = -30
        } else {
            x = 30
        }

        let y = 0;
        let z = -i * depthNum;
        boxMesh.position.set(x, y, z);
        // boxMesh.rotation.set(x, y, z);
        boxGroup.add(boxMesh);
        meshes.push(boxMesh)
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
        particleMesh.rotation, {
            x: 360,
            duration: 360,
            repeat: -1,
            delay: 0,
            ease: 'linear',
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
        console.log(event.deltaY);
        if (event.deltaY <= -100) {
            if (targetZNum > 0 && checkClick == false) {
                targetZNum -= depthNum;
            }
        } else {
            if (targetZNum < totalNum * depthNum && checkClick == false) {
                targetZNum += depthNum;
            }
        }
        // console.log(targetZNum);
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let checkClick = false;
    const checkIntersects = () => {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(meshes);

        for (const item of intersects) {
            const itemBeforeScale = {
                x: item.object.scale.x,
                y: item.object.scale.y,
                z: item.object.scale.z
            };

            const itemBeforePosition = {
                x: item.object.position.x,
                y: item.object.position.y,
                z: item.object.position.z,
            };


            gsap.to(
                item.object.scale, {
                    x: window.innerWidth * 0.005,
                    y: window.innerHeight * 0.005,
                    duration: 1
                }
            );

            gsap.to(
                item.object.position, {
                    z: -moveZ,
                    x: 0,
                    y: 0,
                    duration: 1
                }
            )


            const makeElement = document.createElement('div');
            makeElement.classList.add('projectName');
            const makeElementDetail = document.createElement('div');
            makeElementDetail.classList.add('projectNameDetail');
            makeElementDetail.innerHTML = item.object.name;
            makeElement.appendChild(makeElementDetail);

            const makeElementBack = document.createElement('button');
            makeElementBack.classList.add('back');
            makeElementBack.innerHTML = '돌아가 !';
            makeElementDetail.appendChild(makeElementBack);
            document.body.appendChild(makeElement);

            gsap.from(
                makeElement, {
                    opacity: 0,
                    y: 20,
                    delay: 0.5,
                    duration: 0.5
                }
            )

            checkClick = true;
            console.log(moveZ)
            // item.object.scale.set(2,2,2)
            // item.object.position.set(0,0,10)

            document.querySelector('.back').addEventListener('click', function () {
                console.log(itemBeforeScale)
                gsap.to(
                    item.object.scale, {
                        x: itemBeforeScale.x,
                        y: itemBeforeScale.y,
                        z: itemBeforeScale.z,
                        duration: 1,
                    }
                )

                gsap.to(
                    item.object.position, {
                        x: itemBeforePosition.x,
                        y: itemBeforePosition.y,
                        z: itemBeforePosition.z,
                        duration: 1,
                    }
                )

                gsap.to(
                    makeElement, {
                        y: 20,
                        opacity: 0,
                        duration: 0.5
                    }
                )

                makeElement.remove()
                checkClick = false;

            })


            break; // for문 종료
        }

    }


    canvas.addEventListener('click', e => {
        mouse.x = e.clientX / canvas.clientWidth * 2 - 1; //3d환경 마우스 위치 구하기
        mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1); //3d환경 마우스 위치 구하기

        checkIntersects();
    })


    // 이벤트
    window.addEventListener('resize', setSize);
    window.addEventListener("wheel", scrollFunc);
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    draw();
}