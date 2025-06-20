export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.music = {};
        this.engineSound = null;
        this.volume = {
            master: 0.7,
            sfx: 0.8,
            music: 0.5,
            engine: 0.6
        };
        this.enabled = false;
        this.musicPlaying = false;
        this.enginePlaying = false;
        
        // Audio enable UI
        this.audioEnableOverlay = null;
        this.audioEnabled = false;
    }
    
    async init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create audio enable overlay
            this.createAudioEnableOverlay();
            
            // Load background music
            await this.loadMusic();
            
            // Load aircraft engine sound
            await this.loadAircraftSound();
            
            // Create synthesized sound effects
            this.createSoundEffects();
            
            this.enabled = true;
            console.log('AudioManager initialized successfully');
        } catch (error) {
            console.warn('AudioManager initialization failed:', error);
            this.enabled = false;
        }
    }
    
    createAudioEnableOverlay() {
        // Create overlay that appears on first user interaction
        this.audioEnableOverlay = document.createElement('div');
        this.audioEnableOverlay.id = 'audio-enable-overlay';
        this.audioEnableOverlay.innerHTML = `
            <div class="audio-enable-content">
                <div class="audio-icon">🎵</div>
                <h3>Enable Audio</h3>
                <p>Tap to enable immersive flight sounds</p>
                <button id="enable-audio-btn" class="audio-enable-btn">Enable Sound</button>
            </div>
        `;
        
        // Add CSS
        this.audioEnableOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;
        
        document.body.appendChild(this.audioEnableOverlay);
        
        // Handle enable button
        document.getElementById('enable-audio-btn').addEventListener('click', () => {
            this.enableAudio();
        });
    }
    
    async enableAudio() {
        try {
            // Resume audio context
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.audioEnabled = true;
            
            // Remove overlay
            if (this.audioEnableOverlay) {
                this.audioEnableOverlay.remove();
                this.audioEnableOverlay = null;
            }
            
            // Start background music
            this.playBackgroundMusic();
            
            // Auto-start engine sound
            setTimeout(() => {
                this.startEngineSound();
            }, 500);
            
            console.log('Audio enabled successfully');
        } catch (error) {
            console.warn('Failed to enable audio:', error);
        }
    }
    
    async loadMusic() {
        try {
            const response = await fetch('assets/audio/music/background.mp3');
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.music.background = audioBuffer;
            console.log('Background music loaded successfully');
        } catch (error) {
            console.warn('Failed to load background music:', error);
        }
    }

    async loadAircraftSound() {
        try {
            const response = await fetch('assets/audio/sfx/aircraft.mp3');
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.sounds.aircraftEngine = audioBuffer;
            console.log('Aircraft engine sound loaded successfully');
        } catch (error) {
            console.warn('Failed to load aircraft engine sound:', error);
        }
    }
    
    createSoundEffects() {
        // All sound effects will be created using Web Audio API synthesis
        // Don't overwrite existing sounds (like aircraftEngine), just add to them
        this.sounds.gunfire = this.createGunfireSound;
        this.sounds.explosion = this.createExplosionSound;
        this.sounds.buttonClick = this.createButtonClickSound;
        this.sounds.ufoHit = this.createUfoHitSound;
    }
    
    // Synthesized sound effects
    createGunfireSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        const duration = 0.1;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const noiseBuffer = this.createNoiseBuffer(duration);
        const noiseSource = this.audioContext.createBufferSource();
        
        // Create gunfire sound with noise and tone
        noiseSource.buffer = noiseBuffer;
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration);
        
        // Reduced volume by 80% (0.2 = 20% of original volume)
        gainNode.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        noiseSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        noiseSource.start();
        oscillator.stop(this.audioContext.currentTime + duration);
        noiseSource.stop(this.audioContext.currentTime + duration);
    }
    
    createExplosionSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        const duration = 0.8;
        const noiseBuffer = this.createNoiseBuffer(duration);
        const noiseSource = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        noiseSource.buffer = noiseBuffer;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(this.volume.sfx * this.volume.master, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noiseSource.start();
        noiseSource.stop(this.audioContext.currentTime + duration);
    }
    
    createButtonClickSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        const duration = 0.1;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    createUfoHitSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        const duration = 0.3;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    createNoiseBuffer(duration) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }
    
    // Engine sound management
    startEngineSound() {
        if (!this.audioEnabled || !this.audioContext || this.enginePlaying) return;
        
        if (!this.sounds.aircraftEngine) {
            console.warn('Aircraft engine sound not loaded yet');
            return;
        }
        
        console.log('Starting aircraft engine sound');
        
        // Create buffer source and gain node for aircraft sound
        this.engineSound = {
            source: this.audioContext.createBufferSource(),
            gainNode: this.audioContext.createGain()
        };
        
        // Setup aircraft engine sound
        this.engineSound.source.buffer = this.sounds.aircraftEngine;
        this.engineSound.source.loop = true;
        this.engineSound.source.playbackRate.setValueAtTime(0.8, this.audioContext.currentTime); // Start slower
        
        // Fade in the engine sound (2 out of 10 volume - 20%)
        this.engineSound.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.engineSound.gainNode.gain.linearRampToValueAtTime(
            this.volume.engine * this.volume.master * 0.2, 
            this.audioContext.currentTime + 0.5
        );
        
        // Connect audio nodes
        this.engineSound.source.connect(this.engineSound.gainNode);
        this.engineSound.gainNode.connect(this.audioContext.destination);
        
        // Start playing
        this.engineSound.source.start();
        this.enginePlaying = true;
    }
    
    updateEngineSound(speed) {
        if (!this.engineSound || !this.enginePlaying) return;
        
        // Map speed (5-25) to playback rate (0.6-1.4)
        const normalizedSpeed = Math.max(0, Math.min(1, (speed - 5) / 20));
        const playbackRate = 0.6 + (normalizedSpeed * 0.8);
        
        this.engineSound.source.playbackRate.setValueAtTime(playbackRate, this.audioContext.currentTime);
    }
    
    stopEngineSound() {
        if (!this.engineSound || !this.enginePlaying) return;
        
        // Fade out and stop
        this.engineSound.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        this.engineSound.source.stop(this.audioContext.currentTime + 0.5);
        this.enginePlaying = false;
        this.engineSound = null;
    }
    
    // Background music management
    playBackgroundMusic() {
        if (!this.audioEnabled || !this.audioContext || !this.music.background || this.musicPlaying) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.music.background;
        source.loop = true;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            this.volume.music * this.volume.master, 
            this.audioContext.currentTime + 2
        );
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
        this.musicPlaying = true;
        this.currentMusicSource = source;
        this.currentMusicGain = gainNode;
    }
    
    stopBackgroundMusic() {
        if (!this.musicPlaying || !this.currentMusicGain) return;
        
        this.currentMusicGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        this.currentMusicSource.stop(this.audioContext.currentTime + 1);
        this.musicPlaying = false;
    }
    
    // Public interface
    playSound(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        this.sounds[soundName].call(this);
    }
    
    setVolume(type, value) {
        this.volume[type] = Math.max(0, Math.min(1, value));
        
        // Update current sounds
        if (type === 'music' && this.currentMusicGain) {
            this.currentMusicGain.gain.setValueAtTime(
                this.volume.music * this.volume.master, 
                this.audioContext.currentTime
            );
        }
        
        if (type === 'engine' && this.engineSound) {
            this.engineSound.gainNode.gain.setValueAtTime(
                this.volume.engine * this.volume.master, 
                this.audioContext.currentTime
            );
        }
    }
    
    toggleMusic() {
        if (this.musicPlaying) {
            this.stopBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
    }
    
    // Cleanup
    dispose() {
        this.stopEngineSound();
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
} 