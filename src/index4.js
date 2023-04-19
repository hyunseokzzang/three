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
    scene.fog = new THREE.Fog('#F4F6F7', 0, 500)
    scene.background = new THREE.Color('#F4F6F7')
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
    

    const directionalLight = new THREE.DirectionalLight('#fff', 0.5);
    directionalLight.position.x = 0;
    directionalLight.position.y = 50;
    directionalLight.position.z = 30;
    directionalLight.castShadow = true;
    const directionalLightGuide = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLight);
    // scene.add(directionalLightGuide)

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
            this.head = info.head;
            this.background = info.background || 'gray'; 
            this.desc = info.desc;
            this.year = info.year;
            this.thumb = `./images/project/thumb/${this.name}.jpg` || './images/project/thumb/sample.jpg',
            this.hover = `./images/project/hover/${this.name}.png` || './images/project/hover/sample.png';
            this.main = `./images/project/main/${this.name}.jpg` || './images/project/hover/sample.jpg';
            this.logo = `./images/project/logo/${this.name}.png` || './images/project/logo/sample.png'; 
        }
    }

    const projectList = [
        {
            name : 'jeonju',
            head : '국립전주박물관',
            desc : '박물관 뉴스레터 제작',
            year : '2022',
        },
        {
            name : 'engineering',
            head : '한국과학기술원',
            desc : '카이스트 공과대학 뉴스레터 제작',
            year : '2022',
        },
        {
            name : 'kimm',
            head : '한국기계연구원',
            desc : '영문웹진 제작',
            year : '2022',
        },
        {
            name : 'djbea',
            head : '대전일자리경제진흥원',
            desc : '홈페이지 사용자 만족도 조사',
            year : '2022',
        },
        {
            name : 'khidi',
            head : '한국보건산업진흥원',
            desc : '의료기기산업 주간뉴스레터 구독 이벤트홍보',
            year : '2022',
        },
        {
            name : 'innopolis',
            head : '연구개발특구진흥재단',
            desc : '연구개발특구진흥재단 메타버스 구축',
            year : '2022',
        },
        {
            name : 'doksa',
            head : '안정성평가연구소',
            desc : 'KIT 국가독성정책센터 홈페이지 구축',
            year : '2022',
        },
        {
            name : 'brainz',
            head : '브레인즈컴퍼니',
            desc : '브레인즈컴퍼니 홈페이지 구축',
            year : '2022',
        },
        {
            name : 'hit',
            head : '대전보건대학교',
            desc : '대전보건대학교 입학사이트 구축',
            year : '2022',
        },
        {
            name : 'kigam',
            head : '한국지질자원연구원',
            desc : '한국지질자원연구원 홈페이지 통합유지보수',
            year : '2022',
        },
        {
            name : 'knfc',
            head : '한국원자력연료',
            desc : '한국원자력연료 홈페이지 유지보수',
            year : '2022',
        },
        {
            name : 'kcpass',
            head : '중앙사회서비스원',
            desc : '중앙사회서비스원 홈페이지 유지보수',
            year : '2022',
        },
        {
            name : 'diwc',
            head : '대덕복지센터',
            desc : '대덕복지센터 웹호스팅 및 보안인증서 갱신',
            year : '2022',
        },
        {
            name : 'kribb',
            head : '한국생명공학연구원',
            desc : '한국생명공학연구원 대표홈페이지 웹접근성 인증마크 갱신',
            year : '2022',
        },
    ];

    const projectResult = [];

    for(let i = 0; i < projectList.length; ++i) {
        projectResult.push(
            new Project({
                name : projectList[i].name,
                head : projectList[i].head,
                background : projectList[i].background,
                desc : projectList[i].desc,
                year : projectList[i].year
            })
        )
    }
    let totalNum = projectResult.length;

    const addBox = (i) => {
        let thumbGeometry;
        let thumbTexture;
        let hoverTexture;
        let thumbMaterial;
        let video;
        let videoSource;
        let hoverGeometry;
        let hoverMaterial;
        let hoverMesh;
        let thumbPath;
        let hoverPath;
        thumbGeometry = new THREE.BoxGeometry(24, 24, 0.1);
        // if(projectInformation[i].type == 'mp4') {
            
        //     video = document.createElement('video');
        //     video.muted = true;
        //     video.autoplay = true;
        //     video.loop = true;
        //     // video.play();
        //     videoSource = document.createElement('source');
        //     videoSource.src = `./images/project/thumb/img${i}.${projectInformation[i].type}`;
        //     video.appendChild(videoSource);

        //     texture = new THREE.VideoTexture( video );

        // } else {
        //     texture = textureLoader.load(
        //         `./images/project/thumb/img${i}.${projectInformation[i].type}`,
        //     );
        // }
        thumbPath =  `${projectResult[i].thumb}`;
        hoverPath = `${projectResult[i].hover}`;

        thumbTexture = textureLoader.load(
                thumbPath,    
        );

        hoverTexture = textureLoader.load(
            hoverPath,
        );

        thumbMaterial = new THREE.MeshPhongMaterial({
            map: thumbTexture,
            transparent : true
        });

        hoverMaterial = new THREE.MeshPhongMaterial({
            map : hoverTexture,
            transparent : true,
        })

        const thumbMesh = new THREE.Mesh(thumbGeometry, thumbMaterial);

        hoverGeometry = new THREE.BoxGeometry(24, 24, 0.1);
        hoverMesh = new THREE.Mesh(hoverGeometry, hoverMaterial);
        thumbMesh.head = projectResult[i].head;
        thumbMesh.hover = hoverMesh;
        thumbMesh.main = projectResult[i].main;
        thumbMesh.background = projectResult[i].background;
        thumbMesh.desc = projectResult[i].desc;
        thumbMesh.year = projectResult[i].year;
        thumbMesh.logo = projectResult[i].logo;


        thumbMesh.castShadow = true;
        let x;
        if(i % 2 == 0) {
            x = 20
        } else {
            x = -20
        }
        let y = Math.random() * 40;
        let z = -i * depthNum;
        thumbMesh.position.set(x, y, z);
        hoverMesh.position.set(x, y, z + 0.1);
        boxGroup.add(thumbMesh, hoverMesh);
        meshes.push(thumbMesh);

        gsap.to(
            thumbMesh.hover.material,{
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

        // moveZ += (targetZNum - moveZ) * 0.07;
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

    let currentPage = 0;
    let prevScroll;
    const scrollFunc = () => {
        if(checkProjectShow == false) {
            prevScroll = scrolly
            scrolly = window.scrollY;
            pageNum = Math.ceil(scrolly / 100);
            targetZNum = depthNum * pageNum;

            perNum = Math.ceil(
                (scrolly / (document.body.offsetHeight - window.innerHeight)) * 100
            );
            progressBar.style.width = perNum + '%'
            
            if(currentPage !== pageNum) {
                gsap.to(
                    camera.position, {
                        x : meshes[pageNum].position.x,
                        y : meshes[pageNum].position.y,
                        z : meshes[pageNum].position.z + 30,
                        duration : 1
                    }
                )
                currentPage = pageNum;
            }

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
        let projectLogo;
        const makeElement = (tagName) => {
            return document.createElement(tagName);
        }

        project = makeElement('div');
        project.classList.add('project');
        project.style.background = item.object.background;
        projectDetail = makeElement('div');
        projectDetail.classList.add('project-detail');
        projectHead = makeElement('div');
        projectHead.classList.add('project-detail-title');
        projectHead.innerHTML = `
            <strong>PROJECT.</strong>
            <div class="project-detail-title-topic">${item.object.head}</div>
            <strong>Detail</strong>
            <div>${item.object.desc}</div>
            <strong>RELEASE DATE</strong>
            <div>${item.object.year}</div>
            <img src="${item.object.logo}">
        `;
        projectLogo = projectHead.querySelector('img');
        projectLogo.onerror = function() {
            this.src = './images/project/logo/sample.png'
        }
        projectContainer = makeElement('div');
        projectContainer.classList.add('project-detail-info');
        projectImage = makeElement('img');
        projectImage.src = item.object.main;
        // projectInformation.innerHTML = item.object.name;
        projectImage.onerror = function() {
            this.src = './images/project/main/sample.jpg'
        }
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
                    // markers : true,
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

            const hoverMesh = item.object.hover;

            gsap.to(
                item.object.material, {
                    opacity : 0,
                    duration : 0.5
                }
            )

            gsap.to(
                hoverMesh.position, {
                    z : item.object.position.z + 0.5,
                    duration : 0.5
                }
            )

            gsap.to(
                hoverMesh.material, {
                    opacity : 1,
                    duration : 0.5
                }
            )

            // break; // for문 종료
        }
        
        if(intersects.length == 0){
            for(let i = 0; i <= meshes.length; ++i) {
                
                    const hoverMesh = meshes[i].hover;
                
                    gsap.to(
                        hoverMesh.position, {
                            z : meshes[i].position.z,
                            duration : 0.5
                        }
                    )
        
                    gsap.to(
                        hoverMesh.material, {
                            opacity : 0,
                            duration : 0.5
                        }
                    )

                    gsap.to(
                        meshes[i].material, {
                            opacity : 1,
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