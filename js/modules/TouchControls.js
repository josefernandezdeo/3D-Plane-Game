export class TouchControls {
    constructor() {
        this.touchInputs = {
            pitch: 0,    // -1 to 1 (up/down)
            roll: 0,     // -1 to 1 (left/right) 
            speedUp: false,
            speedDown: false,
            fire: false,
            camera: false
        };
        
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };
        this.joystickRadius = 60;
        this.joystickMaxDistance = 50;
        
        this.buttons = {};
        
        this.init();
    }
    
    init() {
        this.createTouchUI();
        this.setupTouchEvents();
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
            
            <!-- Camera Toggle -->
            <div id="camera-container">
                <button id="camera-btn" class="control-btn camera-btn">📷</button>
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
        }, () => {
            this.touchInputs.speedUp = false;
        });
        
        this.setupButton('speedDown', () => {
            this.touchInputs.speedDown = true;
        }, () => {
            this.touchInputs.speedDown = false;
        });
        
        // Fire button
        this.setupButton('fire', () => {
            this.touchInputs.fire = true;
        }, () => {
            this.touchInputs.fire = false;
        });
        
        // Camera button (toggle on press)
        this.buttons.camera.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchInputs.camera = true;
        });
        
        this.buttons.camera.addEventListener('click', (e) => {
            e.preventDefault();
            this.touchInputs.camera = true;
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
    
    consumeCameraToggle() {
        const wasPressed = this.touchInputs.camera;
        this.touchInputs.camera = false;
        return wasPressed;
    }
} 