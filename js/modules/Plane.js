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
        // Main fuselage - Japanese Zero style with distinctive shape
        const fuselageGeometry = new THREE.CylinderGeometry(0.28, 0.65, 6.8, 16);
        const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0x4a6b2a }); // IJN Green
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        
        // Rotate to align with Z-axis (nose forward)
        fuselage.rotation.x = Math.PI / 2;
        fuselage.position.z = 0;
        this.group.add(fuselage);
        
        // Nose section - more pointed like Zero
        const noseGeometry = new THREE.ConeGeometry(0.28, 1.4, 12);
        const noseMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.rotation.x = Math.PI / 2;
        nose.position.z = 4;
        this.group.add(nose);
        
        // Engine cowling - radial engine style for Zero
        const cowlingGeometry = new THREE.CylinderGeometry(0.45, 0.42, 1.6, 16);
        const cowlingMaterial = new THREE.MeshLambertMaterial({ color: 0x2a3515 });
        const cowling = new THREE.Mesh(cowlingGeometry, cowlingMaterial);
        cowling.rotation.x = Math.PI / 2;
        cowling.position.z = 2.9;
        this.group.add(cowling);
        
        // Cockpit area - raised section
        const cockpitGeometry = new THREE.BoxGeometry(1.1, 0.55, 2.4);
        const cockpitMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        const cockpitSection = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpitSection.position.set(0, 0.28, 0.6);
        this.group.add(cockpitSection);
        
        // Cockpit canopy - Zero style canopy
        const canopyGeometry = new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const canopyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEEB, 
            transparent: true, 
            opacity: 0.35 
        });
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        canopy.position.set(0, 0.38, 0.6);
        this.group.add(canopy);
        
        // Exhaust stacks - Zero fighter style
        for (let i = 0; i < 6; i++) {
            const exhaustGeometry = new THREE.CylinderGeometry(0.025, 0.018, 0.35, 6);
            const exhaustMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
            const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
            const angle = (i * Math.PI * 2) / 6;
            exhaust.position.set(Math.cos(angle) * 0.38, Math.sin(angle) * 0.38, 2.3);
            this.group.add(exhaust);
        }
    }

    createWings() {
        // Main wings - Japanese Zero style with distinctive shape
        const wingGeometry = new THREE.BoxGeometry(9, 0.35, 2.4);
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x4a6b2a }); // IJN Green
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        
        // Position wings lower on fuselage (low-wing configuration)
        wings.position.set(0, -0.2, 0.2);
        
        this.group.add(wings);
        
        // Wing root fillets for smoother transition
        const filletGeometry = new THREE.BoxGeometry(1.5, 0.3, 1.8);
        const filletMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        
        const leftFillet = new THREE.Mesh(filletGeometry, filletMaterial);
        leftFillet.position.set(-0.8, -0.05, 0.2);
        leftFillet.rotation.z = 0.1;
        this.group.add(leftFillet);
        
        const rightFillet = new THREE.Mesh(filletGeometry, filletMaterial);
        rightFillet.position.set(0.8, -0.05, 0.2);
        rightFillet.rotation.z = -0.1;
        this.group.add(rightFillet);
        
        // Wing tips - rounded Zero fighter style
        const wingTipGeometry = new THREE.BoxGeometry(0.7, 0.22, 1.4);
        const wingTipMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        
        const leftWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
        leftWingTip.position.set(-4.7, -0.2, 0.2);
        leftWingTip.rotation.z = 0.12;
        this.group.add(leftWingTip);
        
        const rightWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
        rightWingTip.position.set(4.7, -0.2, 0.2);
        rightWingTip.rotation.z = -0.12;
        this.group.add(rightWingTip);
        
        // Japanese Hinomaru (red circles) on wings
        const hinomaru1Geometry = new THREE.CircleGeometry(0.8, 16);
        const hinomaruMaterial = new THREE.MeshLambertMaterial({ color: 0xcc1122 }); // Rising sun red
        
        // Left wing hinomaru
        const leftHinomaru = new THREE.Mesh(hinomaru1Geometry, hinomaruMaterial);
        leftHinomaru.rotation.x = -Math.PI / 2;
        leftHinomaru.position.set(-2.5, -0.15, 0.2);
        this.group.add(leftHinomaru);
        
        // Right wing hinomaru
        const rightHinomaru = new THREE.Mesh(hinomaru1Geometry, hinomaruMaterial);
        rightHinomaru.rotation.x = -Math.PI / 2;
        rightHinomaru.position.set(2.5, -0.15, 0.2);
        this.group.add(rightHinomaru);
        
        // Aileron details
        const aileronGeometry = new THREE.BoxGeometry(1.8, 0.12, 0.5);
        const aileronMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3f1a });
        
        const leftAileron = new THREE.Mesh(aileronGeometry, aileronMaterial);
        leftAileron.position.set(-3.8, -0.32, -0.5);
        this.group.add(leftAileron);
        
        const rightAileron = new THREE.Mesh(aileronGeometry, aileronMaterial);
        rightAileron.position.set(3.8, -0.32, -0.5);
        this.group.add(rightAileron);
    }

    createTail() {
        // Vertical stabilizer (tail fin) - Japanese Zero style
        const verticalStabGeometry = new THREE.BoxGeometry(0.28, 2.6, 1.9);
        const verticalStabMaterial = new THREE.MeshLambertMaterial({ color: 0x4a6b2a });
        const verticalStabilizer = new THREE.Mesh(verticalStabGeometry, verticalStabMaterial);
        
        verticalStabilizer.position.set(0, 0.85, -3.1);
        this.group.add(verticalStabilizer);
        
        // Horizontal stabilizer (tail wings) - Zero proportions
        const horizontalStabGeometry = new THREE.BoxGeometry(3.6, 0.22, 1.1);
        const horizontalStabMaterial = new THREE.MeshLambertMaterial({ color: 0x4a6b2a });
        const horizontalStabilizer = new THREE.Mesh(horizontalStabGeometry, horizontalStabMaterial);
        
        horizontalStabilizer.position.set(0, 0.18, -3.1);
        this.group.add(horizontalStabilizer);
        
        // Rudder detail
        const rudderGeometry = new THREE.BoxGeometry(0.12, 1.3, 0.65);
        const rudderMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        const rudder = new THREE.Mesh(rudderGeometry, rudderMaterial);
        rudder.position.set(0, 1.6, -3.3);
        this.group.add(rudder);
        
        // Elevator details
        const elevatorGeometry = new THREE.BoxGeometry(1.3, 0.1, 0.32);
        const elevatorMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        
        const leftElevator = new THREE.Mesh(elevatorGeometry, elevatorMaterial);
        leftElevator.position.set(-1.3, 0.13, -3.4);
        this.group.add(leftElevator);
        
        const rightElevator = new THREE.Mesh(elevatorGeometry, elevatorMaterial);
        rightElevator.position.set(1.3, 0.13, -3.4);
        this.group.add(rightElevator);
        
        // Tail number markings "03 18" style
        const tailNumberGeometry = new THREE.PlaneGeometry(0.8, 0.4);
        const tailNumberMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const tailNumber = new THREE.Mesh(tailNumberGeometry, tailNumberMaterial);
        tailNumber.position.set(0.2, 1.2, -3.05);
        tailNumber.rotation.y = Math.PI / 2;
        this.group.add(tailNumber);
        
        // Japanese tail marking background
        const tailMarkingGeometry = new THREE.PlaneGeometry(1, 0.6);
        const tailMarkingMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2a3515,
            transparent: true,
            opacity: 0.8
        });
        const tailMarking = new THREE.Mesh(tailMarkingGeometry, tailMarkingMaterial);
        tailMarking.position.set(0.15, 1.2, -3.05);
        tailMarking.rotation.y = Math.PI / 2;
        this.group.add(tailMarking);
        
        // Tail wheel assembly
        const tailWheelStrutGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.65, 8);
        const tailWheelStrutMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
        const tailWheelStrut = new THREE.Mesh(tailWheelStrutGeometry, tailWheelStrutMaterial);
        tailWheelStrut.position.set(0, -0.32, -2.9);
        this.group.add(tailWheelStrut);
    }

    createPropeller() {
        // Propeller hub - larger for WWII fighter
        const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 12);
        const hubMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        
        // Create propeller group for rotation
        this.propeller = new THREE.Group();
        
        // Rotate hub to align with Z-axis
        hub.rotation.x = Math.PI / 2;
        this.propeller.add(hub);
        
        // Spinner cone
        const spinnerGeometry = new THREE.ConeGeometry(0.15, 0.4, 12);
        const spinnerMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
        const spinner = new THREE.Mesh(spinnerGeometry, spinnerMaterial);
        spinner.rotation.x = Math.PI / 2;
        spinner.position.z = 0.2;
        this.propeller.add(spinner);
        
        // Propeller blades - 4 blades like many WWII fighters
        const bladeGeometry = new THREE.BoxGeometry(0.12, 2.8, 0.04);
        const bladeMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Dark wood/metal
        
        // Create 4 blades
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.z = (i * Math.PI * 2) / 4;
            // Add slight twist to blades
            blade.rotation.x = 0.1;
            this.propeller.add(blade);
        }
        
        // Position propeller at front of engine
        this.propeller.position.set(0, 0, 4.2);
        this.group.add(this.propeller);
        
        // Landing gear (WWII fighter style)
        this.createLandingGear();
    }

    createLandingGear() {
        // Main landing gear legs - Japanese Zero style
        const gearGeometry = new THREE.CylinderGeometry(0.038, 0.038, 1.1, 8);
        const gearMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
        
        // Left gear - angled like Zero retractable gear
        const leftGear = new THREE.Mesh(gearGeometry, gearMaterial);
        leftGear.position.set(-1.6, -0.85, 0.9);
        leftGear.rotation.z = 0.18;
        this.group.add(leftGear);
        
        // Right gear
        const rightGear = new THREE.Mesh(gearGeometry, gearMaterial);
        rightGear.position.set(1.6, -0.85, 0.9);
        rightGear.rotation.z = -0.18;
        this.group.add(rightGear);
        
        // Main wheels - Zero style wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 12);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        
        const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        leftWheel.rotation.z = Math.PI / 2;
        leftWheel.position.set(-1.8, -1.4, 0.9);
        this.group.add(leftWheel);
        
        const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rightWheel.rotation.z = Math.PI / 2;
        rightWheel.position.set(1.8, -1.4, 0.9);
        this.group.add(rightWheel);
        
        // Tail wheel - smaller Zero style
        const tailWheelGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.07, 8);
        const tailWheel = new THREE.Mesh(tailWheelGeometry, wheelMaterial);
        tailWheel.rotation.z = Math.PI / 2;
        tailWheel.position.set(0, -0.65, -2.6);
        this.group.add(tailWheel);
        
        // Gear doors/fairings - Zero style
        const fairingGeometry = new THREE.BoxGeometry(0.75, 0.14, 0.65);
        const fairingMaterial = new THREE.MeshLambertMaterial({ color: 0x3d5522 });
        
        const leftFairing = new THREE.Mesh(fairingGeometry, fairingMaterial);
        leftFairing.position.set(-1.6, -0.52, 0.9);
        this.group.add(leftFairing);
        
        const rightFairing = new THREE.Mesh(fairingGeometry, fairingMaterial);
        rightFairing.position.set(1.6, -0.52, 0.9);
        this.group.add(rightFairing);
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
        
        // W/S: Pitch control (±60° limit) - Reversed controls
        if (controls.forward) pitchInput = -1;  // Nose down (W pushes forward - negative pitch)
        if (controls.backward) pitchInput = 1; // Nose up (S pulls back - positive pitch)
        
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