export class TouchControls {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
        this.touchInputs = {
            pitch: 0,    // -1 to 1 (up/down)
            roll: 0,     // -1 to 1 (left/right) 
            speedUp: false,
            speedDown: false,
            fire: false,
            cameraReset: false
        };
        
        // Camera movement
        this.cameraRotation = {
            deltaX: 0,
            deltaY: 0,
            isActive: false
        };
        
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };
        this.joystickRadius = 60;
        this.joystickMaxDistance = 50;
        
        // Camera touch tracking
        this.cameraTouch = {
            startX: 0,
            startY: 0,
            lastX: 0,
            lastY: 0,
            active: false
        };
        
        this.buttons = {};
        
        this.init();
    }
    
    init() {
        this.createTouchUI();
        this.setupTouchEvents();
        this.setupCameraTouch();
    }
    
    createTouchUI() {
        // Create mobile controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'mobile-controls';
        controlsContainer.innerHTML = `
            <!-- Virtual Joystick -->
            <div id="joystick-container">
                <div id="joystick-base">
                    <div id="joystick-stick"></div>
                </div>
                <div id="joystick-label">Pitch/Roll</div>
            </div>
            
            <!-- Speed Controls -->
            <div id="speed-controls">
                <button id="speed-up-btn" class="control-btn speed-btn">+</button>
                <div class="speed-label">Speed</div>
                <button id="speed-down-btn" class="control-btn speed-btn">-</button>
            </div>
            
            <!-- Fire Button -->
            <div id="fire-container">
                <button id="fire-btn" class="control-btn fire-btn">FIRE</button>
            </div>
            
            <!-- Camera Reset Button -->
            <div id="camera-container">
                <button id="camera-btn" class="control-btn camera-btn">🔄</button>
            </div>
            
            <!-- Camera instructions -->
            <div id="camera-instructions">
                <div class="instruction-text">Drag to look around</div>
            </div>
        `;
        
        document.body.appendChild(controlsContainer);
        
        // Store button references
        this.buttons = {
            speedUp: document.getElementById('speed-up-btn'),
            speedDown: document.getElementById('speed-down-btn'),
            fire: document.getElementById('fire-btn'),
            camera: document.getElementById('camera-btn')
        };
        
        this.joystickBase = document.getElementById('joystick-base');
        this.joystickStick = document.getElementById('joystick-stick');
        this.joystickContainer = document.getElementById('joystick-container');
    }
    
    setupTouchEvents() {
        // Joystick events
        this.setupJoystickEvents();
        
        // Button events
        this.setupButtonEvents();
    }
    
    setupCameraTouch() {
        // Camera movement via screen touch (excluding control areas)
        const gameCanvas = document.getElementById('game-canvas');
        
        const isTouchInControlArea = (x, y) => {
            // Check if touch is in any control area
            const joystick = this.joystickContainer.getBoundingClientRect();
            const speedControls = document.getElementById('speed-controls').getBoundingClientRect();
            const fireButton = document.getElementById('fire-container').getBoundingClientRect();
            const cameraButton = document.getElementById('camera-container').getBoundingClientRect();
            
            return (
                (x >= joystick.left && x <= joystick.right && y >= joystick.top && y <= joystick.bottom) ||
                (x >= speedControls.left && x <= speedControls.right && y >= speedControls.top && y <= speedControls.bottom) ||
                (x >= fireButton.left && x <= fireButton.right && y >= fireButton.top && y <= fireButton.bottom) ||
                (x >= cameraButton.left && x <= cameraButton.right && y >= cameraButton.top && y <= cameraButton.bottom)
            );
        };
        
        gameCanvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (!isTouchInControlArea(touch.clientX, touch.clientY)) {
                this.cameraTouch.active = true;
                this.cameraTouch.startX = touch.clientX;
                this.cameraTouch.startY = touch.clientY;
                this.cameraTouch.lastX = touch.clientX;
                this.cameraTouch.lastY = touch.clientY;
                this.cameraRotation.isActive = true;
                e.preventDefault();
            }
        });
        
        gameCanvas.addEventListener('touchmove', (e) => {
            if (this.cameraTouch.active && e.touches.length > 0) {
                const touch = e.touches[0];
                
                // Calculate delta movement
                const deltaX = touch.clientX - this.cameraTouch.lastX;
                const deltaY = touch.clientY - this.cameraTouch.lastY;
                
                // Apply sensitivity and store for camera rotation
                const sensitivity = 0.003;
                this.cameraRotation.deltaX = deltaX * sensitivity;
                this.cameraRotation.deltaY = deltaY * sensitivity;
                
                this.cameraTouch.lastX = touch.clientX;
                this.cameraTouch.lastY = touch.clientY;
                
                e.preventDefault();
            }
        });
        
        gameCanvas.addEventListener('touchend', (e) => {
            this.cameraTouch.active = false;
            this.cameraRotation.isActive = false;
            this.cameraRotation.deltaX = 0;
            this.cameraRotation.deltaY = 0;
            e.preventDefault();
        });
        
        // Mouse events for desktop testing
        let mouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        
        gameCanvas.addEventListener('mousedown', (e) => {
            mouseDown = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            this.cameraRotation.isActive = true;
            e.preventDefault();
        });
        
        gameCanvas.addEventListener('mousemove', (e) => {
            if (mouseDown) {
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                
                const sensitivity = 0.003;
                this.cameraRotation.deltaX = deltaX * sensitivity;
                this.cameraRotation.deltaY = deltaY * sensitivity;
                
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                e.preventDefault();
            }
        });
        
        gameCanvas.addEventListener('mouseup', (e) => {
            mouseDown = false;
            this.cameraRotation.isActive = false;
            this.cameraRotation.deltaX = 0;
            this.cameraRotation.deltaY = 0;
            e.preventDefault();
        });
    }
    
    setupJoystickEvents() {
        const handleJoystickStart = (clientX, clientY) => {
            const rect = this.joystickBase.getBoundingClientRect();
            this.joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            this.joystickActive = true;
            this.joystickBase.classList.add('active');
        };
        
        const handleJoystickMove = (clientX, clientY) => {
            if (!this.joystickActive) return;
            
            const deltaX = clientX - this.joystickCenter.x;
            const deltaY = clientY - this.joystickCenter.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Limit to max distance
            const limitedDistance = Math.min(distance, this.joystickMaxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            const stickX = Math.cos(angle) * limitedDistance;
            const stickY = Math.sin(angle) * limitedDistance;
            
            // Update visual position
            this.joystickStick.style.transform = `translate(${stickX}px, ${stickY}px)`;
            
            // Convert to control inputs (-1 to 1)
            this.touchInputs.roll = stickX / this.joystickMaxDistance;    // Left/Right
            this.touchInputs.pitch = -(stickY / this.joystickMaxDistance); // Up/Down (inverted)
        };
        
        const handleJoystickEnd = () => {
            this.joystickActive = false;
            this.joystickBase.classList.remove('active');
            this.joystickStick.style.transform = 'translate(0, 0)';
            this.touchInputs.roll = 0;
            this.touchInputs.pitch = 0;
        };
        
        // Touch events
        this.joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleJoystickStart(touch.clientX, touch.clientY);
        });
        
        this.joystickBase.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleJoystickMove(touch.clientX, touch.clientY);
            }
        });
        
        this.joystickBase.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleJoystickEnd();
        });
        
        // Mouse events for desktop testing
        this.joystickBase.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleJoystickStart(e.clientX, e.clientY);
        });
        
        document.addEventListener('mousemove', (e) => {
            handleJoystickMove(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseup', () => {
            handleJoystickEnd();
        });
    }
    
    setupButtonEvents() {
        // Speed buttons
        this.setupButton('speedUp', () => {
            this.touchInputs.speedUp = true;
            if (this.audioManager) this.audioManager.playSound('buttonClick');
        }, () => {
            this.touchInputs.speedUp = false;
        });
        
        this.setupButton('speedDown', () => {
            this.touchInputs.speedDown = true;
            if (this.audioManager) this.audioManager.playSound('buttonClick');
        }, () => {
            this.touchInputs.speedDown = false;
        });
        
        // Fire button
        this.setupButton('fire', () => {
            this.touchInputs.fire = true;
        }, () => {
            this.touchInputs.fire = false;
        });
        
        // Camera reset button
        this.buttons.camera.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchInputs.cameraReset = true;
            if (this.audioManager) this.audioManager.playSound('buttonClick');
        });
        
        this.buttons.camera.addEventListener('click', (e) => {
            e.preventDefault();
            this.touchInputs.cameraReset = true;
            if (this.audioManager) this.audioManager.playSound('buttonClick');
        });
    }
    
    setupButton(buttonName, onStart, onEnd) {
        const button = this.buttons[buttonName];
        
        // Touch events
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.classList.add('pressed');
            onStart();
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.classList.remove('pressed');
            onEnd();
        });
        
        // Mouse events for desktop testing
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            button.classList.add('pressed');
            onStart();
        });
        
        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            button.classList.remove('pressed');
            onEnd();
        });
    }
    
    getControls() {
        // Convert touch inputs to keyboard-style controls
        return {
            forward: this.touchInputs.pitch > 0.2,     // Pitch up
            backward: this.touchInputs.pitch < -0.2,   // Pitch down
            left: this.touchInputs.roll < -0.2,        // Roll left
            right: this.touchInputs.roll > 0.2,        // Roll right
            up: this.touchInputs.speedUp,              // Speed up
            down: this.touchInputs.speedDown,          // Speed down
            fire: this.touchInputs.fire                // Fire
        };
    }
    
    getRawInputs() {
        return this.touchInputs;
    }
    
    getCameraMovement() {
        return this.cameraRotation;
    }
    
    consumeCameraReset() {
        const wasPressed = this.touchInputs.cameraReset;
        this.touchInputs.cameraReset = false;
        return wasPressed;
    }
} 