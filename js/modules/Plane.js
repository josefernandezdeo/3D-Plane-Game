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
        
        // Position the entire plane in the sky
        this.group.position.set(0, 15, 0);
        
        // Flight physics properties
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 0;
        this.maxSpeed = 0.5;
        this.acceleration = 0.02;
        this.turnSpeed = 0.03;
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

    update(controls) {
        // Rotate propeller (slower speed)
        if (this.propeller) {
            this.propeller.rotation.z += 0.05;
        }
        
        // Handle flight controls
        if (controls) {
            this.handleControls(controls);
        }
        
        // Update position based on velocity
        this.group.position.add(this.velocity);
        
        // Keep plane above ground
        if (this.group.position.y < 5) {
            this.group.position.y = 5;
            this.velocity.y = Math.max(0, this.velocity.y);
        }
    }
    
    handleControls(controls) {
        // Forward/Backward movement (W/S)
        if (controls.forward) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (controls.backward) {
            this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed * 0.5);
        } else {
            this.speed *= 0.95; // Gradual slowdown
        }
        
        // Turn left/right (A/D)
        if (controls.left) {
            this.group.rotation.y += this.turnSpeed;
            this.group.rotation.z = Math.min(this.group.rotation.z + 0.02, 0.3); // Bank left
        } else if (controls.right) {
            this.group.rotation.y -= this.turnSpeed;
            this.group.rotation.z = Math.max(this.group.rotation.z - 0.02, -0.3); // Bank right
        } else {
            // Return to level flight
            this.group.rotation.z *= 0.9;
        }
        
        // Up/Down movement (Q/E)
        if (controls.up) {
            this.velocity.y += 0.01;
            this.group.rotation.x = Math.max(this.group.rotation.x - 0.01, -0.2); // Pitch up
        } else if (controls.down) {
            this.velocity.y -= 0.01;
            this.group.rotation.x = Math.min(this.group.rotation.x + 0.01, 0.2); // Pitch down
        } else {
            this.velocity.y *= 0.95; // Gradual stop
            this.group.rotation.x *= 0.9; // Return to level
        }
        
        // Calculate forward movement based on plane's orientation
        const direction = new THREE.Vector3(0, 0, this.speed);
        direction.applyQuaternion(this.group.quaternion);
        this.velocity.x = direction.x;
        this.velocity.z = direction.z;
        
        // Apply some drag
        this.velocity.multiplyScalar(0.98);
    }

    getGroup() {
        return this.group;
    }
} 