import { Plane } from './modules/Plane.js';
import { City } from './modules/City.js';
import { UFOManager } from './modules/UFO.js';
import { WeaponSystem, ExplosionSystem } from './modules/Weapon.js';
import { TouchControls } from './modules/TouchControls.js';
import { AudioManager } from './modules/AudioManager.js';

class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.plane = null;
        this.city = null;
        this.ufoManager = null;
        this.weaponSystem = null;
        this.explosionSystem = null;
        this.touchControls = null;
        this.audioManager = null;
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            fire: false
        };
        this.keys = {};
        this.gameTime = 0;
        this.score = 0;
        this.lastFrameTime = performance.now();
        this.cameraMode = 'follow'; // 'follow' or 'orbit'
        
        // Camera movement state
        this.cameraRotation = {
            yaw: 0,
            pitch: 0,
            targetYaw: 0,
            targetPitch: 0
        };
        
        // Don't auto-init, let it be called externally
    }

    async init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.createCity();
        this.createPlane();
        this.createCombatSystems();
        this.setupControls();
        await this.setupAudio();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    async setupAudio() {
        this.audioManager = new AudioManager();
        await this.audioManager.init();
        
        // Update touch controls with audio manager
        if (this.touchControls) {
            this.touchControls.audioManager = this.audioManager;
        }
        
        // Add audio control buttons to UI
        this.createAudioControls();
    }

    createAudioControls() {
        const audioControls = document.createElement('div');
        audioControls.id = 'audio-controls';
        audioControls.innerHTML = `
            <button id="toggle-music" class="audio-control-btn" title="Toggle Music">🎵</button>
            <button id="toggle-engine" class="audio-control-btn" title="Toggle Engine Sound">🚁</button>
        `;
        
        document.getElementById('ui-overlay').appendChild(audioControls);
        
        // Setup audio control handlers
        document.getElementById('toggle-music').addEventListener('click', () => {
            this.audioManager.toggleMusic();
            this.audioManager.playSound('buttonClick');
        });
        
        document.getElementById('toggle-engine').addEventListener('click', () => {
            const btn = document.getElementById('toggle-engine');
            if (this.audioManager.enginePlaying) {
                this.audioManager.stopEngineSound();
                btn.classList.remove('active');
            } else {
                this.audioManager.startEngineSound();
                btn.classList.add('active');
            }
            this.audioManager.playSound('buttonClick');
        });
    }

    createScene() {
        this.scene = new THREE.Scene();
        
        // Enhanced sky gradient background
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // Create gradient from light blue to darker blue
        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#87ceeb'); // Light sky blue
        gradient.addColorStop(0.6, '#4682b4'); // Steel blue
        gradient.addColorStop(1, '#2f4f4f'); // Dark slate gray
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.scene.background = texture;
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
        // Enhanced ambient light for better overall illumination
        const ambientLight = new THREE.AmbientLight(0x4a4a5a, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light (sun) - warmer tone
        const directionalLight = new THREE.DirectionalLight(0xffeeaa, 1.2);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.bias = -0.0001;
        this.scene.add(directionalLight);
        
        // Secondary fill light from opposite direction
        const fillLight = new THREE.DirectionalLight(0x6699ff, 0.4);
        fillLight.position.set(-8, 15, -8);
        this.scene.add(fillLight);
        
        // Atmospheric hemisphere light for realistic sky lighting
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x2d3748, 0.6);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);
        
        // Add some atmospheric fog for depth
        this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
    }

    createCity() {
        this.city = new City();
        this.scene.add(this.city.getGroup());
    }

    createPlane() {
        this.plane = new Plane();
        this.scene.add(this.plane.getGroup());
    }

    createCombatSystems() {
        // Initialize UFO system
        this.ufoManager = new UFOManager();
        
        // Initialize weapon system
        this.weaponSystem = new WeaponSystem();
        
        // Initialize explosion system
        this.explosionSystem = new ExplosionSystem();
        
        // Spawn initial UFOs
        for (let i = 0; i < 3; i++) {
            const ufo = this.ufoManager.spawnUFO();
            this.scene.add(ufo.getGroup());
        }
    }

    setupControls() {
        // Touch controls (will be updated with audioManager after audio setup)
        this.touchControls = new TouchControls();
        
        // Prevent default behavior for control keys (still needed for any remaining keyboard input)
        window.addEventListener('keydown', (event) => {
            if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'Space', 'KeyC'].includes(event.code)) {
                event.preventDefault();
            }
        });
     }

     updateUI() {
         if (this.plane) {
             const flightData = this.plane.getFlightData();
             
             // Update speed with color coding
             const speedElement = document.getElementById('speed');
             if (speedElement) {
                 speedElement.textContent = flightData.speed;
                 speedElement.className = 'value ';
                 if (flightData.speed < 20) {
                     speedElement.className += 'speed-low';
                 } else if (flightData.speed > 40) {
                     speedElement.className += 'speed-high';
                 } else {
                     speedElement.className += 'speed-normal';
                 }
             }
             
             // Update altitude
             const altitudeElement = document.getElementById('altitude');
             if (altitudeElement) {
                 altitudeElement.textContent = flightData.altitude;
             }
         }
         
         // Update score display
         const scoreElement = document.getElementById('score');
         if (scoreElement) {
             scoreElement.textContent = this.score;
         }
         
         // Update UFO count
         const ufoCountElement = document.getElementById('ufo-count');
         if (ufoCountElement && this.ufoManager) {
             ufoCountElement.textContent = this.ufoManager.getUFOs().length;
         }
     }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Calculate delta time for consistent physics
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;
        
        this.gameTime += 1;
        
        // Update controls from touch input
        if (this.touchControls) {
            this.controls = this.touchControls.getControls();
            
            // Handle camera movement
            const cameraMovement = this.touchControls.getCameraMovement();
            if (cameraMovement.isActive) {
                this.cameraRotation.targetYaw += cameraMovement.deltaX;
                this.cameraRotation.targetPitch += cameraMovement.deltaY;
                
                // Clamp pitch to prevent flipping
                this.cameraRotation.targetPitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.cameraRotation.targetPitch));
            }
            
            // Handle camera reset
            if (this.touchControls.consumeCameraReset()) {
                this.cameraRotation.targetYaw = 0;
                this.cameraRotation.targetPitch = 0;
                console.log('Camera reset to default view');
            }
            
            // Smooth camera rotation interpolation
            this.cameraRotation.yaw += (this.cameraRotation.targetYaw - this.cameraRotation.yaw) * 0.1;
            this.cameraRotation.pitch += (this.cameraRotation.targetPitch - this.cameraRotation.pitch) * 0.1;
        }
        
        // Update plane with controls and delta time
        if (this.plane) {
            this.plane.update(this.controls, deltaTime);
            this.updateCamera();
            
            // Update engine sound based on plane speed
            if (this.audioManager && this.audioManager.enginePlaying) {
                const flightData = this.plane.getFlightData();
                this.audioManager.updateEngineSound(flightData.speed);
            }
            
            // Handle firing
            if (this.controls.fire) {
                const projectile = this.weaponSystem.fire(
                    this.plane.getGroup().position,
                    this.plane.getGroup().rotation
                );
                if (projectile) {
                    this.scene.add(projectile.getMesh());
                    // Play gunfire sound
                    if (this.audioManager) {
                        this.audioManager.playSound('gunfire');
                    }
                }
            }
        }
        
        // Update UFOs
        if (this.ufoManager) {
            this.ufoManager.update(this.gameTime, this.plane ? this.plane.getGroup().position : null);
            
            // Add new UFOs to scene
            this.ufoManager.getUFOs().forEach(ufo => {
                if (!ufo.getGroup().parent) {
                    this.scene.add(ufo.getGroup());
                }
            });
        }
        
        // Update weapon system
        if (this.weaponSystem) {
            this.weaponSystem.update();
        }
        
        // Update explosion system
        if (this.explosionSystem) {
            this.explosionSystem.update();
            
            // Add explosion particles to scene
            this.explosionSystem.getExplosions().forEach(explosion => {
                explosion.getParticles().forEach(particle => {
                    if (!particle.mesh.parent) {
                        this.scene.add(particle.mesh);
                    }
                });
            });
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Update UI every frame
        this.updateUI();
        
        // Update city (could animate lights, etc.)
        if (this.city) {
            this.city.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateCamera() {
        const planePosition = this.plane.getGroup().position;
        const planeRotation = this.plane.getGroup().rotation;
        
        // Enhanced follow camera with touch-based free look
        // Camera offset behind and above plane
        const baseOffset = new THREE.Vector3(0, 8, -25);
        
        // Apply plane's yaw rotation to base offset
        const rotatedOffset = baseOffset.clone();
        rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), planeRotation.y);
        
        // Apply additional camera rotation from touch input
        const cameraYawRotation = new THREE.Matrix4().makeRotationY(this.cameraRotation.yaw);
        const cameraPitchRotation = new THREE.Matrix4().makeRotationX(this.cameraRotation.pitch);
        const cameraRotationMatrix = new THREE.Matrix4().multiplyMatrices(cameraYawRotation, cameraPitchRotation);
        
        rotatedOffset.applyMatrix4(cameraRotationMatrix);
        
        // Target camera position
        const targetPosition = planePosition.clone().add(rotatedOffset);
        
        // Smooth camera movement
        this.camera.position.lerp(targetPosition, 0.08);
        
        // Look-at target with camera rotation applied
        const lookAtTarget = planePosition.clone();
        lookAtTarget.y += 2; // Look slightly above the plane
        
        // Add forward offset based on plane direction and camera rotation
        const forwardOffset = new THREE.Vector3(0, 0, 5);
        forwardOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), planeRotation.y);
        forwardOffset.applyMatrix4(cameraRotationMatrix);
        lookAtTarget.add(forwardOffset);
        
        this.camera.lookAt(lookAtTarget);
    }

    checkCollisions() {
        if (!this.ufoManager || !this.weaponSystem) return;
        
        const hits = this.ufoManager.checkCollisions(this.weaponSystem.getProjectiles());
        
        hits.forEach(hit => {
            // Create explosion at UFO position
            const explosion = this.explosionSystem.createExplosion(hit.position);
            
            // Play explosion and UFO hit sounds
            if (this.audioManager) {
                this.audioManager.playSound('explosion');
                this.audioManager.playSound('ufoHit');
            }
            
            // Remove UFO from scene
            this.scene.remove(hit.ufo.getGroup());
            hit.ufo.takeDamage();
            
            // Remove projectile from scene
            this.scene.remove(hit.projectile.getMesh());
            hit.projectile.destroy();
            
            // Increase score
            this.score += 100;
            this.updateUI();
            
            console.log(`UFO destroyed! Score: ${this.score}`);
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    await game.init();
}); 