import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import dat from 'dat.gui';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// ----- 주제: 

export default function example() {
    // Renderer
    gsap.registerPlugin(ScrollTrigger);

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
    scene.fog = new THREE.Fog('#fff', 0, 500)
    scene.background = new THREE.Color('gray')
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // const ambientLightGuide = new THREE.AmbientLightGuide();
    // scene.add(ambientLight);
    

    const directionalLight = new THREE.DirectionalLight('#fff', 0.75);
    directionalLight.position.x = 0;
    directionalLight.position.y = 50;
    directionalLight.position.z = 30;
    directionalLight.castShadow = true;
    const directionalLightGuide = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLight);
    scene.add(directionalLightGuide)

    const textureLoader = new THREE.TextureLoader();
    const bright = textureLoader.load('./texture/bright.png');


    // 그리기

    const depthNum = 50; //박스와 박스 사이 z값. 깊이
    let targetZNum = 0; //
    let moveZ = 0;
    const boxGroup = new THREE.Group();
    const meshes = [];

    class Project {
        constructor(info) {
            this.name = info.name;
            this.type = info.type;
            this.image = `./image/project/main/${this.name}.png`,
            this.background = info.background; 
        }
    }

    const projectList = ['EIPP','국립부여박물관'];
    const projectResult = [];

    for(let i = 0; i < projectList.length; ++i) {
        projectResult.push(
            new Project({
                name : projectList[i],
                type : 'jfif',
                background : 'red'
            })
        )
    }

    console.log(projectResult);

    const projectInformation = [
        {
            name : 'EIPP',
            type : 'jfif',
            image : `./images/project/main/eipp.png`,
            background : 'red'
        },
        {
            name : '국립부여박물관',
            type : 'JPG',
            image : `./images/project/main/buyeo.png`,
            background : 'blue'
        },
        {
            name : '국립전주박물관',
            type : 'JPG',
        },
        {
            name : '대외경제정책연구원',
            type : 'JPG'
        },
        {
            name : '대전광역시사회서비스원',
            type : 'JPG'
        },
        {
            name : '대전보건대학교',
            type : 'JPG'
        },
        {
            name : '대전일자리경제진흥원',
            type : 'JPG'
        },
        {
            name : '대전테크노파크',
            type : 'JPG'
        },
        {
            name : '디엔에프',
            type : 'JPG'
        },
        {
            name : '범부처의료기기연구개발사업단',
            type : 'JPG'
        },
        {
            name : '브레인즈컴퍼니',
            type : 'JPG'
        },
        {
            name : '선박해양플랜트',
            type : 'JPG'
        },
        {
            name : '지란지교소프트',
            type : 'png' 
        },
        {
            name : '청와대_국민품으로',
            type : 'JPG'
        },
        {
            name : '충청남도관광재단',
            type : 'JPG'
        },
        {
            name : '타운보드TV',
            type : 'JPG'
        },
        {
            name : '보노보노1',
            type : 'png'
        },
        {
            name : '보노보노2',
            type : 'png'
        },
        {
            name : 'video',
            type : 'mp4'
        },
        {
            name : 'video2',
            type : 'mp4'
        }
    ]
    
    let totalNum = projectInformation.length;

    const addBox = (i) => {
        let geometry;
        let texture;
        let material;
        let video;
        let videoSource;
        let thumbGeometry;
        let thumbMaterial;
        let thumbMesh;
        geometry = new THREE.BoxGeometry(24, 24, 0.1);

        if(projectInformation[i].type == 'mp4') {
            
            video = document.createElement('video');
            video.muted = true;
            video.autoplay = true;
            video.loop = true;
            // video.play();
            videoSource = document.createElement('source');
            videoSource.src = `./images/project/thumb/img${i}.${projectInformation[i].type}`;
            video.appendChild(videoSource);

            texture = new THREE.VideoTexture( video );

        } else {
            texture = textureLoader.load(
                `./images/project/thumb/img${i}.${projectInformation[i].type}`,
            );
        }

        material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent : true
        });

        thumbMaterial = new THREE.MeshPhongMaterial({
            color : 'red',
            transparent : true,
        })

        const boxMesh = new THREE.Mesh(geometry, material);

        thumbGeometry = new THREE.BoxGeometry(24.1, 24.1, 0.1);
        thumbMesh = new THREE.Mesh(thumbGeometry, thumbMaterial);
        boxMesh.name = projectInformation[i].name;
        boxMesh.thumb = thumbMesh;
        boxMesh.image = projectInformation[i].image;
        boxMesh.background = projectInformation[i].background;
        boxMesh.castShadow = true;
        let x;
        if(i % 2 == 0) {
            x = 20
        } else {
            x = -20
        }
        let y = geometry.parameters.height / 2;
        let z = -i * depthNum;
        boxMesh.position.set(x, y, z);
        thumbMesh.position.set(x, y, z + 0.1);
        boxGroup.add(boxMesh, thumbMesh);
        meshes.push(boxMesh);

        gsap.to(
            boxMesh.thumb.material,{
                opacity : 0
            } 
        )
        
    };

    for (let i = 0; i < totalNum; i++) {
        addBox(i);
    }

    scene.add(boxGroup);

    let mouseX = 0,
    mouseY = 0,
    moveX = 0,
    moveY = 0;

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

    //스크롤 연동
    let scrolly = 0;
    let pageNum = 0;
    const progressBar = document.querySelector('.bar');
    let perNum = 0;

    const scrollFunc = () => {
        if(checkProjectShow == false) {
            scrolly = window.scrollY;
            pageNum = Math.ceil(scrolly / 100);
            targetZNum = depthNum * pageNum;

            perNum = Math.ceil(
                (scrolly / (document.body.offsetHeight - window.innerHeight)) * 100
            );

            progressBar.style.width = perNum + '%'
        }
    };

    //마우스감지
    
    const cameraPosition = new THREE.Vector3(0, 0, 0);
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    const raycaster = new THREE.Raycaster(cameraPosition, cameraDirection);
    raycaster.near = 0;
    raycaster.far = 110;
    const mouse = new THREE.Vector2();

    let checkProjectShow = false;
    const projectDetail = (item) => {
        
        let project;
        let projectDetail;
        let projectHead;
        let projectContainer;
        let projectImage;
        const makeElement = (tagName) => {
            return document.createElement(tagName);
        }

        project = makeElement('div');
        project.classList.add('project');
        projectDetail = makeElement('div');
        projectDetail.classList.add('project-detail');
        projectDetail.style.background = item.object.background;
        projectHead = makeElement('div');
        projectHead.classList.add('project-detail-title');
        projectHead.innerHTML = item.object.name;
        projectContainer = makeElement('div');
        projectContainer.classList.add('project-detail-info');
        projectImage = makeElement('img');
        projectImage.src = item.object.image;
        // projectInformation.innerHTML = item.object.name;

        projectDetail.appendChild(projectHead);
        projectDetail.appendChild(projectContainer);
        projectContainer.appendChild(projectImage);
        project.appendChild(projectDetail);

        const closeProject = makeElement('button');
        closeProject.classList.add('back');
        closeProject.innerHTML = '돌아가 !';
        project.appendChild(closeProject);
        document.body.appendChild(project);

        gsap.to(
            projectHead, {
                scrollTrigger : {
                    trigger : projectHead,
                    endTrigger : projectContainer,
                    start : 'top top',
                    pin : true,
                    pinSpacing : false,
                    scrub : true,
                    markers : true
                }
            }
        )
        gsap.from(
            project, {
                opacity: 0,
                duration: 0.5
            }
        )
        
        checkProjectShow = true;
        document.body.style.overflow = 'hidden';

        document.querySelector('.back').addEventListener('click', function () {
            gsap.to(
                project, {
                    opacity: 0,
                    duration: 0.5
                }
            )
            checkProjectShow = false;
            document.body.style.overflow = '';
            setTimeout(()=> { project.remove() },500)
        })
    }

    const checkIntersects = () => {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(meshes);

        for (const item of intersects) {

            projectDetail(item)


            break; // for문 종료
        }

    }
    const overIntersects = () => {
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(meshes);
        for (const item of intersects) {

            const thumbnailMesh = item.object.thumb;

            gsap.to(
                thumbnailMesh.position, {
                    z : item.object.position.z + 0.1,
                    duration : 0.5
                }
            )

            gsap.to(
                thumbnailMesh.material, {
                    opacity : 1,
                    duration : 0.5
                }
            )
            
            // break; // for문 종료
        }
        
        if(intersects.length == 0){
            for(let i = 0; i <= meshes.length; ++i) {
                
                    const thumbnailMesh = meshes[i].thumb;
                
                    gsap.to(
                        thumbnailMesh.position, {
                            z : meshes[i].position.z,
                            duration : 0.5
                        }
                    )
        
                    gsap.to(
                        thumbnailMesh.material, {
                            opacity : 0,
                            duration : 0.5
                        }
                    )
        
                    gsap.to(
                        thumbnailMesh.scale, {
                            x : 1,
                            y : 1,
                            duration : 0.5
                        }
                    )
            }
        }

    }

    canvas.addEventListener('click', e => {
        mouse.x = e.clientX / canvas.clientWidth * 2 - 1; //3d환경 마우스 위치 구하기
        mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1); //3d환경 마우스 위치 구하기

        checkIntersects()
    })

    canvas.addEventListener('mousemove', e => {
        mouse.x = e.clientX / canvas.clientWidth * 2 - 1; //3d환경 마우스 위치 구하기
        mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1); //3d환경 마우스 위치 구하기

        overIntersects()
    })

    const mouseParticle = () => {
        const particleCanvas = document.getElementById('particle-canvas');
        const ctx = particleCanvas.getContext('2d');
        const makes = [];
        const mouse = {
            x : undefined,
            y : undefined
        }
        let hue = 0;
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = mouse.x;
                this.y = mouse.y;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.size = Math.random() * 15 + 1;
                this.color = `hsl(${hue}, 100% , 50%)` 
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.1;
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            for (let i = 0; i < 2; i++) {
                const make = new Particle();
                makes.push(make);
            }
        }

        const handleParticles = () => {
            for (let i = 0; i < makes.length; i++) {
                const make = makes[i];
                make.update();
                make.draw();
                if (make.size < 0.2) {
                    makes.splice(i, 1);
                    i--;
                }
            }
        }

        const particleAnimate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            hue += 10;
            requestAnimationFrame(particleAnimate)
        }

        particleAnimate();

        const handleEvents = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
            
            initParticles();
        }

        // particleCanvas.addEventListener('click', handleEvents)
        particleCanvas.addEventListener('mousemove', handleEvents)
    }

    // mouseParticle();
    


    // 이벤트
    document.body.style.height = window.innerHeight + totalNum * 100 - 150 + 'px';
    window.addEventListener('scroll', scrollFunc);
    window.addEventListener('resize', setSize);
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    draw();
}