import './style.css';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'


/* import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { ObjectLoader, PlaneGeometry } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; */


// scene, camera and renderer //

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 76, 50, 15 );
				camera.rotation.set( - 1.29, 1.15, 1.26 );


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true



// lighting //

const light = new THREE.SpotLight(0xffffff, 0.7);
light.position.set(25, 50, 25);
light.angle = Math.PI / 6;
light.penumbra = 1;
light.deay = 2;
light.distance = 100;
light.map = new THREE.TextureLoader().load('tiedye.jpg');
light.castShadow = true;

scene.add(light);

const secondlight = new THREE.SpotLight(0xfdfbd3, 0.5);
secondlight.position.set(25, 50, 25);
secondlight.angle = Math.PI / 6;
secondlight.penumbra = 1;
secondlight.deay = 2;
secondlight.distance = 100;
secondlight.castShadow = true;

scene.add(secondlight);

const ambilight = new THREE.AmbientLight(0xffffff, 0.01);

scene.add(ambilight);


// load assets //  

 const loader = new STLLoader()
loader.load(
    'statue.stl',
    function (geometry) {
      geometry.scale(0.010, 0.010, 0.010);
        const headmatieral = new THREE.MeshStandardMaterial( {
          map: marbleloader,
        })
        const mesh = new THREE.Mesh(geometry, headmatieral);
        mesh.position.y = 0;
        mesh.position.x = 1;
        mesh.position.z = -1;
        mesh.rotation.z = 4*Math.PI/3;
        mesh.rotation.x = Math.PI/2;
        mesh.rotation.y = Math.PI;
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
) 


// globe and textures // 

const marbleloader = new THREE.TextureLoader().load('disturb.jpg');
const earthloader = new THREE.TextureLoader().load('highresearth.png');

const backgroundtexture = new THREE.TextureLoader().load('otherspace.jpg');
scene.background = backgroundtexture


const globegeo = new THREE.SphereGeometry(75, 75, 75);
const globemat = new THREE.MeshLambertMaterial({map:earthloader });
const earthmesh = new THREE.Mesh(globegeo, globemat);
earthmesh.position.y = -75;
scene.add(earthmesh);



// randomly generated geometries // 

function addStar() {
  const geometry = new THREE.OctahedronGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);


// resize handler //

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}



// text field button // 

function clickfunction() {
  var x = document.createElement('INPUT');
  x.setAttribute("type", "text");
  x.setAttribute('value', "type enter")
}

// stats //

const stats = Stats()
document.body.appendChild(stats.dom)


function animate() {
  requestAnimationFrame(animate)

  controls.update()

  render()

  stats.update()
}

function render() {
  
const time = performance.now() / 5000;

light.position.x = Math.cos( time ) * 10;
light.position.z = Math.sin( time ) * 10;
secondlight.position.x = Math.cos( time ) * 10;
secondlight.position.z = Math.sin( time ) * 10;

renderer.render(scene, camera);
  
}

animate()


var input;
var cursor;
var hiddenInput;
var content = [];
var lastContent = "", targetContent = "";
var inputLock = false;
var autoWriteTimer;
var isMobile, isIE;

window.onload = function() {

    isMobile = navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/);

    isIE = (navigator.appName == 'Microsoft Internet Explorer');

    input = document.getElementById('input');

    hiddenInput = document.getElementById('hiddenInput');
    hiddenInput.focus();

    cursor = document.createElement('cursor');
    cursor.setAttribute('class', 'blink');
    cursor.innerHTML = "|";

    if (!isMobile && !isIE) input.appendChild(cursor);

    function refresh() {

        inputLock = true;

        if (targetContent.length - lastContent.length == 0) return;

        var v = targetContent.substring(0, lastContent.length + 1);

        content = [];

        var blinkPadding = false;

        for (var i = 0; i < v.length; i++) {
            var l = v.charAt(i);

            var d = document.createElement('div');
            d.setAttribute('class', 'letterContainer');

            var d2 = document.createElement('div');

            var animClass = (i % 2 == 0) ? 'letterAnimTop' : 'letterAnimBottom';

            var letterClass = (lastContent.charAt(i) == l) ? 'letterStatic' : animClass;

            if (letterClass != 'letterStatic') blinkPadding = true;

            d2.setAttribute('class', letterClass);

            d.appendChild(d2);

            d2.innerHTML = l;
            content.push(d);
        }

        input.innerHTML = '';

        for (var i = 0; i < content.length; i++) {
            input.appendChild(content[i]);
        }

        cursor.style.paddingLeft = (blinkPadding) ? '22px' : '0';

        if (!isMobile && !isIE) input.appendChild(cursor);

        if (targetContent.length - lastContent.length > 1) setTimeout(refresh, 150);
        else inputLock = false;

        lastContent = v;
    }

    if (document.addEventListener) {

        document.addEventListener('touchstart', function(e) {
            clearInterval(autoWriteTimer);
            targetContent = lastContent;
        }, false);

        document.addEventListener('click', function(e) {
            clearInterval(autoWriteTimer);
            targetContent = lastContent;
            hiddenInput.focus();
        }, false);

        if (!isIE) {
            // Input event is buggy on IE, so don't bother
            // (https://msdn.microsoft.com/en-us/library/gg592978(v=vs.85).aspx#feedback)
            // We will use a timer instead (below)
            hiddenInput.addEventListener('input', function(e) {
                e.preventDefault();
                targetContent = hiddenInput.value;
                if (!inputLock) refresh();

            }, false);
        } else {
            setInterval(function() {
                targetContent = hiddenInput.value;

                if (targetContent != lastContent && !inputLock) refresh();
            }, 100);
        }

    }

    hiddenInput.value = "";

    autoWriteTimer = setTimeout(function() {
        if (lastContent != "") return;
        targetContent = "type sudo enter";
        refresh();
    }, 2000);
}



/* const geometry = new THREE.PlaneGeometry( 100, 100 );
				const material = new THREE.MeshLambertMaterial( { map: marbleloader } );

				const mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, - 1, 0 );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

 */



/*  new PLYLoader().load( 'sculp.ply', function ( geometry ) {

  geometry.scale( 0.024, 0.024, 0.024 );
  geometry.computeVertexNormals();

  const material = new THREE.MeshLambertMaterial({
    map: marbleloader,
  });

  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = 10;
  mesh.position.x = 10;
  mesh.rotation.z = Math.PI/2;
  mesh.rotation.x = -Math.PI/2;
  
  
  
  mesh.receiveShadow = true;
  scene.add( mesh );

} );




const loader = new OBJLoader();
loader.load(
  'engel.obj',
  function (object) {
    scene.add(object);
    object.position.y = 10;
  },
  function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
); */
