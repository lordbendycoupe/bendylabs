import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

/* import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { ObjectLoader, PlaneGeometry } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; */


// camera, scene and renderer //


const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 76, 50, 15 );
				camera.rotation.set( - 1.29, 1.15, 1.26 );

const renderer = new THREE.WebGLRenderer()
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
light.map = new THREE.TextureLoader().load('paint.jpeg');
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





const lvloader = new THREE.TextureLoader().load('lv.png');
  

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

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)




const marbleloader = new THREE.TextureLoader().load('disturb.jpg');
const earthloader = new THREE.TextureLoader().load('otherplanet.jpg');


const globegeo = new THREE.SphereGeometry(75, 75, 75);
const globemat = new THREE.MeshLambertMaterial({map:earthloader });
const earthmesh = new THREE.Mesh(globegeo, globemat);
earthmesh.position.y = -75;
scene.add(earthmesh);


/* const geometry = new THREE.PlaneGeometry( 100, 100 );
				const material = new THREE.MeshLambertMaterial( { map: marbleloader } );

				const mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, - 1, 0 );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

 */

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
