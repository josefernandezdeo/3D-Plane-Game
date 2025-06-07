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
        
        // Position the entire plane
        this.group.position.set(0, 0, 0);
    }

    createFuselage() {
        // Main body - cylindrical fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 12);
        const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        
        // Rotate to align with Z-axis (nose forward)
        fuselage.rotation.x = Math.PI / 2;
        fuselage.position.z = 0;
        
        this.group.add(fuselage);
    }

    createWings() {
        // Main wings - rectangular, passing through fuselage center
        const wingGeometry = new THREE.BoxGeometry(6, 0.2, 1.2);
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        
        // Position wings at center of fuselage
        wings.position.set(0, 0, 0);
        
        this.group.add(wings);
    }

    createTail() {
        // Vertical stabilizer (tail fin)
        const verticalStabGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.8);
        const verticalStabMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const verticalStabilizer = new THREE.Mesh(verticalStabGeometry, verticalStabMaterial);
        
        verticalStabilizer.position.set(0, 0.5, -1.8);
        this.group.add(verticalStabilizer);
        
        // Horizontal stabilizer (tail wings)
        const horizontalStabGeometry = new THREE.BoxGeometry(2.5, 0.15, 0.6);
        const horizontalStabMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const horizontalStabilizer = new THREE.Mesh(horizontalStabGeometry, horizontalStabMaterial);
        
        horizontalStabilizer.position.set(0, 0, -1.8);
        this.group.add(horizontalStabilizer);
    }

    createPropeller() {
        // Propeller hub
        const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8);
        const hubMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        
        // Create propeller group for rotation
        this.propeller = new THREE.Group();
        
        // Rotate hub to align with Z-axis
        hub.rotation.x = Math.PI / 2;
        this.propeller.add(hub);
        
        // Propeller blades
        const bladeGeometry = new THREE.BoxGeometry(0.1, 2.5, 0.05);
        const bladeMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        // Create 3 blades
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.z = (i * Math.PI * 2) / 3;
            this.propeller.add(blade);
        }
        
        // Position propeller at front of plane
        this.propeller.position.set(0, 0, 2.2);
        this.group.add(this.propeller);
    }

    update() {
        // Rotate propeller
        if (this.propeller) {
            this.propeller.rotation.z += 0.3;
        }
    }

    getGroup() {
        return this.group;
    }
} 