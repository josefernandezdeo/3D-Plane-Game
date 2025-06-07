# 📱 Mobile 3D Plane Game

A fully responsive, touch-controlled 3D flight simulator built with Three.js. Pilot a WWII fighter plane through a detailed city environment while engaging UFOs in aerial combat, all optimized for mobile devices.

## 🎮 Play Now

**Live Demo:** [Play Mobile 3D Plane Game](https://josefernandezdeo.github.io/mobile-3d-plane-game/)

## ✨ Features

### 🕹️ Touch Controls
- **Virtual Joystick**: Intuitive analog control for pitch and roll
- **Speed Buttons**: Easy +/- controls for throttle management  
- **Fire Button**: Large, responsive shooting control
- **Camera Toggle**: Switch between follow and orbit camera modes

### 📱 Mobile Optimized
- **Responsive Design**: Adapts to all screen sizes and orientations
- **Touch-First UI**: Designed specifically for mobile gameplay
- **Safe Area Support**: Works perfectly on notched phones
- **Web App Ready**: Install as a PWA on your home screen

### 🎯 Gameplay
- **Realistic Flight Physics**: Quaternion-based flight model
- **UFO Combat**: Engage 3 alien spacecraft with projectile weapons
- **City Environment**: Fly over a detailed urban landscape with buildings, trees, and clouds
- **Particle Effects**: Explosive combat with dynamic particle systems
- **Real-time HUD**: Live flight data and scoring system

### 🎨 Visual Features
- **Modern UI**: Glassmorphism effects with backdrop blur
- **Professional Graphics**: Enhanced lighting with 4K shadow maps
- **Atmospheric Environment**: Dynamic sky, fog, and lighting
- **Smooth Animations**: 60fps optimized performance

## 🎮 How to Play

### Controls
- **Left Joystick**: Control pitch (up/down) and roll (left/right)
- **Speed + Button**: Increase throttle
- **Speed - Button**: Decrease throttle  
- **Red FIRE Button**: Shoot projectiles
- **Camera Button**: Toggle camera view

### Gameplay Tips
- Use smooth joystick movements for better control
- Manage your speed - too fast makes targeting difficult
- Lead your shots when firing at moving UFOs
- Use camera toggle to get better combat angles

## 🚀 Technical Features

### Built With
- **Three.js**: 3D graphics and physics
- **Vanilla JavaScript**: Pure ES6 modules
- **CSS3**: Modern responsive design
- **HTML5**: Semantic structure

### Mobile Optimizations
- Touch event handling with proper gesture support
- Viewport meta tags for mobile browsers
- iOS Safari and Android Chrome optimized
- Hardware acceleration enabled
- Efficient memory management

### Performance
- 60fps smooth gameplay on modern devices
- Optimized asset loading
- Efficient collision detection
- Delta time-based physics

## 🛠️ Development

### Prerequisites
- Modern web browser with WebGL support
- Python 3 (for local development server)

### Local Setup
```bash
# Clone the repository
git clone https://github.com/josefernandezdeo/mobile-3d-plane-game.git
cd mobile-3d-plane-game

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Project Structure
```
mobile-3d-plane-game/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Mobile-first responsive CSS
├── js/
│   ├── main.js            # Game initialization and loop
│   └── modules/
│       ├── Plane.js       # Aircraft physics and model
│       ├── City.js        # Urban environment generation
│       ├── UFO.js         # Enemy AI and models
│       ├── Weapon.js      # Combat and particle systems
│       └── TouchControls.js # Mobile input handling
└── README.md              # This file
```

## 🎯 Game Mechanics

### Flight Model
- **Realistic Physics**: Based on aircraft dynamics
- **Pitch Control**: Nose up/down movement
- **Roll Control**: Banking left/right turns
- **Speed Management**: Throttle control affects climb rate
- **Auto-leveling**: Plane naturally returns to level flight

### Combat System
- **Projectile Physics**: Realistic bullet trajectories
- **Hit Detection**: Precise collision algorithms
- **Explosion Effects**: 20-particle explosion system
- **Scoring**: 100 points per UFO destroyed
- **Respawn System**: UFOs automatically respawn

### Environment
- **Dynamic City**: Procedurally generated buildings
- **Natural Elements**: Trees and clouds for atmosphere
- **Lighting System**: Multi-light setup with shadows
- **Weather Effects**: Atmospheric fog and particle systems

## 📱 Compatibility

### Supported Devices
- **iOS**: iPhone 6+ and iPad (iOS 12+)
- **Android**: Modern devices (Android 7+)  
- **Desktop**: Chrome, Firefox, Safari, Edge

### Screen Sizes
- **Portrait Mode**: Optimized layouts for phones
- **Landscape Mode**: Enhanced for tablets and phones
- **Responsive**: Adapts from 360px to 1920px+ screens

## 🎨 Screenshots

*Coming soon - gameplay screenshots and mobile interface demos*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Maintain mobile-first design principles
- Test on actual mobile devices
- Follow ES6+ JavaScript standards
- Ensure 60fps performance on mid-range devices

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D library
- **Mobile Web Standards**: For touch API specifications
- **WebGL**: For hardware-accelerated graphics

## 📧 Contact

**Developer**: Jose Fernandez  
**Repository**: [mobile-3d-plane-game](https://github.com/josefernandezdeo/mobile-3d-plane-game)

---

*Ready for takeoff? 🛩️ Launch the game and dominate the skies on your mobile device!* 