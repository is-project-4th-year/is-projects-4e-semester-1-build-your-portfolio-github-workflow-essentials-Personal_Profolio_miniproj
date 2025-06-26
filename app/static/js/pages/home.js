import * as THREE from 'three';
import { OrbitControls } from 'orbitControls';
import { FontLoader } from 'three/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/jsm/geometries/TextGeometry.js';

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
resizeRenderer();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // white background

// Responsive camera setup
let camera = new THREE.PerspectiveCamera(45, getAspectRatio(), 0.1, 2000);
setCameraPosition();

// Add OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.enableZoom = true;
controls.enablePan = false;

// Add ambient and directional light for 3D effect
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(0, 1, 2);
scene.add(dirLight);

let letterMeshes = [];

// Load font and create 3D text
const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.150.1/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const text = 'eugeneikonya';
    const size = getTextSize();
    
    // Create individual letters
    let xOffset = 0;
    for (let i = 0; i < text.length; i++) {
        const letterGeometry = new TextGeometry(text[i], {
            font: font,
            size: size,
            height: size * 0.3,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: size * 0.05,
            bevelSize: size * 0.03,
            bevelOffset: 0,
            bevelSegments: 5
        });
        
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            metalness: 0.3, 
            roughness: 0.4 
        });
        
        const letterMesh = new THREE.Mesh(letterGeometry, material);
        
        // Calculate letter width and position
        const boundingBox = new THREE.Box3().setFromObject(letterMesh);
        const letterWidth = boundingBox.max.x - boundingBox.min.x;
        
        letterMesh.position.x = xOffset;
        xOffset += letterWidth + size * 0.1; // Add spacing between letters
        
        letterMesh.userData = {
            originalY: letterMesh.position.y,
            originalRotation: letterMesh.rotation.y
        };
        
        scene.add(letterMesh);
        letterMeshes.push(letterMesh);
    }
    
    // Center all letters
    const totalWidth = xOffset;
    letterMeshes.forEach(mesh => {
        mesh.position.x -= totalWidth / 2;
    });
    
    animate();
});

// Add color change functionality
document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', () => {
        const color = parseInt(button.dataset.color);
        letterMeshes.forEach(mesh => {
            mesh.material.color.setHex(color);
        });
    });
});

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

canvas.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(letterMeshes);

    if (intersects.length > 0) {
        const letter = intersects[0].object;
        animateLetter(letter);
    }
});

function animateLetter(letter) {
    const jumpHeight = 2;
    const jumpDuration = 500;
    const rotationAmount = Math.PI * 2;
    
    const startY = letter.position.y;
    const startRotation = letter.rotation.y;
    const startTime = Date.now();
    
    function jumpAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / jumpDuration;
        
        if (progress < 1) {
            letter.position.y = startY + jumpHeight * Math.sin(progress * Math.PI);
            letter.rotation.y = startRotation + rotationAmount * progress;
            requestAnimationFrame(jumpAnimation);
        } else {
            letter.position.y = startY;
            letter.rotation.y = startRotation;
        }
    }
    
    jumpAnimation();
}

function animate() {
    requestAnimationFrame(animate);

    // Add subtle twitching animation
    const time = Date.now() * 0.001; // Convert to seconds
    letterMeshes.forEach((letter, i) => {
        // Subtle rotation based on time and letter position
        const rotationSpeed = 1.5;
        const rotationAmount = 0.03; // About 1.7 degrees
        letter.rotation.z = Math.sin(time * rotationSpeed + i * 0.3) * rotationAmount;
    });

    controls.update();
    renderer.render(scene, camera);
}

function getAspectRatio() {
    const width = window.innerWidth >= 768 ? window.innerWidth / 2 : window.innerWidth;
    const height = window.innerHeight * 0.5; // 50vh
    return width / height;
}

// Responsive resize
window.addEventListener('resize', () => {
    resizeRenderer();
    setCameraPosition();
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();
});

function resizeRenderer() {
    const width = window.innerWidth >= 768 ? window.innerWidth / 2 : window.innerWidth;
    const height = window.innerHeight * 0.5; // 50vh
    renderer.setSize(width, height, false);
}

function setCameraPosition() {
    camera.position.set(0, 0, getCameraZ());
}

function getCameraZ() {
    const width = window.innerWidth >= 768 ? window.innerWidth / 2 : window.innerWidth;
    const base = Math.max(width, window.innerHeight * 0.5);
    // Keep desktop closer, mobile zoomed out
    return base * (window.innerWidth >= 768 ? 0.65 : 0.85);
}

function getTextSize() {
    const width = window.innerWidth >= 768 ? window.innerWidth / 2 : window.innerWidth;
    const min = Math.min(width, window.innerHeight * 0.5);
    // Adjust text size accordingly
    return Math.max(4, min / (window.innerWidth >= 768 ? 16 : 16));
}