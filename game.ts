/*

Main Game Logic

(1) Point and Click
(2) Searches for overlaps between the 3d layer and threejs layer

Bugs:
(1) Mouse input isn't been captured and transfered to the player / goat object
*/

"use strict"


import * as THREE from 'three';


import * as LittleJS from 'littlejsengine';

const { tile, vec2, hsl,randColor,drawTextScreen, PI, EngineObject,FontImage, Timer, Sound, ParticleEmitter, timeDelta, Color, overlayContext,overlayCanvas,touchGamepadEnable, isTouchDevice, setTouchGamepadSize,setShowSplashScreen, setTouchGamepadEnable,// do not use pixelated rendering
mousePos,mousePosScreen,isOverlapping, mouseWasPressed,mouseWasReleased, keyWasPressed,setTouchGamepadAlpha,initTileCollision,setTouchGamepadAnalog,setSoundVolume,setSoundEnable, vibrate,setCanvasPixelated, setTileCollisionData, setTilesPixelated, setGravity,setCameraPos, setCameraScale, drawText,engineInit } = LittleJS;


const { Scene, PerspectiveCamera, WebGLRenderer, BufferAttribute, BufferGeometry, MeshBasicMaterial, Mesh } = THREE;
// show the LittleJS splash screen
setShowSplashScreen(false);






'use strict';




/* Declare Global Singletons

 So Typescript is aware of new properties that aren't a default in windows
*/
declare global {
    interface Window {

        THREE_RENDER: ThreeRender,
        globals: Globals,

        music: Music,
        //input: Inputs,
        player: Player,
        enemy: any,//Enemy,
        wallet: any,//Wallet;
        
        useItem: any; 

    }

    interface Vector2 {
        x: number;
        y: number;
        copy(): Vector2;
        add(arg0: Vector2): Vector2;
        multiply(arg0: Vector2): Vector2;
        //directionTo(arg0: Vector2, arg1: Vector2): Vector2;


    }

    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }

    

}




class Music {

    /*
    All Music Logic In One Script

    Functions:
    (1) Plays Music Tracks
    (2) Shuffles Between A Playlist Using Maths module(3) Stores All Music To A Playlist
    (4) Stores All SFX
    (5) Play is called on the sfx track directly
    (6) Music Synthesizer Docs: https://keithclark.github.io/ZzFXM/

    To Do:
    (1) Refactor to use Zzfxm
    */


    // sound effects
    public sound_shoot : LittleJS.Sound;
    public zelda_powerup : LittleJS.Sound;
    public sound_start : LittleJS.Sound;
    public sound_break : LittleJS.Sound;
    public sound_bounce : LittleJS.Sound;
    public sound_zapp : LittleJS.Sound;
    public sound_call : LittleJS.Sound;
    public zelda : String | undefined;
    public current_track : String | undefined;
    public next_track : String | undefined;
    public default_playlist : Map<LittleJS.Sound , number> | null;
    public sfx_playlist : Map<LittleJS.Sound , number>;
    public timer : LittleJS.Timer;
    public counter : number;


    constructor() {

        console.log("Creating Music Node");
        // Initialize the LittleJS Sound System


        this.sound_shoot = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        this.zelda_powerup = new Sound([1.5, , 214, .05, .19, .3, 1, .1, , , 167, .05, .09, , , , .11, .8, .15, .22]);

        // sound effects
        this.sound_start = new Sound([, 0, 500, , .04, .3, 1, 2, , , 570, .02, .02, , , , .04]);
        this.sound_break = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        this.sound_bounce = new Sound([, , 1e3, , .03, .02, 1, 2, , , 940, .03, , , , , .2, .6, , .06]);
        this.sound_zapp = new Sound([1.2,,678,.19,.49,.02,1,4.1,-75,9,-263,.43,,.3,3,,.09,.66,.41,.06,381]); // Random 24
        this.sound_call = new Sound([1.9,,66,.05,.48,.009,,3.1,-38,20,,,.13,,.5,.7,.1,.58,.19,.14,-1495]); // Random 26
        
        //this.zelda = null;

        //this.current_track = null;//"track placeholder";
        //this.next_track = null;//"";
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
        
        console.log("Music Soundtracks ", this.counter);
        
        // to do:
        // (1) Play sound with zzfxm
        // (2) Track beat with zzfxm
        
        //window.globals.PlayingMusic = true;
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

    private THREE: typeof THREE;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    public cube: any | null;


    constructor() {
        //super();
        // create a global threejs object
        this.THREE = THREE;

        //console.log("Three JS Debug 1: ", this.THREE);

        

        //make  scene and camera globally accessible
        // Create the scene, camera, and renderer
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Enable transparency and disable mouse events
        this.renderer = new WebGLRenderer({ 
            alpha: true,
            antialias: true
        });


        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer's DOM element to your target layer
        var threejsContainer = document.getElementById("threejs-layer");
        
        if (threejsContainer){
            //threejsLayer.appendChild(this.renderer.domElement);
            // Make sure the canvas doesn't interfere with mouse input
            const canvas = this.renderer.domElement;
            canvas.style.pointerEvents = 'none';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            threejsContainer.appendChild(canvas);
            console.log("Three.js canvas added with pointer-events: none");
        }
        else {
            console.error("threejs-container not found!");
        }

        console.log("three js layer debug: ", threejsContainer);
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
        //const {  } = this.THREE;


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
            color: this.getRandomColor(),
            wireframe: false,
            transparent: false,
            opacity: 1.0,
        });


        // set mesh geometry and material
        this.cube = new Mesh(geometry, material);

        //return this.cube;
        this.scene.add(this.cube)


    }


    getRandomColor() {
        return Math.random() * 0xffffff;
    }

    setCubePosition(x: number, y : number, z : number) {
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

    deleteCube() {
        if (this.cube) {
            // Remove the cube from the scene
            this.scene.remove(this.cube);

            // Dispose of the cube's geometry and material to free up memory
            if (this.cube.geometry) {
                this.cube.geometry.dispose();
            }
            if (this.cube.material) {
                this.cube.material.dispose();
            }

            // Set the cube reference to null
            this.cube = null;

            console.log("Cube deleted successfully.");
        } else {
            console.warn("No cube to delete.");
        }
    }


    setCamera(Int_Distance: number) {
        // Sets the camera at a specific distance
        console.log("Camera Debug: ",this.camera);
        this.camera.position!.z = Int_Distance;

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





/*
PLAYER CLASS

Features:
(1) Player Script triggers the music player loop and caps it at 250 loops

*/

class PhysicsObject extends EngineObject
{
    constructor()
    {
        super();
        //this.setCollision(); // make object collide
        this.mass = 1; // make object have static physics
    }
}



class Player extends PhysicsObject {
    public health : number;
    public cubePosition : Vector3 | null;
    public groundLevel : number

    

    constructor() {

        super();
        
        
        console.log("Creating Player Sprite");

        
        // Fetch Player Health From Globals Singleton
        // Update Globals With Player Pointer
        this.health = window.globals.health

        // create a pointer to the Particle fx class

        // store player object in global array
        window.globals.players.push(this)

        this.color = randColor();//RED; // make random colour

        this.cubePosition = null; // for storing the cube geometry 3d position 

        this.groundLevel = -13; // ground position for stopping Gravity on Cube 

        
        // Add Player And Cube Collissions Where The Cube Collision tracks the Cube Object

    }
    hit_animation() {

        //use a timer to flash the player object colour from orig  -> white -> orig
        return 0;
    }

    update() {
        // fetching mouse position ever loop is a performance hag, instead, fetch mouse position from 
        // input singleton and interpolate positional data
        // sets Player Sprite Position to Mouse Position
        // mouse position in the screen space
        
        //console.log("position debug :", this.pos, "/", mousePos);
        // works and is buggy mouse pos is captured incorrectly as 0,0      
        //console.log("Mouse in update:", mousePos); // Should work!
        this.pos = mousePos.copy();

        super.update();

        // update cube 3d position
        if (window.THREE_RENDER.cube) {
            // get this cube position
            this.cubePosition = window.THREE_RENDER.getCubePosition();

            
        
            // add gravity to cube
            if (this.cubePosition!.y > this.groundLevel) {
                window.THREE_RENDER.setCubePosition(this.cubePosition!.x, this.cubePosition!.y -= 0.03, this.cubePosition!.z!);
            }
        }

        // Restart Game After win
        if (mouseWasPressed(0) && !window.THREE_RENDER.cube) {

            console.log("Restarting Game Loop");

            // code breaks with a wrong assert once win conditions are met
            console.log("location debug 1: ", location);            
            location.reload();
        }

        // Left Click
        // Nested If's? Bad Code
        if (mouseWasPressed(0) && window.THREE_RENDER.cube) {
            console.log(" Mouse Button 0 Pressed");
            window.music.zelda_powerup.play();

            //this.debugMouseInput();

            // Debug Cube's 2d position to see if overlap occured
            console.log("Player Position Debug: ", mousePos, "/", this.pos);
            console.log("Cube Position Debug: ", Math.ceil(this.cubePosition!.x), "/", Math.ceil(this.cubePosition!.y), "/");


            // Game Win Conditional
            // 
            // Hit Collision Detection
            // rewrite to use collisions instead (done)
            //if (Math.ceil(this.pos.x - this.cubePosition!.x) == 1) { //margin of error
            //    console.log("Player And Cube Overlap on X Axis");

                // increase score count
            //    window.globals.score += 1;

                // delete Cube
                //window.THREE_RENDER.deleteCube();
            //}

            // if player and threeJS cube object collide

            if (isOverlapping(this.pos, this.size, vec2(this.cubePosition?.x, this.cubePosition?.y))){
                console.log("Player & Cube Overlap");
                window.globals.score += 1;

            }

            // rewritten to use littlejs collision system
            //if (Math.ceil(this.pos.y - this.cubePosition!.y) == 1) {
            //    console.log("Player And Cube Overlap on Y Axis");

                //increase score count
            //    window.globals.score += 1;

                //spawn 2d particle fx
                //new ParticleFX(this.pos, this.size);

            //}

            // Win condition
            if (window.globals.score === 3) {

                //spawn 2d particle fx
                new ParticleFX(this.pos, this.size);


                //delete cube
                window.THREE_RENDER.deleteCube();
            }
        }

        // Left Click Released
        //Set The Cube In a Random Position
        if (mouseWasReleased(0)) {
            console.log(" Mouse Button 0 Released");
            //window.music.zelda_powerup.play();

            // Logic : 
            // (1) Set The Cube In a Random Position
            //
            window.THREE_RENDER.setCubePosition(Math.random() * 10 - 5, Math.random() * 15 - 8, 0);

        }



        //window.music.play_track();


    }

    debugMouseInput() {
    console.log("=== Mouse Debug Info ===");
    console.log("mousePos:", mousePos);
    console.log("mousePosScreen:", mousePosScreen);
    console.log("Canvas elements:", document.querySelectorAll('canvas'));
    console.log("Active element:", document.activeElement);
    
    // Check if there are multiple canvases interfering
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas, index) => {
        console.log(`Canvas ${index}:`, {
            id: canvas.id,
            zIndex: getComputedStyle(canvas).zIndex,
            pointerEvents: getComputedStyle(canvas).pointerEvents,
            position: getComputedStyle(canvas).position
        });
    });
}
}





class ParticleFX extends EngineObject {
    // TO DO : (1) Make A Sub function within Player Class 
    // 
    // Extends LittleJS Particle FX mapped to an enumerator
    // attach a trail effect
    constructor(pos: LittleJS.Vector2, size: LittleJS.Vector2) {
        super();
        this.color = new Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        const trailEffect = new ParticleEmitter(
            pos, 0,                          // pos, angle
            size, 0, 80, PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(0, 16),                          // tileIndex, tileSize
            color__, color__,                         // colorStartA, colorStartB
            color__.scale(0), color__.scale(0),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, false, false        // fade, randomness, collide, additive
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
    public health : number;
    public players : any;
    public scenes : any;
    public score : number; 

    constructor() {

        // All Global Variables 

        this.health = 3;
        this.players = []; // internal array to hold all playe objects
        this.scenes = {};// holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
    }
}



// STEP 4: Add canvas cleanup function to call before engine init
function cleanupExtraCanvases() {
    console.log("Cleaning up extra canvases...");
    
    // Get all canvas elements
    const allCanvases = document.querySelectorAll('canvas');
    console.log(`Found ${allCanvases.length} canvas elements`);
    
    // Remove any canvas that's not in the threejs-container
    allCanvases.forEach((canvas, index) => {
        const parent = canvas.parentElement;
        if (parent && parent.id !== 'threejs-container') {
            // Only remove if it's not the LittleJS main canvas (which hasn't been created yet)
            if (canvas.id === 'threejs-layer' || canvas.id === 'littlejs-2d-layer') {
                console.log(`Removing canvas ${index} with id: ${canvas.id}`);
                canvas.remove();
            }
        }
    });
}


/* LittleJS Main Loop*/



function gameInit() {
    // called once after the engine starts up
    // setup the game
    console.log("Game Started!");


    //cleanupExtraCanvases();
    /* Create 3D Scenes And Objects*/
    window.THREE_RENDER = new ThreeRender();


    /* Create Global Singletons & Run System Tests */


    //window.inventory = new Inventory;
    window.globals = new Globals;

    window.music = new Music;

    // Play Music Loop WIth howler JS
    window.music.play_track(); // doesnt work

    var player = new Player();




    //console.log("Music Debug 2: ", window.music.zelda_powerup);
    //console.log("Music Debug 2: ", window.music.current_track);

    //Initialise 3d scene render
    // (1) Create 2 Cubes

    // It can set 2 cubes but only animate 1 cuz of this.cube pointer limitations
    window.THREE_RENDER.Cube();

    window.THREE_RENDER.setCamera(16);

    window.THREE_RENDER.animate();


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
}



function gameRenderPost() {

    //create a font image using built in font
    const font = new FontImage();


     

    // draw text
    //font.drawTextScreen("LittleJS\nHello World!", vec2(200, 50));       

    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // draw to overlay canvas for hud rendering
    
    
    if (window.THREE_RENDER.cube) {
    
        font.drawTextScreen("Score: " + window.globals.score, vec2(200, 50));
    }

    if (!window.THREE_RENDER.cube) {

        //drawText('You Win Click To Play Again! ', 0, 20); // Draw Health Bar Instead
        //drawText('Deaths: ' + 0, overlayCanvas.width * 3 / 4, 20);

        font.drawTextScreen("You Win Click To Play Again! ", vec2(200, 50));

    }
    

}



// Startup LittleJS Engine
// I can pass in the tilemap and sprite sheet directly to the engine as arrays
// i can also convert tile data to json from tiled editor and parse that instead
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['']);


