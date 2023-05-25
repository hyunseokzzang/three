import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import dat from 'dat.gui';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function example() {
    gsap.registerPlugin(ScrollTrigger);

    class Project {
        constructor(info) {
            this.name = info.name;
            this.head = info.head;
            this.background = info.background || 'gray'; 
            this.desc = info.desc;
            this.year = info.year;
            this.url = info.url;
            this.thumb = `./images/project/hover/${this.name}.png` || './images/project/thumb/sample.jpg',
            this.hover = `./images/project/hover/${this.name}.png` || './images/project/hover/sample.png';
            this.main = `./images/project/main/${this.name}.jpg` || './images/project/hover/sample.jpg';
            this.logo = `./images/project/logo/${this.name}.png` || './images/project/logo/sample.png'; 
        }
    }

    const projectList = [
        // {
        //     name : 'jeonju',
        //     head : '국립전주박물관',
        //     desc : '박물관 뉴스레터 제작',
        //     year : '2022',
        //     url : 'https://jeonju.museum.go.kr/korean/'
        // },
        // {
        //     name : 'engineering',
        //     head : '한국과학기술원',
        //     desc : '카이스트 공과대학 뉴스레터 제작',
        //     year : '2022',
        //     url : 'https://engineering.kaist.ac.kr/'
        // },
        // {
        //     name : 'kimm',
        //     head : '한국기계연구원',
        //     desc : '영문웹진 제작',
        //     year : '2022',
        //     url : 'https://www.kimm.re.kr/eng'
        // },
        // {
        //     name : 'djbea',
        //     head : '대전일자리경제진흥원',
        //     desc : '홈페이지 사용자 만족도 조사',
        //     year : '2022',
        //     url : 'https://www.djbea.or.kr/'
        // },
        // {
        //     name : 'khidi',
        //     head : '한국보건산업진흥원',
        //     desc : '의료기기산업 주간뉴스레터 구독 이벤트홍보',
        //     year : '2022',
        //     url : 'https://jeonju.museum.go.kr/korean/'
        // },
        // {
        //     name : 'innopolis',
        //     head : '연구개발특구진흥재단',
        //     desc : '연구개발특구진흥재단 메타버스 구축',
        //     year : '2022',
        //     url : 'https://app.gather.town/app/GQFWhh0p1zTGUpYf/INNOPOLIS'
        // },
        // {
        //     name : 'doksa',
        //     head : '안정성평가연구소',
        //     desc : 'KIT 국가독성정책센터 홈페이지 구축',
        //     year : '2022',
        //     url : 'https://www.kitox.re.kr/doksa/'
        // },
        {
            name : 'brainz',
            head : '브레인즈컴퍼니',
            desc : '브레인즈컴퍼니 홈페이지 구축',
            year : '2022',
            background:'#092D8D',
            url : 'https://www.brainz.co.kr/'
        },
        {
            name : 'hit',
            head : '대전보건대학교',
            desc : '대전보건대학교 입학사이트 구축',
            year : '2022',
            background : '#00204A',
            url : 'https://ipsi.hit.ac.kr/consult'
        },
        // {
        //     name : 'kigam',
        //     head : '한국지질자원연구원',
        //     desc : '한국지질자원연구원 홈페이지 통합유지보수',
        //     year : '2022',
        //     url : 'https://www.kigam.re.kr'
        // },
        {
            name : 'knfc',
            head : '한국원자력연료',
            desc : '한국원자력연료 홈페이지 유지보수',
            year : '2022',
            background : '#BB161F',
            url : 'https://www.knfc.co.kr/mps'
        },
        {
            name : 'kcpass',
            head : '중앙사회서비스원',
            desc : '중앙사회서비스원 홈페이지 유지보수',
            year : '2022',
            background : 'linear-gradient(-45deg, #0099DB, #8BB929)',
            url : 'https://www.kcpass.or.kr/mps'
        },
        // {
        //     name : 'diwc',
        //     head : '대덕복지센터',
        //     desc : '대덕복지센터 웹호스팅 및 보안인증서 갱신',
        //     year : '2022',
        //     url : 'https://diwc.or.kr/'
        // },
        // {
        //     name : 'kribb',
        //     head : '한국생명공학연구원',
        //     desc : '한국생명공학연구원 대표홈페이지 웹접근성 인증마크 갱신',
        //     year : '2022',
        //     url : 'https://www.kribb.re.kr/kor'
        // },
    ];

    const projectResult = [];

    
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
        project.style.background = item.background || 'black';
        project.innerHTML = `
            <div class="project-util">
                <strong>MAINTENANCE EXPRIENCE</strong>
                <strong>WEBSITE PROJECT</strong>
                <strong><a href="#" class="back">BACK</a></strong>
            </div>
        `
        projectDetail = makeElement('div');
        projectDetail.classList.add('project-detail');
        projectHead = makeElement('div');
        projectHead.classList.add('project-detail-title');
        projectHead.innerHTML = `
            <div class="project-detail-title-info">
                <strong>PROJECT.</strong>
                <div class="project-detail-title-topic">${item.head}</div>
                <strong>Detail</strong>
                <div>${item.desc}</div>
                <strong>RELEASE DATE</strong>
                <div>${item.year}</div>
                <a href="${item.url}" target="_blank" title="새창으로 열림" rel="noopener noreferrer" class="home">
                    <img src="./images/layout/home.png"> 
                </a>
            </div>
            <span class="logo" style="background : ${item.background}"><img src="${item.logo}"></span>
        `;
        projectLogo = projectHead.querySelector('.logo');
        projectLogo.querySelector('img').onerror = function() {
            this.src = './images/project/logo/hit.png'
        }
        projectContainer = makeElement('div');
        projectContainer.classList.add('project-detail-info');
        projectImage = makeElement('img');
        projectImage.src = item.main;
        // projectInformation.innerHTML = item.object.name;
        projectImage.onerror = function() {
            this.src = './images/project/main/sample.jpg'
        }
        projectDetail.appendChild(projectHead);
        projectDetail.appendChild(projectContainer);
        projectContainer.appendChild(projectImage);
        project.appendChild(projectDetail);

        gsap.to(
            projectHead, {
                scrollTrigger : {
                    trigger : projectHead,
                    endTrigger : projectContainer,
                    start : 'top-=134 top',
                    pin : true,
                    pinSpacing : false,
                    scrub : true,
                    // markers : true,
                }
            }
        )

        document.body.appendChild(project);
        
        gsap.from(
            project, {
                opacity: 0,
                duration: 0.5
            }
        )
        
        document.body.style.overflow = 'hidden';

        document.querySelector('.back').addEventListener('click', function (e) {
            e.preventDefault();

            gsap.to(
                project, {
                    opacity: 0,
                    duration: 0.5
                }
            )
            document.body.style.overflow = '';
            setTimeout(()=> { project.remove() },500)
        })
    }

    let item;
    let items;

    for(let i = 0; i < projectList.length; ++i) {
        projectResult.push(
            new Project({
                name : projectList[i].name,
                head : projectList[i].head,
                background : projectList[i].background,
                desc : projectList[i].desc,
                year : projectList[i].year,
                url : projectList[i].url
            })
        )

        item = `
            <img src="./images/project/hover/${projectResult[i].name}.png">
            <div class="item-info">
                <span>WEBSITE<br>PROJECT</span>
                <div>
                    <span>${projectResult[i].year}</span>
                    <img src="./images/arrow.svg" alt="">
                </div>
            </div>
        `;

        const itemMaker = document.createElement('div');
        itemMaker.innerHTML = item;
        itemMaker.classList.add('item');
        itemMaker.setAttribute('data-tilt', '')
        document.querySelector('.list').appendChild(itemMaker);

        itemMaker.name = projectResult[i].name;
        itemMaker.year = projectResult[i].year;
        itemMaker.background = projectResult[i].background;

        itemMaker.addEventListener('click', function(e){
            console.log(e.target)
            projectDetail(this)
        })
    }

    // $('.item').on('click', function(e){
    //     e.preventDefault();

    //     console.log($(this).background)
    // })

    $('[data-tilt]').tilt({
        maxTilt :-20,
        glare: true,
        maxGlare: 3,
        perspective:350,
        scale : 0.85,
        speed : 750,
    })

    gsap.to(
        $('.bg'),{
            scrollTrigger : {
                trigger : '#wrap',
                start : 'top top',
                end : 'bottom bottom',
                scrub : true,
            },
            filter : 'hue-rotate(360deg)'
        }
    )

    // Renderer
    const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.x = 1;
	camera.position.y = 1;
	camera.position.z = -2;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

    //controls 
    // const controls = new OrbitControls(camera, canvas)

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// GridHelper
	const gridHelper = new THREE.GridHelper(10);
	scene.add(gridHelper);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        './images/the_bathroom_free.glb', 
        glb => {
            const environment = glb.scene.children[0];
            scene.add(environment)
            console.log(environment)
        }
    )

    const boxes = gsap.utils.toArray('.item');
    const positions = [
        {
            x : 2,
            y : 2, 
            z: 3
        },
        {
            x : -5,
            y : 10, 
            z: 4
        },
        {
            x : -1,
            y : 3, 
            z: -2
        },
        {
            x : -4,
            y : 3, 
            z: 2
        }
    ];
    boxes.forEach((box , i) => {
        gsap.to(
            camera.position, {
                scrollTrigger : {
                    trigger : box,
                    start : 'top center',
                    end : 'bottom bottom',
                    markers : true,
                    // scrub : true,
                },
                duration : 2,
                x :  positions[i].x,
                y : positions[i].y,
                z : positions[i].y
            }
        )

        // gsap.to(
        //     camera.rotation, {
        //         scrollTrigger : {
        //             trigger : box,
        //             start : 'top center',
        //             end : 'bottom bottom',
        //             markers : true,
        //             // scrub : true,
        //         },
        //         duration : 5,
        //         x :  positions[i].x,
        //         y : positions[i].y,
        //         z : positions[i].y
        //     }
        // )
    })

    
	// Dat GUI
	const gui = new dat.GUI();
	gui.add(camera.position, 'x', -50, 50, 1).name('카메라 X');
	gui.add(camera.position, 'y', -50, 50, 1).name('카메라 Y');
	gui.add(camera.position, 'z', -50, 50, 1).name('카메라 Z');

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		// mesh.position.set(-1, 2, 0);

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