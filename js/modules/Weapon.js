export class Projectile {
    constructor(position, direction) {
        this.position = position.clone();
        this.direction = direction.clone().normalize();
        this.speed = 2;
        this.active = true;
        this.life = 120; // 2 seconds at 60fps
        this.maxLife = 120;
        
        this.createProjectile();
    }
    
    createProjectile() {
        // Simple bullet/tracer round
        const geometry = new THREE.SphereGeometry(0.1, 6, 6);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.9
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
    }
    
    update() {
        if (!this.active) return;
        
        // Move projectile
        this.position.add(this.direction.clone().multiplyScalar(this.speed));
        this.mesh.position.copy(this.position);
        
        // Decrease life
        this.life -= 1;
        if (this.life <= 0) {
            this.active = false;
        }
        
        // Fade out as it gets older
        const fadeAmount = this.life / this.maxLife;
        this.mesh.material.opacity = fadeAmount * 0.9;
    }
    
    getMesh() {
        return this.mesh;
    }
    
    isActive() {
        return this.active;
    }
    
    destroy() {
        this.active = false;
    }
}

export class WeaponSystem {
    constructor() {
        this.projectiles = [];
        this.fireRate = 10; // Frames between shots
        this.lastFire = 0;
        this.ammunition = Infinity; // Unlimited ammo for now
    }
    
    update() {
        // Update all projectiles
        this.projectiles.forEach(projectile => {
            projectile.update();
        });
        
        // Remove inactive projectiles
        this.projectiles = this.projectiles.filter(projectile => projectile.isActive());
        
        // Update fire rate timer
        this.lastFire += 1;
    }
    
    fire(planePosition, planeRotation) {
        if (this.lastFire < this.fireRate) return null;
        if (this.ammunition <= 0) return null;
        
        // Calculate firing position (from plane's gun position)
        const fireOffset = new THREE.Vector3(0, -0.5, 2); // Slightly below and in front
        fireOffset.applyEuler(planeRotation);
        const firePosition = planePosition.clone().add(fireOffset);
        
        // Calculate firing direction (forward from plane)
        const fireDirection = new THREE.Vector3(0, 0, 1);
        fireDirection.applyEuler(planeRotation);
        
        // Create projectile
        const projectile = new Projectile(firePosition, fireDirection);
        this.projectiles.push(projectile);
        
        // Reset fire timer
        this.lastFire = 0;
        
        // Reduce ammunition (if not infinite)
        if (this.ammunition !== Infinity) {
            this.ammunition -= 1;
        }
        
        return projectile;
    }
    
    getProjectiles() {
        return this.projectiles;
    }
    
    removeProjectile(index) {
        if (index >= 0 && index < this.projectiles.length) {
            this.projectiles[index].destroy();
        }
    }
}

export class ExplosionSystem {
    constructor() {
        this.explosions = [];
    }
    
    createExplosion(position) {
        const explosion = new Explosion(position);
        this.explosions.push(explosion);
        return explosion;
    }
    
    update() {
        // Update all explosions
        this.explosions.forEach(explosion => {
            explosion.update();
        });
        
        // Remove finished explosions
        this.explosions = this.explosions.filter(explosion => explosion.isActive());
    }
    
    getExplosions() {
        return this.explosions;
    }
}

class Explosion {
    constructor(position) {
        this.position = position.clone();
        this.particles = [];
        this.life = 60; // 1 second at 60fps
        this.maxLife = 60;
        this.active = true;
        
        this.createExplosion();
    }
    
    createExplosion() {
        // Create multiple particle spheres for explosion effect
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                position: this.position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                ),
                life: this.maxLife + Math.random() * 20,
                maxLife: this.maxLife + Math.random() * 20,
                size: Math.random() * 0.5 + 0.2
            };
            
            // Create particle mesh
            const geometry = new THREE.SphereGeometry(particle.size, 6, 6);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(0.1, 1, 0.5 + Math.random() * 0.5), // Orange/yellow
                transparent: true,
                opacity: 1
            });
            particle.mesh = new THREE.Mesh(geometry, material);
            particle.mesh.position.copy(particle.position);
            
            this.particles.push(particle);
        }
    }
    
    update() {
        if (!this.active) return;
        
        // Update particles
        this.particles.forEach(particle => {
            // Move particle
            particle.position.add(particle.velocity);
            particle.mesh.position.copy(particle.position);
            
            // Apply gravity and drag
            particle.velocity.y -= 0.01;
            particle.velocity.multiplyScalar(0.98);
            
            // Decrease life
            particle.life -= 1;
            
            // Fade and shrink
            const lifeRatio = particle.life / particle.maxLife;
            particle.mesh.material.opacity = Math.max(0, lifeRatio);
            particle.mesh.scale.setScalar(lifeRatio);
            
            // Change color over time (orange to red to black)
            const hue = 0.1 * lifeRatio; // From yellow to red
            particle.mesh.material.color.setHSL(hue, 1, 0.5 * lifeRatio);
        });
        
        // Decrease overall explosion life
        this.life -= 1;
        if (this.life <= 0) {
            this.active = false;
        }
    }
    
    getParticles() {
        return this.particles;
    }
    
    isActive() {
        return this.active;
    }
} 