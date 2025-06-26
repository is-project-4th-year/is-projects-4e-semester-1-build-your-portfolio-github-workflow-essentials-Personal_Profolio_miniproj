import * as THREE from 'three';
import { FontLoader } from 'three/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/jsm/geometries/TextGeometry.js';

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
resizeRenderer();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // white background

// Responsive camera setup
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
setCameraPosition();

// Add ambient and directional light for 3D effect
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(0, 1, 2);
scene.add(dirLight);

let textMesh;

// Load font and create 3D text
const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.150.1/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const text = 'eugeneikonya';
    const size = getTextSize();
    const geometry = new TextGeometry(text, {
        font: font,
        size: size,
        height: size * 0.3, // 3D depth
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: size * 0.05,
        bevelSize: size * 0.03,
        bevelOffset: 0,
        bevelSegments: 5
    });
    geometry.center();
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.4 });
    textMesh = new THREE.Mesh(geometry, material);
    scene.add(textMesh);
    animate();
});

function animate() {
    requestAnimationFrame(animate);
    // Subtle rotation for 3D effect
    if (textMesh) {
        textMesh.rotation.y = Math.sin(window.scrollY * 0.002) * 0.2;
        textMesh.rotation.x = Math.cos(window.scrollY * 0.001) * 0.1;
    }
    renderer.render(scene, camera);
}

// Responsive resize
window.addEventListener('resize', () => {
    resizeRenderer();
    setCameraPosition();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Parallax/scroll effect
window.addEventListener('scroll', () => {
    // Move camera z based on scroll for parallax
    camera.position.z = getCameraZ();
});

function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
}

function setCameraPosition() {
    camera.position.set(0, 0, getCameraZ());
}

function getCameraZ() {
    // Adjust camera distance based on window size for best fit
    const base = Math.max(window.innerWidth, window.innerHeight);
    return base * 0.7;
}

function getTextSize() {
    // Dynamically size text for fit
    const min = Math.min(window.innerWidth, window.innerHeight);
    return Math.max(6, min / 18);
}