# SimulationWebGame

A fruit ninja style web game made using LittleJS & ThreeJs. The fruit items would be gltf loaded 3d models

How to Test on Android
(1) install termux
(2) install nodejs and npm
(3) install littlejsengine using npm
(4) install live-server using npm for testing
(5) run live-server using npx live-server
(6) Open the url in your mobile browser and test gameplay

How to Structure Data
(1) Video Script format, where Utils.js holds a video scripy class and Each Scene Extends that class
(2) Globals store all Variables and Other Classes only manipulate Global variants, they cannot store data

2D/3D Combination
Combining LittleJS and Three.js to create a 2D/3D hybrid game renderer is possible by utilizing LittleJS for game logic and 2D rendering, while Three.js handles 3D rendering.

TO DO:

(1) Track Player Object Data to Global Singleton
(2) Create Particle FX Class
(3) Create Enemy Class + Logic
(4) Implement Music Shuffle Logic In Music Class
(5) Dynamic Animatin Changes For 3d Material and 2d sprites
(6) UI
