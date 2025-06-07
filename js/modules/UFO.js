export class UFO {
    constructor(x, z) {
        this.group = new THREE.Group();
        this.alive = true;
        this.hoverOffset = Math.random() * Math.PI * 2; // Random hover phase
        this.speed = 0.02 + Math.random() * 0.01; // Random speed
        this.direction = Math.random() * Math.PI * 2; // Random initial direction
        this.changeDirectionTimer = 0;
        this.health = 1;
        
        this.createUFO();
        this.group.position.set(x, 20 + Math.random() * 10, z);
    }

    createUFO() {
        // Main UFO body (classic saucer shape) - improved materials
        const bodyGeometry = new THREE.CylinderGeometry(2.2, 3.2, 1, 20);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x888888,
            shininess: 100,
            specular: 0x444444
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        this.group.add(body);

        // UFO dome/cockpit - solid, no transparency to prevent flickering
        const domeGeometry = new THREE.SphereGeometry(1.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2266ff,
            shininess: 80,
            specular: 0x4488ff
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.y = 0.7;
        dome.castShadow = true;
        this.group.add(dome);

        // UFO rim detail
        const rimGeometry = new THREE.TorusGeometry(2.7, 0.15, 8, 20);
        const rimMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xaaaaaa,
            shininess: 120
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.y = -0.3;
        rim.castShadow = true;
        this.group.add(rim);

        // UFO lights around the rim - more stable
        this.lights = [];
        const lightCount = 8;
        for (let i = 0; i < lightCount; i++) {
            const angle = (i / lightCount) * Math.PI * 2;
            const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const lightMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffff44
            });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            
            const radius = 2.8;
            light.position.set(
                Math.cos(angle) * radius,
                -0.3,
                Math.sin(angle) * radius
            );
            this.group.add(light);
            this.lights.push(light);
        }

        // Add bottom detail
        const bottomGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 12);
        const bottomMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 60
        });
        const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottom.position.y = -0.6;
        bottom.castShadow = true;
        this.group.add(bottom);
    }

    update(time, playerPosition) {
        if (!this.alive) return;

        // Much gentler hovering motion - nearly static
        const hoverHeight = Math.sin(time * 0.2 + this.hoverOffset) * 0.5;
        this.group.position.y = 20 + hoverHeight;

        // Very slow rotation
        this.group.rotation.y += 0.002;

        // Animate lights (subtle pulsing)
        if (this.lights) {
            const pulse = Math.sin(time * 0.3) * 0.2 + 0.8;
            this.lights.forEach(light => {
                light.material.color.setHSL(0.15, 1, pulse);
            });
        }

        // Much less frequent direction changes for smoother movement
        this.changeDirectionTimer += 1;
        if (this.changeDirectionTimer > 300) { // Change direction every 5 seconds at 60fps
            this.direction += (Math.random() - 0.5) * 0.2; // Smaller direction changes
            this.changeDirectionTimer = 0;
        }

        // Move in current direction with reduced speed
        this.group.position.x += Math.cos(this.direction) * this.speed * 0.5;
        this.group.position.z += Math.sin(this.direction) * this.speed * 0.5;

        // Keep UFOs within city bounds
        const cityBounds = 60;
        if (Math.abs(this.group.position.x) > cityBounds) {
            this.direction += Math.PI; // Turn around
        }
        if (Math.abs(this.group.position.z) > cityBounds) {
            this.direction += Math.PI; // Turn around
        }

        // Clamp position within bounds
        this.group.position.x = Math.max(-cityBounds, Math.min(cityBounds, this.group.position.x));
        this.group.position.z = Math.max(-cityBounds, Math.min(cityBounds, this.group.position.z));

        // Optional: Move slightly toward player for more engagement (less frequent)
        if (playerPosition && Math.random() < 0.005) { // 0.5% chance per frame
            const toPlayer = new THREE.Vector3()
                .subVectors(playerPosition, this.group.position)
                .normalize();
            this.direction = Math.atan2(toPlayer.z, toPlayer.x);
        }
    }

    takeDamage() {
        this.health -= 1;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.alive = false;
        // The explosion effect will be handled by the main game loop
    }

    getPosition() {
        return this.group.position.clone();
    }

    getGroup() {
        return this.group;
    }

    isAlive() {
        return this.alive;
    }
}

export class UFOManager {
    constructor() {
        this.ufos = [];
        this.maxUFOs = 3;
        this.spawnTimer = 0;
        this.spawnInterval = 300; // Spawn every 5 seconds at 60fps
    }

    update(time, playerPosition) {
        // Update existing UFOs
        this.ufos.forEach(ufo => {
            if (ufo.isAlive()) {
                ufo.update(time, playerPosition);
            }
        });

        // Remove destroyed UFOs
        this.ufos = this.ufos.filter(ufo => ufo.isAlive());

        // Spawn new UFOs if needed
        this.spawnTimer += 1;
        if (this.ufos.length < this.maxUFOs && this.spawnTimer > this.spawnInterval) {
            this.spawnUFO();
            this.spawnTimer = 0;
        }
    }

    spawnUFO() {
        // Spawn UFO at random position around the city
        const citySize = 50;
        const x = (Math.random() - 0.5) * citySize;
        const z = (Math.random() - 0.5) * citySize;
        
        const ufo = new UFO(x, z);
        this.ufos.push(ufo);
        return ufo;
    }

    getUFOs() {
        return this.ufos;
    }

    checkCollisions(projectiles) {
        const hits = [];
        
        this.ufos.forEach((ufo, ufoIndex) => {
            if (!ufo.isAlive()) return;
            
            projectiles.forEach((projectile, projIndex) => {
                if (!projectile.active) return;
                
                const distance = ufo.getPosition().distanceTo(projectile.position);
                if (distance < 3) { // Hit detection radius
                    hits.push({
                        ufo: ufo,
                        ufoIndex: ufoIndex,
                        projectile: projectile,
                        projIndex: projIndex,
                        position: ufo.getPosition()
                    });
                }
            });
        });
        
        return hits;
    }
} 