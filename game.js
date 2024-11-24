/*

Main Game Logic

(1) Using LittleJS As A Module
(2) LJS Docs : https://github.com/KilledByAPixel/LittleJS/blob/21a43bc96335fabfd80ecfb132382d6d1a6fea31/src/engineExport.js#L210
*/

"use strict"


// TO DO: import only the modules you need for faster load time
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';//'/node_modules/three/src/Three.js';


// show the LittleJS splash screen
setShowSplashScreen(true);

// Show Game Pad on Mobile Devices
touchGamepadEnable = true;

//console.log("Engine Version: ", engineVersion);
/*
All Music Logic In One Script

Functions:
(1) Plays Music Tracks
(2) Shuffles Between A Playlist Using Maths module(3) Stores All Music To A Playlist
(4) Stores All SFX
(5) Play is called on the sfx track directly

Notes:
(1) The SFX and Music Use 2 Different Systems, SFX USes ZzFX a js midi engine
    whereas Music Uses Audio Tags written into the index.html file and called by Element ID
(2) Most Browsers Refuse Audio music play by default unless the player / user enters an input gesture
*/



'use strict';




// sound effects


class Music {

    constructor() {

        console.log("Creating Music Node");
        this.sound_shoot = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);


        this.zelda_powerup = new Sound([1.5, , 214, .05, .19, .3, 1, .1, , , 167, .05, .09, , , , .11, .8, .15, .22]); // Powerup 9// Powerup 9

        // sound effects
        this.sound_start = new Sound([, 0, 500, , .04, .3, 1, 2, , , 570, .02, .02, , , , .04]);
        this.sound_break = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        this.sound_bounce = new Sound([, , 1e3, , .03, .02, 1, 2, , , 940, .03, , , , , .2, .6, , .06]);

        //
        this.current_track = null;//"track placeholder";
        this.next_track = null;//"";
        this.default_playlist = null;//{ 0: "", 1: "" };
        this.timer = new Timer();
        this.counter = 0;
        // Map sounds to different sound effects and play them via an enumerator/global script
        //required for a music shuffler
        this.sfx_playlist = new Map([
            [this.zelda_powerup, 0],
            [this.sound_shoot, 1],
        ])
    }

    play_track() {

        console.log("310-world-map-loop ", this.counter);
        //document.getElementById("310-world-map-loop").play();

        //console.log("310-world-map-loop", this.counter);
        //document.getElementById("310-world-map-loop").play();
        //
        //<audio id="310-world-map-loop">
        //   <source src="https://drive.google.com/file/d/1fjGxGP-RJtHTA71e3cHfTNUxRKDFtS_x/view?usp=drive_link" type="audio/ogg">
        //</audio>


        this.counter += 1;
        //window.globals.PlayingMusic = true;
    }


}

/*
Functions:

(1) Handles And Porpagates all Input In the Game
(2) Stores Input to An Input Buffer
(3) Handles creation and Destruction of Game HUD as a child
(4) Maps Player Input Action To A Global Enum

*/

class Inputs {

    constructor() {
        // Input Buffer
        this.input_buffer = [];

        //Input Satte Machine Enumeration
        this.input_state = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
            ['ATTACK', 4],
            ['ROLL', 5],
        ]);


        // Testing Input Enumeration
        console.log("Input Debug 1: ", this.input_state.get("UP"));
        //console.log("Input Debug 2: ",input_state.get("ATTACK");
    }

    // Returns The Input Buffer as An Array
    get_Buffer() {
        return this.input_buffer
    }

    update() {
        // Maps Key Presses To Input States And Appends Them to The input buffer
        //
        // Move UP
        //console.log("Testing Input Singleton");
        if (keyWasPressed('KeyW')) {
            console.log("key W as pressed! ")
            this.input_buffer.push(this.input_state.get("UP"));
        }

        // Move Down
        if (keyWasPressed('KeyS')) {
            this.input_buffer.push(this.input_state.get("DOWN"));
        }

        // Move Left
        if (keyWasPressed('KeyA')) {
            this.input_buffer.push(this.input_state.get("LEFT"));
        }

        // Move Right
        if (keyWasPressed('KeyD')) {
            input_buffer.push(this.input_state.get("RIGHT"));
        }


        // Prevents Buffer/ Mem Overflow for Input Buffer
        if (this.input_buffer.length > 12) {
            this.input_buffer.length = 0; // Clears the array
        }
    }
}


/*
Inventory Singleton


Functions
(1) Handles All Player Inventory
(2) 

*/

class Inventory {


    constructor() {
        //super();
        console.log("Loading Inventory Singleton")
        this.items = {}; // Internal dictionary to store inventory items
    }

    // Add or update an item in the inventory
    set(itemName, quantity) {
        if (quantity <= 0) {
            delete this.items[itemName]; // Remove item if quantity is zero or less
        } else {
            this.items[itemName] = (this.items[itemName] || 0) + quantity;
        }
    }

    // Retrieve the quantity of an item
    get(itemName) {
        return this.items[itemName] || 0; // Return 0 if the item doesn't exist
    }

    // Check if an item exists in the inventory
    has(itemName) {
        return itemName in this.items;
    }

    // Remove an item completely from the inventory
    remove(itemName) {
        delete this.items[itemName];
    }

    // Get a list of all items
    getAllItems() {
        return { ...this.items }; // Return a copy of the inventory
    }

    // Count total unique items
    getItemCount() {
        return Object.keys(this.items).length;
    }

    // Count total quantity of all items
    getTotalQuantity() {
        return Object.values(this.items).reduce((sum, quantity) => sum + quantity, 0);
    }
}


/*

3d Rendering Engine

Features
(0) Maps to the background layer
(1) Uses WebGL and Maths for 3d rendering
(2) Overlays 3d rendering to The viewport via css-style sheet ID canvas
(3) TO DO: Load GLTF Models

Bugs
(1) The 3d Renderer should ideally be in a separate class
(2) This codebase runs littlejs as a module to allow importing Threejs
(3) Is a performance hog, should be used sparingly/ optimised for mobi
*/



class ThreeRender {


    constructor() {
        //super();
        // create a global threejs object
        this.THREE = THREE;

        console.log("Three JS Debug 1: ", this.THREE);

        const { Scene, PerspectiveCamera, WebGLRenderer } = this.THREE;

        //make  scene and camera globally accessible
        // Create the scene, camera, and renderer
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();


        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer's DOM element to your target layer
        var threejsLayer = document.getElementById("threejs-layer");
        threejsLayer.appendChild(this.renderer.domElement);

        // A placeholder for the cube mesh
        this.cube = null;

    };
    renderAnimation() {

        // class wide animation function
        this.renderer.render(this.scene, this.camera);
        //requestAnimationFrame(animate);

    }


    renderStill() {
        // renders a still image with no animmation
        this.renderer.render(this.scene, this.camera);

    }

    Cube() {

        /**
        AN OPtimised way of drawing a Cube in Threejs using Webgl directly 
        
         Features:
         (1)Fast Loading Of 3d geometry using Webgl directly and optimised

         To DO:
         (1) Add Positional Parameters CUbe Objects
        
        */


        console.log("Creating 3D Cube Object");

        // Load required Libraries from Global THreejs class
        const { BufferAttribute, BufferGeometry, MeshBasicMaterial, Mesh } = this.THREE;


        // Geometry and wireframe
        //

        // Create a rotating cube
        //const geometry = new BoxGeometry();

        //optimization:
        //using buffer geometry instead of box geometry
        // Define BufferGeometry manually
        const geometry = new BufferGeometry();

        // Define the vertices of a cube (12 triangles, 36 vertices, 3 per face)
        const vertices = new Float32Array([
            // Front face
            -1, -1, 1,  // Bottom left
            1, -1, 1,  // Bottom right
            1, 1, 1,  // Top right
            -1, 1, 1,  // Top left

            // Back face
            -1, -1, -1,  // Bottom left
            -1, 1, -1,  // Top left
            1, 1, -1,  // Top right
            1, -1, -1,  // Bottom right
        ]);

        // Define the indices for the cube (triangles)
        const indices = [
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face
            3, 2, 6, 3, 6, 5,
            // Bottom face
            0, 7, 1, 0, 4, 7,
            // Right face
            1, 7, 6, 1, 6, 2,
            // Left face
            0, 3, 5, 0, 5, 4
        ];

        // Create the normal vectors for each face
        const normals = new Float32Array([
            // Front
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            // Back
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            // Top
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            // Bottom
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            // Right
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            // Left
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        ]);

        // Set geometry attributes
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new BufferAttribute(normals, 3));
        geometry.setIndex(indices); // Use indices for efficiency



        // Green 0x00ff00
        //White 0xffffff

        // Basic material

        const material = new MeshBasicMaterial({
            color: 0xffffff,
            wireframe: false,
            transparent: false,
            opacity: 1.0,
        });


        // set mesh geometry and material
        this.cube = new Mesh(geometry, material);

        //return this.cube;
        this.scene.add(this.cube)


    }

    //addToScene(mesh) {
    // accepts only a Mesh Type
    //Add Geometry to scene
    //    this.scene.add(mesh);


    //}
    setCubePosition(x, y, z) {
        if (this.cube) {
            this.cube.position.set(x, y, z);
        } else {
            console.warn("Cube has not been created yet.");
        }
    }

    getCubePosition() {
        if (this.cube) {
            return {
                x: this.cube.position.x,
                y: this.cube.position.y,
                z: this.cube.position.z,
            };
        } else {
            console.warn("Cube has not been created yet.");
            return null;
        }
    }


    setCamera(Int_Distance) {
        // Sets the camera at a specific distance
        this.camera.position.z = Int_Distance;

    }

    animate() {
        // Bind `this` to preserve context in animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the cube
            if (this.cube) {
                this.cube.rotation.x += 0.01;
                this.cube.rotation.y += 0.01;
            }

            // Render the scene
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}


/*

Utils.js

Features: 
(1)  Contains All Game Object Logic in One Script
(2)  Contrains Base Class for Player, ENemy And All Interactible Objecs like Coins and Items
(3) Extends Static Functions to Other Scenes For Handing Maths, and Logical Caculations asides Simulation Logic
*/




class GameObject extends EngineObject {
    // Base Class for All Game Objects
    constructor() {
        super();
        console.log("Loading Utils Singleton");

    }

}

/*
PLAYER CLASS

Features:
(1) Player Script triggers the music player loop and caps it at 250 loops

*/

class Player extends GameObject {

    constructor() {

        super();
        console.log("Creating Player Sprite");

        // Fetch Player Health From Globals Singleton
        // Update Globals With Player Pointer
        this.health = window.globals.health

        // create a pointer to the Particle fx class

        // store player object in global array
        window.globals.players.push(this)

        this.color = RED;

    }
    hit_animation() {

        //use a timer to flash the player object colour from orig  -> white -> orig
        return 0;
    }

    update() {
        // fetching mouse position ever loop is a performance hag, instead, fetch mouse position from 
        // input singleton and interpolate positional data
        // sets Player Sprite Position to Mouse Position
        this.pos = mousePos;

        // Player Objects Handles All Input
        if (keyWasPressed('KeyW')) { //works
            console.log("key W as pressed! ")
            new ParticleFX(this.pos, this.size)
        }
        //window.music.play_track();
        //THis triggers when the player makes an input giving permission from the dom to play Music
        // hacky fix
        //if (window.music.counter < 250) { //caps the amount of loops needed to trigger music
        //window.music.play_track();
        //    window.music.play_track();
        //    return 0;
        //}
        //save input data to Input Class via globals


    }
}



class Items extends GameObject {
    // Items Base Class For Bombs, Arrows, Health Potion
    constructor(item) {
        if (item == "Generic Item") {
            // Should Increase Player Speed

            return 0;
        }
        if (item == "Bomb") {
            // Should Instance A Bomb sprite with Animations

            return 0;
        }

        if (item == "Health Potion") {
            // Should Increase Players Health

            return 0;
        }
        if (item == "Magic Potion") {
            // Should Increase Player Magic Meter

            return 0;
        }

        if (item == "Coin") {
            // Should Increase Player Coin Count

            return 0;
        }
    }
}

class ParticleFX extends GameObject {
    // Extends LittleJS Particle FX mapped to an enumerator
    // attach a trail effect
    constructor(pos, size) {
        super();
        const color = hsl(0, 0, .2);
        this.trailEffect = new ParticleEmitter(
            pos, 0,                          // pos, angle
            size, 0, 80, PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(0, 16),                          // tileIndex, tileSize
            color, color,                         // colorStartA, colorStartB
            color.scale(0), color.scale(0),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, 0, 1        // fade, randomness, collide, additive
        );

        // play some sfx
        window.music.sound_start.play();
    }

}

/*
Globals Singleton

Features: 
(1) Holds All Global Variants in one scrupt
(2) Can Only Store Data, Cannot Manipulate Data



*/

class Globals {
    constructor() {

        // All Global Variables 

        this.health = 3;
        this.players = []; // internal array to hold all playe objects
        this.scenes = {};// holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop

    }
}

// Fruit Manager Class Extend ThreeJS Render Class Wit Custom Commands
class FruitManager extends ThreeRender {

    constructor() {


        // Create Scene
        //this.scene = new this.THREE.scene;
        this.fruits = []; //fruits would be sphere geometry shapes
        this.gravity = new this.THREE.Vector3(0, -9.8, 0); // Simulate gravity


    }

    // Function to spawn a fruit
    spawnFruit() {
        // Create a sphere (representing a fruit)
        const geometry = new this.THREE.SphereGeometry(0.5, 32, 32);
        const material = new this.THREE.MeshBasicMaterial({ color: this.getRandomColor() });
        const fruit = new this.THREE.Mesh(geometry, material);

        // Set random position and velocity
        fruit.position.set(
            this.THREE.MathUtils.randFloat(-5, 5), // Random X
            this.THREE.MathUtils.randFloat(1, 5), // Random Y (above the ground)
            this.THREE.MathUtils.randFloat(-5, 5) // Random Z
        );
        fruit.velocity = new this.THREE.Vector3(
            this.THREE.MathUtils.randFloat(-1, 1), // Random X velocity
            this.THREE.MathUtils.randFloat(2, 5), // Upward Y velocity
            this.THREE.MathUtils.randFloat(-1, 1) // Random Z velocity
        );

        this.fruits.push(fruit);
        this.scene.add(fruit);
    }



    // Function to update fruit positions
    update(deltaTime) {
        this.fruits.forEach((fruit) => {
            // Apply gravity and update position
            fruit.velocity.add(this.gravity.clone().multiplyScalar(deltaTime));
            fruit.position.add(fruit.velocity.clone().multiplyScalar(deltaTime));

            // Remove fruits that fall below a certain threshold
            if (fruit.position.y < -5) {
                this.scene.remove(fruit);
                this.fruits = this.fruits.filter((f) => f !== fruit);
            }
        });
    }

    // Utility to get a random color
    getRandomColor() {
        return Math.random() * 0xffffff;
    }




}


/* LittleJS Main Loop*/



function gameInit() {
    // called once after the engine starts up
    // setup the game
    console.log("Game Started!");

    /* Create 3D Scenes And Objects*/
    window.THREE_RENDER = new ThreeRender();


    /* Create Global Singletons & Run System Tests */


    window.inventory = new Inventory;
    window.globals = new Globals;

    window.music = new Music;

    //make global
    //window.music = music;

    const input = new Inputs; // No Global Input Class, Player Object Handles Own Inputs
    const player = new Player();


    // Add  Inventory Items
    window.inventory.set("apple", 5);
    window.inventory.set("banana", 3);
    console.log(window.inventory.getAllItems());

    //const TwoDCanvas = document.getElementById('littlejs-2d-layer')


    //Debug music fx
    //works
    window.music.zelda_powerup.play();

    //console.log("Music Debug 2: ", window.music.zelda_powerup);
    //console.log("Music Debug 2: ", window.music.current_track);

    //Initialise 3d scene render
    // (1) Create 2 Cubes

    // It can set 2 cubes but only animate 1 cuz of this.cube pointer limitations
    window.THREE_RENDER.Cube();
    //window.THREE_RENDER.Cube();

    console.log("Cube Position Debug: ", window.THREE_RENDER.getCubePosition());

    //window.THREE_RENDER.addToScene(c1);
    // window.THREE_RENDER.addToScene(c2);
    window.THREE_RENDER.setCamera(16);

    window.THREE_RENDER.animate();

    // start fruit manager logic
    //const fruitManager = new FruitManager();

    // Spawn fruits every second
    //setInterval(() => fruitManager.spawnFruit(), 1000);
    //const deltaTime = clock.getDelta();
    //fruitManager.update(deltaTime);



}

function gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state

}

function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render
    setCameraPos(vec2(5));
}

function gameRender() {
    // triggers the LittleJS renderer
    // called before objects are rendered
    // draw any background effects that appear behind objects
    //const y = new glContext;

    //drawRect(cameraPos, vec2(100), new Color(.5, .5, .5)); // draw background
}



function gameRenderPost() {
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // draw to overlay canvas for hud rendering
    drawText = (text, x, y, size = 40) => {
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'top';
        overlayContext.font = size + 'px arial';
        overlayContext.fillStyle = '#fff';
        overlayContext.lineWidth = 3;
        overlayContext.strokeText(text, x, y);
        overlayContext.fillText(text, x, y);
    }
    drawText('Health: ' + window.globals.health, overlayCanvas.width * 1 / 4, 20); // Draw Health Bar Instead
    drawText('Deaths: ' + 0, overlayCanvas.width * 3 / 4, 20);

    //

    //debug 3d renderer
    //console.log("Three Debug 3: ", window.THREE_RENDER.THREE);
}



// Startup LittleJS Engine
// I can pass in the tilemap and sprite sheet directly to the engine as arrays
// i can also convert tile data to json from tiled editor and parse that instead
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);


