
/* CMPSCI 373 Homework 5: Hierarchical Scene */
const width = window.innerWidth, height = window.innerHeight;
const fov = 60;
const cameraz = 5;
const aspect = width/height;
const smoothShading = true;
let   animation_speed = 1.0;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(fov, aspect, 1, 1000);
camera.position.set(0, 1, cameraz);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(0x202020);
window.onload = function(e) {
	document.getElementById('window').appendChild(renderer.domElement);
}
let orbit = new THREE.OrbitControls(camera, renderer.domElement);	// create mouse control

let light0 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light0.position.set(camera.position.x, camera.position.y, camera.position.z);	// this light is at the camera
// scene.add(light0);

let light1 = new THREE.DirectionalLight(0x800D0D, 1.0); // red light
light1.position.set(-1, 1, 0);
// scene.add(light1);

let light2 = new THREE.DirectionalLight(0x0D0D80, 1.0); // blue light
light2.position.set(1, 1, 0);
// scene.add(light2);

let amblight = new THREE.AmbientLight(0x202020);	// ambient light
// scene.add(amblight);

const color = 0xffffff;
const intensity = 3;
const light = new THREE.PointLight(color, intensity);
scene.add(light);

let material = new THREE.MeshPhongMaterial({color:0x808080, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let models = []; // array that stores all models
let numModelsLoaded = 0;
let numModelsExpected = 0;

// load models
// ===YOUR CODE STARTS HERE===
const textureLoader = new THREE.TextureLoader();


// 'label' is a unique name for the model for accessing it later
function loadModel(objstring, material, label) {
	numModelsExpected++;
	loadOBJFromString(objstring, function(mesh) { // callback function for non-blocking load
		mesh.computeFaceNormals();
		if(smoothShading) mesh.computeVertexNormals();
		models[label] = new THREE.Mesh(mesh, material);
		numModelsLoaded++;
	}, function() {}, function() {});
}

//Cool Camera Pan
function pan(camera) {
	camera.position.y -= 2;
}

//Physics
const G = 6.6743 * Math.pow(10, -11);
const Ms = 1.989 * Math.pow(10, 30);
const Me = 5.972 * Math.pow(10, 24);
const Dse = 149.76 * Math.pow(10, 5);
const Dem = 384.4 * Math.pow(10, 2);
const Dsm = 244.05 * Math.pow(10, 5);
const Dsmerc = 57.348 * Math.pow(10, 5);
const Dsv = 108.39 * Math.pow(10, 5);
let initialized = false;

//Objects
camera.position.set(0, 500, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

//Loader
const loader = new THREE.TextureLoader();

//Planet Spheres
const sphereGeometry = new THREE.SphereGeometry(1, 100, 100);

//Sun
const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.set(10, 10, 10);
models.push(sun);


const mercuryAxis = new THREE.Group();
scene.add(mercuryAxis);
models.push(mercuryAxis);


const venusAxis = new THREE.Group();
scene.add(venusAxis);
models.push(venusAxis);

const earthAxis = new THREE.Group();
scene.add(earthAxis);
models.push(earthAxis);

const marsAxis = new THREE.Group();
scene.add(marsAxis);
models.push(marsAxis);

earthAxis.add(sun);

const starsAxis = new THREE.Group();
scene.add(starsAxis);
models.push(starsAxis);

//Mercury
const mercOrbit = new THREE.Object3D();
mercOrbit.position.x = 38;
const mercMaterial = new THREE.MeshPhongMaterial({
	color: 0x444444,
	emissive: 0x112244,
});
const mercury = new THREE.Mesh(sphereGeometry, mercMaterial);
mercury.scale.set(2 / 3, 2 / 3, 2 / 3);
mercuryAxis.add(mercOrbit);
mercOrbit.add(mercury);

//Venus
const venusOrbit = new THREE.Object3D();
venusOrbit.position.x = 72;
const venusMaterial = new THREE.MeshPhongMaterial({
	color: 0x7c7c7c,
	emissive: 0x112244,
});
const venus = new THREE.Mesh(sphereGeometry, venusMaterial);
venus.scale.set(2, 2, 2);
venusAxis.add(venusOrbit);
venusOrbit.add(venus);

//Earth
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 100;
earthOrbit.rotateY(Math.PI / 18);
let earthMaterial = new THREE.MeshPhongMaterial({
	color: 0x006cfa,
	emissive: 0x112244,
});

const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.scale.set(2, 2, 2);
earthAxis.add(earthOrbit);
earthOrbit.add(earth);
models.push(earthAxis)

//Moon
const moonOrbit = new THREE.Object3D();
moonOrbit.position.y = 5;
const moonMaterial = new THREE.MeshPhongMaterial({
	color: 0xfffee2,
	emissive: 0xfffee2,
});
const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.set(0.5, 0.5, 0.5);
earthOrbit.add(moonOrbit);
moonOrbit.add(moon);
models.push(moonOrbit);

//Mars
const marsOrbit = new THREE.Object3D();
marsOrbit.position.x = 160;
const marsMat = new THREE.MeshPhongMaterial({
	color: 0xb93804,
	emissive: 0x112244,
});
const mars = new THREE.Mesh(sphereGeometry, marsMat);
marsAxis.add(marsOrbit);
marsOrbit.add(mars);

//Stars
(function () {
	function getLocation() {
		return (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 300 + 75);
	}
	const material = new THREE.MeshPhongMaterial({ emissive: 0xffffff });
	for (let i = 0; i < 100; ++i) {
		const star = new THREE.Mesh(sphereGeometry, material);
		const starsOrbit = new THREE.Object3D();
		star.position.set(getLocation(), getLocation(), getLocation());
		starsAxis.add(starsOrbit);
		starsOrbit.add(star);
	}
})();


//Satellite
loadModel(satellite_model, material, "satellite")
// ---YOUR CODE ENDS HERE---

let notOver = true;
function animate(time) {
	requestAnimationFrame( animate );
	if(numModelsLoaded = numModelsExpected) {	// all models have been loaded
		if(!initialized) {
			initialized = true;
			moonOrbit.add(models["satellite"])
			models["satellite"].position.y = 3
			// construct the scene by adding models
		}
		// animate the scene
		// ===YOUR CODE STARTS HERE===
		function calcAngularVelocity(mass, dist) {
			return Math.sqrt((G * mass) / Math.pow(dist, 3));
		}

		const omega_earth = calcAngularVelocity(Ms, Dse);
		const omega_moon = calcAngularVelocity(Me, Dem);
		const omega_mars = calcAngularVelocity(Ms, Dsm);
		const omega_merc = calcAngularVelocity(Ms, Dsmerc);
		const omega_venus = calcAngularVelocity(Ms, Dsv);
		// const omega_asteroid_avg = calcAngularVelocity(Ms, (Dse * 370) / 100);

		time *= 0.0005;
		// let time = 1;
			if (notOver && camera.position.y > 120) {
				pan(camera);
			}
			// console.log(models)
			if (camera.position.y < 120) notOver = false;
			earthAxis.rotation.z = omega_earth * time*animation_speed;
			earthOrbit.rotation.z = omega_moon * time*animation_speed;
			models["satellite"].rotation.z = omega_moon * 1.5 * time*animation_speed;
			marsAxis.rotation.z = omega_mars * time*animation_speed;
			mercuryAxis.rotation.z = omega_merc * time*animation_speed;
			venusAxis.rotation.z = omega_venus * time*animation_speed;
			starsAxis.rotation.z = 0.5*time*animation_speed;
			// asteroidAxis.rotation.z = omega_asteroid_avg * time;

		// ---YOUR CODE ENDS HERE---
	}
	light0.position.set(camera.position.x, camera.position.y, camera.position.z); // light0 always follows camera position
	renderer.render(scene, camera);
}

animate();

function onKeyDown(event) {
	switch(event.key) {
		case 'w':
		case 'W':
			material.wireframe = !material.wireframe;
			break;
		case '=':
		case '+':
			animation_speed += 0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case '-':
		case '_':
			if(animation_speed>0) animation_speed-=0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case 'r':
		case 'R':
			orbit.reset();
			break;
	}
}

window.addEventListener('keydown', onKeyDown, false); // as key control if you need
