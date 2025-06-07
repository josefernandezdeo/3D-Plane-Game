export class Plane {
    constructor() {
        this.group = new THREE.Group();
        this.propeller = null;
        this.createPlane();
    }

    createPlane() {
        // Create all plane components
        this.createFuselage();
        this.createWings();
        this.createTail();
        this.createPropeller();
        
        // Position the plane above and outside city, approaching inward
        this.group.position.set(0, 25, -60);
        
        // Enhanced flight physics properties
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 15; // Initial airspeed (slower)
        this.minSpeed = 5;
        this.maxSpeed = 25;
        
        // Control sensitivity parameters
        this.pitchSensitivity = 0.8;
        this.turnSensitivity = 1.5;
        this.rollSensitivity = 2.0;
        
        // Flight state
        this.pitch = 0; // -60° to +60° limit
        this.roll = 0;  // For banking
        this.yaw = 0;   // Natural yaw from roll
        this.maxPitchAngle = Math.PI / 3; // 60 degrees
        this.maxBankAngle = Math.PI / 4;  // 45 degrees
        
        // Auto-leveling
        this.autoLevelStrength = 0.02;
        
        // Initial slight nose-down attitude
        this.pitch = -0.1; // Slight nose down for natural descent approach
        this.group.rotation.x = this.pitch;
    }

    createFuselage() {
        // Main body - more streamlined fighter fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(0.25, 0.5, 5.5, 12);
        const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5d23 }); // Military green
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        
        // Rotate to align with Z-axis (nose forward)
        fuselage.rotation.x = Math.PI / 2;
        fuselage.position.z = 0;
        
        this.group.add(fuselage);
        
        // Cockpit canopy
        const canopyGeometry = new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        const canopyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEEB, 
            transparent: true, 
            opacity: 0.3 
        });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(0, 0.2, 0.5);
        this.group.add(canopy);
    }

    createWings() {
        // Main wings - low-wing fighter configuration
        const wingGeometry = new THREE.BoxGeometry(7, 0.3, 1.8);
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5d23 }); // Military green
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        
        // Position wings lower on fuselage (low-wing configuration)
        wings.position.set(0, -0.3, 0);
        
        this.group.add(wings);
        
        // Wing tips - slightly angled
        const wingTipGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.8);
        const wingTipMaterial = new THREE.MeshLambertMaterial({ color: 0x3d4a1c });
        
        const leftWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
        leftWingTip.position.set(-3.8, -0.3, 0);
        leftWingTip.rotation.z = 0.2;
        this.group.add(leftWingTip);
        
        const rightWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
        rightWingTip.position.set(3.8, -0.3, 0);
        rightWingTip.rotation.z = -0.2;
        this.group.add(rightWingTip);
    }

    createTail() {
        // Vertical stabilizer (tail fin) - larger and more realistic
        const verticalStabGeometry = new THREE.BoxGeometry(0.25, 2, 1.2);
        const verticalStabMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5d23 });
        const verticalStabilizer = new THREE.Mesh(verticalStabGeometry, verticalStabMaterial);
        
        verticalStabilizer.position.set(0, 0.6, -2.5);
        this.group.add(verticalStabilizer);
        
        // Horizontal stabilizer (tail wings) - positioned higher
        const horizontalStabGeometry = new THREE.BoxGeometry(3, 0.2, 0.8);
        const horizontalStabMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5d23 });
        const horizontalStabilizer = new THREE.Mesh(horizontalStabGeometry, horizontalStabMaterial);
        
        horizontalStabilizer.position.set(0, 0.1, -2.5);
        this.group.add(horizontalStabilizer);
        
        // Rudder detail
        const rudderGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.5);
        const rudderMaterial = new THREE.MeshLambertMaterial({ color: 0x3d4a1c });
        const rudder = new THREE.Mesh(rudderGeometry, rudderMaterial);
        rudder.position.set(0, 1.2, -2.8);
        this.group.add(rudder);
    }

    createPropeller() {
        // Engine cowling
        const cowlingGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 12);
        const cowlingMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
        const cowling = new THREE.Mesh(cowlingGeometry, cowlingMaterial);
        cowling.rotation.x = Math.PI / 2;
        cowling.position.set(0, 0, 2.5);
        this.group.add(cowling);
        
        // Propeller hub
        const hubGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 8);
        const hubMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        
        // Create propeller group for rotation
        this.propeller = new THREE.Group();
        
        // Rotate hub to align with Z-axis
        hub.rotation.x = Math.PI / 2;
        this.propeller.add(hub);
        
        // Propeller blades - 3 blades like WWII fighters
        const bladeGeometry = new THREE.BoxGeometry(0.08, 2.2, 0.03);
        const bladeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Wood color
        
        // Create 3 blades
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.z = (i * Math.PI * 2) / 3;
            this.propeller.add(blade);
        }
        
        // Position propeller at front of engine
        this.propeller.position.set(0, 0, 2.9);
        this.group.add(this.propeller);
        
        // Landing gear (simple)
        this.createLandingGear();
    }

    createLandingGear() {
        // Main landing gear legs
        const gearGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6);
        const gearMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Left gear
        const leftGear = new THREE.Mesh(gearGeometry, gearMaterial);
        leftGear.position.set(-1.2, -0.7, 0.5);
        this.group.add(leftGear);
        
        // Right gear
        const rightGear = new THREE.Mesh(gearGeometry, gearMaterial);
        rightGear.position.set(1.2, -0.7, 0.5);
        this.group.add(rightGear);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        
        const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        leftWheel.rotation.z = Math.PI / 2;
        leftWheel.position.set(-1.2, -1.1, 0.5);
        this.group.add(leftWheel);
        
        const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rightWheel.rotation.z = Math.PI / 2;
        rightWheel.position.set(1.2, -1.1, 0.5);
        this.group.add(rightWheel);
        
        // Tail wheel
        const tailWheelGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8);
        const tailWheel = new THREE.Mesh(tailWheelGeometry, wheelMaterial);
        tailWheel.rotation.z = Math.PI / 2;
        tailWheel.position.set(0, -0.6, -2.2);
        this.group.add(tailWheel);
    }

    update(controls, deltaTime = 1/60) {
        // Rotate propeller (slower speed)
        if (this.propeller) {
            this.propeller.rotation.z += 0.05;
        }
        
        // Handle flight controls
        if (controls) {
            this.handleControls(controls, deltaTime);
        }
        
        // Auto-leveling when no inputs
        this.autoLevel(controls, deltaTime);
        
        // Update physics
        this.updatePhysics(deltaTime);
        
        // Apply rotation using quaternions (YXZ order)
        this.applyRotation();
        
        // Update position based on velocity
        this.group.position.add(this.velocity);
        
        // Keep plane above ground
        if (this.group.position.y < 5) {
            this.group.position.y = 5;
            this.velocity.y = Math.max(0, this.velocity.y);
        }
    }
    
    handleControls(controls, deltaTime) {
        // Input normalization (-1 to 1)
        let pitchInput = 0;
        let rollInput = 0;
        let speedInput = 0;
        
        // W/S: Pitch control (±60° limit) - Fixed direction for both visual and physics
        if (controls.forward) pitchInput = 1;  // Nose up (W pulls back - positive pitch)
        if (controls.backward) pitchInput = -1; // Nose down (S pushes forward - negative pitch)
        
        // A/D: Roll control
        if (controls.left) rollInput = -1;  // Roll left
        if (controls.right) rollInput = 1;  // Roll right
        
        // Q/E: Speed control (10-50 units range)
        if (controls.up) speedInput = 1;    // Increase speed
        if (controls.down) speedInput = -1; // Decrease speed
        
        // Apply pitch control with sensitivity
        if (pitchInput !== 0) {
            this.pitch += pitchInput * this.pitchSensitivity * deltaTime;
            this.pitch = Math.max(-this.maxPitchAngle, Math.min(this.maxPitchAngle, this.pitch));
        }
        
        // Apply roll control with sensitivity
        if (rollInput !== 0) {
            this.roll += rollInput * this.rollSensitivity * deltaTime;
            this.roll = Math.max(-this.maxBankAngle, Math.min(this.maxBankAngle, this.roll));
        }
        
        // Natural yaw coupling from roll (IMPORTANT: negative sign)
        this.yaw += -this.roll * this.turnSensitivity * deltaTime;
        
                 // Speed control
         if (speedInput !== 0) {
             this.speed += speedInput * 8 * deltaTime; // 8 units/sec change rate (slower)
             this.speed = Math.max(this.minSpeed, Math.min(this.maxSpeed, this.speed));
         }
    }
    
    autoLevel(controls, deltaTime) {
        const hasInputs = controls && (controls.forward || controls.backward || controls.left || controls.right);
        
        if (!hasInputs) {
            // Auto-center pitch
            this.pitch *= (1 - this.autoLevelStrength);
            
            // Auto-level roll
            this.roll *= (1 - this.autoLevelStrength);
        }
    }
    
    updatePhysics(deltaTime) {
        // Calculate forward direction based on current orientation
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(this.group.quaternion);
        
        // Apply speed to forward vector for movement
        const speedVector = forward.multiplyScalar(this.speed * deltaTime);
        
        // Update velocity with smooth interpolation
        this.velocity.lerp(speedVector, 0.1);
        
        // Additional altitude adjustment based on pitch angle
        // When pitched up (positive pitch), gain altitude; when pitched down (negative pitch), lose altitude
        const pitchEffect = Math.sin(this.pitch) * this.speed * deltaTime * 0.5;
        this.velocity.y += pitchEffect;
        
        // Apply reduced gravity effect (aircraft don't fall like rocks)
        this.velocity.y -= 9.8 * deltaTime * 0.05; // Very reduced gravity for aircraft
        
        // Air resistance
        this.velocity.multiplyScalar(0.995);
    }
    
    applyRotation() {
        // Create quaternion rotation using YXZ order for natural aircraft movement
        const quaternion = new THREE.Quaternion();
        
        // Apply rotations in YXZ order (yaw, pitch, roll)
        // Invert pitch for correct visual orientation
        const euler = new THREE.Euler(-this.pitch, this.yaw, this.roll, 'YXZ');
        quaternion.setFromEuler(euler);
        
        this.group.quaternion.copy(quaternion);
    }

    getGroup() {
        return this.group;
    }

    getFlightData() {
        return {
            speed: Math.round(this.speed),
            altitude: Math.round(this.group.position.y),
            pitch: this.pitch,
            roll: this.roll,
            yaw: this.yaw
        };
    }
} 