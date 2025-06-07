import { Plane } from './modules/Plane.js';
import { City } from './modules/City.js';

class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.plane = null;
        this.city = null;
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.keys = {};
        
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.createCity();
        this.createPlane();
        this.setupControls();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 100);
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Camera will follow the plane, initial position
        this.camera.position.set(0, 20, -20);
        this.camera.lookAt(0, 15, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('game-canvas'),
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    createLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
    }

    createCity() {
        this.city = new City();
        this.scene.add(this.city.getGroup());
    }

    createPlane() {
        this.plane = new Plane();
        this.scene.add(this.plane.getGroup());
    }

    setupControls() {
        // Keyboard controls for plane movement
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            this.updateControlsFromKeys();
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
            this.updateControlsFromKeys();
        });
        
        // Prevent default behavior for control keys
        window.addEventListener('keydown', (event) => {
            if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE'].includes(event.code)) {
                event.preventDefault();
            }
        });
    }
    
    updateControlsFromKeys() {
        this.controls.forward = this.keys['KeyW'] || false;
        this.controls.backward = this.keys['KeyS'] || false;
        this.controls.left = this.keys['KeyA'] || false;
        this.controls.right = this.keys['KeyD'] || false;
        this.controls.up = this.keys['KeyQ'] || false;
        this.controls.down = this.keys['KeyE'] || false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update plane with controls
        if (this.plane) {
            this.plane.update(this.controls);
            this.updateCamera();
        }
        
        // Update city (could animate lights, etc.)
        if (this.city) {
            this.city.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateCamera() {
        // Follow the plane from behind and slightly above
        const planePosition = this.plane.getGroup().position;
        const planeRotation = this.plane.getGroup().rotation;
        
        // Calculate camera position behind the plane
        const cameraOffset = new THREE.Vector3(0, 8, -15);
        cameraOffset.applyEuler(planeRotation);
        
        // Smoothly move camera to follow plane
        const targetPosition = planePosition.clone().add(cameraOffset);
        this.camera.position.lerp(targetPosition, 0.1);
        
        // Look at the plane
        const lookAtTarget = planePosition.clone();
        lookAtTarget.y += 2; // Look slightly above the plane
        this.camera.lookAt(lookAtTarget);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 