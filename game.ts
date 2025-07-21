
import * as THREE from 'three';


import * as LittleJS from 'littlejsengine';




const { EngineObject,mousePos,engineInit } = LittleJS;

class Player extends EngineObject{

    constructor(){
        super();
        this.mass = 0
        this.color = LittleJS.RED;
    }

    update(): void {
        console.log("mouse pos debug", mousePos.copy());
        this.pos = mousePos.copy();
    }
}

function gameInit() {
    const t = new Player();
}
function gameUpdate(){}
function gameUpdatePost(){}
function gameRender(){}
function gameRenderPost(){}


engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);