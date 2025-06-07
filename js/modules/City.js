export class City {
    constructor() {
        this.group = new THREE.Group();
        this.buildings = [];
        this.createCity();
    }

    createCity() {
        this.createGround();
        this.createBuildings();
        this.createStreets();
        this.addCityLights();
    }

    createGround() {
        // Large ground plane for the city base
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d4a2b,  // Dark green ground
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        
        // Rotate to be horizontal
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        
        this.group.add(ground);
    }

    createBuildings() {
        const citySize = 80;
        const buildingSpacing = 8;
        const streetsEvery = 3; // Create a street every 3 buildings
        
        for (let x = -citySize / 2; x < citySize / 2; x += buildingSpacing) {
            for (let z = -citySize / 2; z < citySize / 2; z += buildingSpacing) {
                // Skip some positions for streets
                const gridX = Math.floor((x + citySize / 2) / buildingSpacing);
                const gridZ = Math.floor((z + citySize / 2) / buildingSpacing);
                
                // Create streets in a grid pattern
                if (gridX % streetsEvery === 0 || gridZ % streetsEvery === 0) {
                    continue; // Skip building, create street instead
                }
                
                // Random building parameters
                const height = Math.random() * 15 + 3; // Buildings 3-18 units tall
                const width = Math.random() * 3 + 2;   // Width 2-5 units
                const depth = Math.random() * 3 + 2;   // Depth 2-5 units
                
                this.createBuilding(x, z, width, height, depth);
            }
        }
    }

    createBuilding(x, z, width, height, depth) {
        // Building geometry
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        
        // Random building color (various city building colors)
        const colors = [0x606060, 0x707070, 0x505050, 0x656565, 0x4a4a4a, 0x5a5a5a];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const buildingMaterial = new THREE.MeshLambertMaterial({ color: color });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        // Position building
        building.position.set(x, height / 2 - 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        
        this.group.add(building);
        this.buildings.push(building);
        
        // Add windows/details randomly
        if (Math.random() > 0.5) {
            this.addBuildingDetails(building, x, z, width, height, depth);
        }
    }

    addBuildingDetails(building, x, z, width, height, depth) {
        // Add simple window lights
        const windowsPerFloor = Math.floor(width) + Math.floor(depth);
        const floors = Math.floor(height / 3);
        
        for (let floor = 1; floor <= floors; floor++) {
            for (let window = 0; window < windowsPerFloor; window++) {
                if (Math.random() > 0.7) { // 30% chance for lit windows
                    const windowGeometry = new THREE.PlaneGeometry(0.3, 0.3);
                    const windowMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0xffff99,
                        transparent: true,
                        opacity: 0.8
                    });
                    const windowLight = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Random position on building face
                    const side = Math.floor(Math.random() * 4);
                    switch(side) {
                        case 0: // Front face
                            windowLight.position.set(
                                x + (Math.random() - 0.5) * width * 0.8,
                                (height / 2 - 2) + (floor * 3) - height / 2,
                                z + depth / 2 + 0.01
                            );
                            break;
                        case 1: // Back face
                            windowLight.position.set(
                                x + (Math.random() - 0.5) * width * 0.8,
                                (height / 2 - 2) + (floor * 3) - height / 2,
                                z - depth / 2 - 0.01
                            );
                            windowLight.rotation.y = Math.PI;
                            break;
                        case 2: // Left face
                            windowLight.position.set(
                                x - width / 2 - 0.01,
                                (height / 2 - 2) + (floor * 3) - height / 2,
                                z + (Math.random() - 0.5) * depth * 0.8
                            );
                            windowLight.rotation.y = Math.PI / 2;
                            break;
                        case 3: // Right face
                            windowLight.position.set(
                                x + width / 2 + 0.01,
                                (height / 2 - 2) + (floor * 3) - height / 2,
                                z + (Math.random() - 0.5) * depth * 0.8
                            );
                            windowLight.rotation.y = -Math.PI / 2;
                            break;
                    }
                    
                    this.group.add(windowLight);
                }
            }
        }
    }

    createStreets() {
        const citySize = 80;
        const buildingSpacing = 8;
        const streetsEvery = 3;
        const streetWidth = 6;
        
        // Horizontal streets
        for (let z = -citySize / 2; z < citySize / 2; z += buildingSpacing * streetsEvery) {
            const streetGeometry = new THREE.PlaneGeometry(citySize, streetWidth);
            const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const street = new THREE.Mesh(streetGeometry, streetMaterial);
            
            street.rotation.x = -Math.PI / 2;
            street.position.set(0, -1.9, z);
            street.receiveShadow = true;
            
            this.group.add(street);
        }
        
        // Vertical streets
        for (let x = -citySize / 2; x < citySize / 2; x += buildingSpacing * streetsEvery) {
            const streetGeometry = new THREE.PlaneGeometry(streetWidth, citySize);
            const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const street = new THREE.Mesh(streetGeometry, streetMaterial);
            
            street.rotation.x = -Math.PI / 2;
            street.position.set(x, -1.9, 0);
            street.receiveShadow = true;
            
            this.group.add(street);
        }
    }

    addCityLights() {
        const citySize = 60;
        const lightSpacing = 20;
        
        // Add street lights at intersections
        for (let x = -citySize / 2; x < citySize / 2; x += lightSpacing) {
            for (let z = -citySize / 2; z < citySize / 2; z += lightSpacing) {
                // Street light pole
                const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
                const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
                const pole = new THREE.Mesh(poleGeometry, poleMaterial);
                
                pole.position.set(x, 1, z);
                pole.castShadow = true;
                this.group.add(pole);
                
                // Light source
                const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
                const lightMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffcc,
                    transparent: true,
                    opacity: 0.8
                });
                const light = new THREE.Mesh(lightGeometry, lightMaterial);
                
                light.position.set(x, 4, z);
                this.group.add(light);
                
                // Actual Three.js light source
                const pointLight = new THREE.PointLight(0xffffcc, 0.5, 15);
                pointLight.position.set(x, 4, z);
                pointLight.castShadow = true;
                this.group.add(pointLight);
            }
        }
    }

    getGroup() {
        return this.group;
    }

    // Method to animate city lights (optional)
    update() {
        // Could add blinking lights or other animations here
    }
} 