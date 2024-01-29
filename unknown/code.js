let canvas = document.getElementById("myCanvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

let blockSize = 50;
let mouseBut = [false, false, false];
let mousePos = [0, 0];
let keys = {
    "a": false,
    "w": false,
    "s": false,
    "d": false,
    "z": false
}
let keyPressed = "none";

function copyOBJ(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function areObjectsEqual(obj1, obj2) {
    // Check if both parameters are objects
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2; // Compare non-object values directly
  }

  // Check if both objects are null
  if (obj1 === null && obj2 === null) {
    return true;
  }

  // Check if only one object is null (the other must be an object)
  if (obj1 === null || obj2 === null) {
    return false;
  }

  // Get the keys of the objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate through keys and recursively compare values
  for (const key of keys1) {
    // Check if the other object has the same key
    if (!keys2.includes(key)) {
      return false;
    }

    // Recursively compare nested objects
    if (!areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // If all checks pass, the objects are deep equal
  return true;
}

Math.seedrandom = function (seed) {
    return function () {
      var x = Math.sin(seed++) * 10000; 
      return x - Math.floor(x);
    };
  };

function seededRandomXY(x, y) {
    const seed = Math.abs(x).toString() + Math.abs(y).toString();
    const rng =new Math.seedrandom(parseInt(seed));
    return rng();
  }

//character data
const skin = new Image();
skin.src = `assets/img/character.png`;
let character = {
    "x":0,
    "y":0,
    "validpos": [0, 0],
    "hitbox": [0.8, 0.8],
    "defaultspeed": 1 / 16,
    "speed": 1 / 16,
    "direction": 0,
    "skin": skin,
    "health": 100,
    "maxhealth": 100,
    "energy": 100,
    "maxenergy": 100,
    "inventory": []
}
let previousenergy = character.maxenergy;


let world = {
    "blocks": {
    },
    "entities": {
    }
}
const groundColor = "rgb(121,205,7)";

//block data
let blocks = {
    0: {
        "name": "air",
        "texture": "none",
        "state": "gas",
        "hardness": Infinity,
        "maxhardness": Infinity,
        "tools":{
            'none':0
        },
        "stackability": 0
    },
    1: {
        "name": "dirt",
        "texture": "dirt",
        "state": "solid",
        "hardness": 30,
        "maxhardness": 30,
        "tools":{
            'shovel':true
        },
        "stackability": 64
    },
    2: {
        "name": "stone",
        "texture": "stone",
        "state": "solid",
        "hardness": 300,
        "maxhardness": 300,
        "tools":{
            'pickaxe':true
        },
        "stackability": 64
    },
    3: {
        "name": "grass",
        "texture": "grass",
        "state": "phase",
        "hardness": 1,
        "maxhardness": 1,
        "tools":{
            'none':true
        },
        "stackability": 64
    },
    4: {
        "name": "wood",
        "texture": "wood",
        "state": "solid",
        "hardness": 150,
        "maxhardness": 150,
        "tools":{
            'axe':true
        },
        "stackability": 64
    },
    5: {
        "name": "leaves",
        "texture": "leaves",
        "state": "solid",
        "hardness": 10,
        "maxhardness": 10,
        "tools":{
            'axe':true,
            "shears":true
        },
        "stackability": 64
    },
    6: {
        "name": "planks",
        "texture": "planks",
        "state": "solid",
        "hardness": 150,
        "maxhardness": 150,
        "tools":{
            'axe':true
        },
        "stackability": 64
    },
    7: {
        "name": "floorPlanks",
        "texture": "floorPlanks",
        "state": "phase",
        "hardness": 150,
        "maxhardness": 150,
        "tools":{
            'axe':true
        },
        "stackability": 64
    }
};

//entity data
let entities = {
    0:{
        "name":"stick",
        "tool":"none",
        "maxdurability":1,
        "durability":1,
        "texture":"stick",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":64
    },
    1:{
        "name":"axe",
        "tool":"axe",
        "maxdurability":2000,
        "durability":2000,
        "texture":"axe",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":2
    },
    2:{
        "name":"shovel",
        "tool":"shovel",
        "maxdurability":1300,
        "durability":1300,
        "texture":"shovel",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":1
    },
    3:{
        "name":"pickaxe",
        "tool":"pickaxe",
        "maxdurability":4000,
        "durability":4000,
        "texture":"pickaxe",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":2
    },
    4:{
        "name":"purePower",
        "tool":"all",
        "maxdurability":Infinity,
        "durability":Infinity,
        "texture":"purePower",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":99999
    },
    5:{
        "name":"stoneAxe",
        "tool":"axe",
        "maxdurability":2000,
        "durability":2000,
        "texture":"stoneAxe",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":3
    },
    6:{
        "name":"stonePickaxe",
        "tool":"pickaxe",
        "maxdurability":4000,
        "durability":4000,
        "texture":"stonePickaxe",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":4
    },
    7:{
        "name":"stoneShovel",
        "tool":"shovel",
        "maxdurability":1300,
        "durability":1300,
        "texture":"stoneShovel",
        "hardness": 0,
        "maxhardness": 0,
        "stackability":1,
        "mineStrength":2
    },
    8:{
        "name":"earthqaukeBall",
        "texture":"earthqaukeBall",
        "hardness": Infinity,
        "maxhardness": Infinity,
    }
}

//craft recipes
let craftRecipes={
    "#air#air#air#air#wood#air#air#air#air":{
        "product":["block",6],
        "number":4
    }, //planks
    "#air#air#air#air#planks#air#air#planks#air":{
        "product":["entity",0],
        "number":4
    }, //sticks
    "#planks#planks#air#planks#stick#air#air#stick#air":{
        "product":["entity",1],
        "number":1
    }, //axe
    "#air#planks#air#air#stick#air#air#stick#air":{
        "product":["entity",2],
        "number":1
    }, //shovel
    "#air#air#air#planks#planks#air#air#air#air":{
        "product":["block",7],
        "number":2
    }, //floorPlanks
    "#planks#planks#planks#air#stick#air#air#stick#air":{
        "product":["entity",3],
        "number":1
    }, //pickaxe
    "#stone#stone#air#stone#stick#air#air#stick#air":{
        "product":["entity",5],
        "number":1
    }, //stoneAxe
    "#stone#stone#stone#air#stick#air#air#stick#air":{
        "product":["entity",6],
        "number":1
    }, //stonePickaxe
    "#air#stone#air#air#stick#air#air#stick#air":{
        "product":["entity",7],
        "number":1
    } //stoneShovel
}

//adds inventory slots
for (let i = 0; i < 40; i++) {
    character.inventory.push([0, copyOBJ(blocks[0]), 'none']);
}
character.inventory[0]=[1, copyOBJ(entities[1]), 'entity']
character.inventory[1]=[1, copyOBJ(entities[2]), 'entity']
character.inventory[2]=[1, copyOBJ(entities[6]), 'entity']
character.inventory[3]=[1, copyOBJ(entities[4]), 'entity']
world.blocks['0#0']=blocks[0]


//object to save textures
let textures = {

}
//loads all the textures by adding the pictures to an object
for (let key in blocks) {
    if (blocks[key].texture != "none") {
        let image = new Image(blockSize, blockSize);
        image.src = `assets/img/${blocks[key].texture}.png`;
        textures[blocks[key].texture] = image;
    }
};
for (let key in entities) {
    if (entities[key].texture != "none") {
        let image = new Image(blockSize, blockSize);
        image.src = `assets/img/${entities[key].texture}.png`;
        textures[entities[key].texture] = image;
    }
};
//load other textures
let craftButton0=new Image();
craftButton0.src=`assets/img/craftButton/0.png`
let craftButton1=new Image();
craftButton1.src=`assets/img/craftButton/1.png`
let craftButton2=new Image();
craftButton2.src=`assets/img/craftButton/2.png`


class perlinNoise {
    constructor(seed) {
        this.seed = seed;
    }
    random1(x, y) {
        let seed = (Math.abs(x) << 16) * Math.abs(y) * this.seed;
        let mod = 972342342432313;
        let a = 48722345333;
        let c = 6921212533422;
        return Math.abs((1 / (mod - 1)) * ((a * (seed) + c) % mod));
    }
    random2(x, y) {
        let seed = (Math.abs(x) << 16) * Math.abs(y) * this.seed;
        let mod = 97253455467873;
        let a = 48722345768333;
        let c = 439890587384;
        return Math.abs((1 / (mod - 1)) * ((a * (seed) + c) % mod));
    }
    perlin2D(x, y) {
        let bucket = 0;
        let num = 0;
        for (let a = -1; a < 3; a++) {
            for (let b = -1; b < 3; b++) {
                let x3 = Math.floor(x) + a;
                let y3 = Math.floor(y) + b;
                let n1 = this.random1(x3, y3) * Math.PI * 2;
                let n2 = this.random2(x3, y3);
                let x2 = n2 * Math.cos(n1) + x3;
                let y2 = n2 * Math.sin(n1) + y3;
                let d = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
                d = 1 - 1 / (1 + Math.E ** (-d * 2.1));
                bucket += d;
                num += 1;
            }
        }
        x = bucket / num;
        return 1 / (1 + Math.E ** (-((x * 2 - 1) * 12) - 9));
    }
}
let terrain = new perlinNoise(10346488);

const ItemDropSize = 0.3;

//id keys for entities id
const IDkeys = "qwertyuiopasdfghjklzxcvbnm";

function generateBlock(a, b) {
    if (!world.blocks[`${a}#${b}`]) {
        let p = terrain.perlin2D((a) / 10, (b) / 10) + 0.3;
        let generatedBlock = 0;
        if (p <= 0.5) {
            if (seededRandomXY(a,b) > 0.8) {
                generatedBlock = 3;
            } else if (seededRandomXY(a,b) > 0.75) {
                generatedBlock = 4;
                for (let aa = -1; aa < 2; aa++) {
                    for (let bb = -1; bb < 2; bb++) {
                        if (seededRandomXY(a,b) > 0.2) {
                            if (!world.blocks[`${a + aa}#${b + bb}`]) {
                                world.blocks[`${a + aa}#${b + bb}`] = copyOBJ(blocks[5])
                            } else if (world.blocks[`${a + aa}#${b + bb}`].name == "air") {
                                world.blocks[`${a + aa}#${b + bb}`] = copyOBJ(blocks[5])
                            }
                        }
                    }
                }
            }
        }
        if (p > 0.5) {
            generatedBlock = 1;
        }
        if (p > 0.55) {
            generatedBlock = 2;
        }
        world.blocks[`${a}#${b}`] = copyOBJ(blocks[generatedBlock]);
    }
}

//set some variables for updating game
let hotBarSlot = 1;
let inInventory=false;
let alreadyPressed={
    "i":false,
    "leftclick":false
}
let moveItem=[0,copyOBJ(blocks[0]),"none"];
let recipe="";
let previousSlot=["inventory",-1]

//fill the crafting table with nothing to avoid glitching
let craft=[]
for(let i=0;i<9;i++){
    craft.push(copyOBJ([0,blocks[0],"none"]))
}

//function to make new entities
function newEntity(obj,x,y,type,vx,vy){
    let newID = "0";
    while (world.entities[newID]) {
        newID = "";
        for (let i1 = 0; i1 < 10; i1++) {
            newID += IDkeys[Math.round(Math.random() * (IDkeys.length - 1))];
        }
    }
    world.entities[newID] = {
        "x": x,
        "y": y,
        "vx":vx,
        "vy":vy,
        "type": type,
        "content": copyOBJ(obj)
    }
}

//updates the game data
function update() {
    //change between craft,world,inventory modes 
    if (keys['i']) {
        if(!alreadyPressed['i']){
            inInventory=!inInventory
            alreadyPressed['i']=true
        }
    }else{
        alreadyPressed['i']=false
    }

    //moves the character
    character.validpos = [character.x, character.y];
    character.speed = character.defaultspeed;
    if(!inInventory){
        if (character.energy == 0) {
            character.speed = character.speed / 2;
        }
        if (keys['a']) {
            character.x -= character.speed;
        }
        if (keys['d']) {
            character.x += character.speed;
        }
        if (keys['w']) {
            character.y -= character.speed;
        }
        if (keys['s']) {
            character.y += character.speed;
        }

        //change the hotbar slot
        if (!isNaN(keyPressed)) {
            if (parseInt(keyPressed) > 0) {
                hotBarSlot = parseInt(keyPressed) - 1
            }
        }
    }


    //define the area of the world that should be loaded
    let sx = Math.floor(character.x - canvas.width / blockSize / 2 - 4);
    let sy = Math.floor(character.y - canvas.height / blockSize / 2 - 4);
    let ex = Math.floor(character.x + canvas.width / blockSize / 2 + 4);
    let ey = Math.floor(character.y + canvas.height / blockSize / 2 + 4);

    //corrects character position
    let chax = character.x + 1 / 2 - character.hitbox[0] / 2;
    let chay = character.y + 1 / 2 - character.hitbox[1] / 2;

    let chax2 = character.validpos[0] + 1 / 2 - character.hitbox[0] / 2;
    let chay2 = character.validpos[1] + 1 / 2 - character.hitbox[1] / 2;

    //loads and generates all blocks
    for (let a = sx - 1; a <= ex + 1; a++) {
        for (let b = sy - 1; b <= ey + 1; b++) {
            //generates terrain using perlin
            generateBlock(a, b)
        }
    }
    //loads and updates all blocks
    for (let a = sx; a <= ex; a++) {
        for (let b = sy; b <= ey; b++) {
            let blockX = a * blockSize + canvas.width / 2 - blockSize / 2 - character.x * blockSize;
            let blockY = b * blockSize + canvas.height / 2 - blockSize / 2 - character.y * blockSize;


            //handles collisions bewteeen player and blocks
            if (a + 1 > chax && a < chax + character.hitbox[0] && b + 1 > chay && b < chay + character.hitbox[1]) {
                if (world.blocks[`${a}#${b}`].state == "solid") {
                    character.x = character.validpos[0];
                    character.y = character.validpos[1];
                    if (world.blocks[`${Math.floor(chax2 - character.speed)}#${Math.floor(chay2)}`].state != "solid" && world.blocks[`${Math.floor(chax2 - character.speed)}#${Math.floor(chay2 + character.hitbox[1])}`].state != "solid" && keys['a']) {
                        character.x -= character.speed;
                    }
                    if (world.blocks[`${Math.floor(chax2 + character.speed + character.hitbox[0])}#${Math.floor(chay2)}`].state != "solid" && world.blocks[`${Math.floor(chax2 + character.speed + character.hitbox[0])}#${Math.floor(chay2 + character.hitbox[1])}`].state != "solid" && keys['d']) {
                        character.x += character.speed;
                    }
                    if (world.blocks[`${Math.floor(chax2)}#${Math.floor(chay2 - character.speed)}`].state != "solid" && world.blocks[`${Math.floor(chax2 + character.hitbox[0])}#${Math.floor(chay2 - character.speed)}`].state != "solid" && keys['w']) {
                        character.y -= character.speed;
                    }
                    if (world.blocks[`${Math.floor(chax2)}#${Math.floor(chay2 + character.speed + character.hitbox[1])}`].state != "solid" && world.blocks[`${Math.floor(chax2 + character.hitbox[0])}#${Math.floor(chay2 + character.speed + character.hitbox[1])}`].state != "solid" && keys['s']) {
                        character.y += character.speed;
                    }
                }
            }

            //allows the user to mine blocks
            if (mousePos[0] > blockX && mousePos[0] < blockX + blockSize && mousePos[1] > blockY && mousePos[1] < blockY + blockSize) {
                if (mouseBut[0] && !inInventory) {
                    if (world.blocks[`${a}#${b}`].hardness > 0) {
                        let mineStrength = 0;
                        if (world.blocks[`${a}#${b}`].tools["none"]) {
                            mineStrength = 1;
                        }else if(world.blocks[`${a}#${b}`].tools[character.inventory[hotBarSlot][1].tool] || character.inventory[hotBarSlot][1].tool=="all"){
                            mineStrength=character.inventory[hotBarSlot][1].mineStrength
                            if(character.inventory[hotBarSlot][1].name!="purePower"){
                                character.inventory[hotBarSlot][1].durability-=1
                            }
                        }
                        world.blocks[`${a}#${b}`].hardness -= mineStrength;
                        if (world.blocks[`${a}#${b}`].hardness < 0) {
                            world.blocks[`${a}#${b}`].hardness = 0;
                        }
                    }
                }
                ctx.fillStyle = "rgb(150,150,150)";
                ctx.fillRect(blockX, blockY, blockSize, blockSize);
                if (mouseBut[2] && !inInventory) {
                    if (world.blocks[`${a}#${b}`].name == "air") {
                        if (character.inventory[hotBarSlot][2] == "block" && character.inventory[hotBarSlot][0] > 0) {
                            character.inventory[hotBarSlot][0] -= 1
                            world.blocks[`${a}#${b}`] = copyOBJ(character.inventory[hotBarSlot][1])
                            if (character.inventory[hotBarSlot][0] <= 0) {
                                character.inventory[hotBarSlot][0] = 0
                                character.inventory[hotBarSlot][1] = copyOBJ(blocks[0])
                                character.inventory[hotBarSlot][2] = 'none'
                            }
                        }
                    }
                }
            }

            //makes the blocks transfrom into entities to be collected by user
            if (world.blocks[`${a}#${b}`].hardness == 0) {
                world.blocks[`${a}#${b}`].hardness = world.blocks[`${a}#${b}`].maxhardness;
                newEntity(world.blocks[`${a}#${b}`],a+(1-ItemDropSize)/2,b+(1-ItemDropSize)/2,'block',0,0);
                world.blocks[`${a}#${b}`] = copyOBJ(blocks[0]);
            }

        }
    }
    for (let i of Object.keys(world.entities)) {
        let entity = world.entities[i]
        entity.x+=entity.vx;
        entity.y+=entity.vy;
        if (entity.type == "block" || (entity.type=="entity" && entity.content.hardness==0)) {
            //calculates the distance between the character and drop 
            let dx = entity.x + ItemDropSize / 2 - chax - character.hitbox[0] / 2;
            let dy = entity.y + ItemDropSize / 2 - chay - character.hitbox[1] / 2;
            let d = Math.sqrt(dx * dx + dy * dy);
            let fx = 0;
            let fy = 0;

            //moves drop to character
            if (d < 2) {
                let F = 0;
                F = -0.2 / d;
                fx += (F * dx);
                fy += (F * dy);
            }
            entity.x += fx;
            entity.y += fy;

            if (d < ItemDropSize / 2) {
                //adds the drop to the inventory
                for (let slot = 0, len = character.inventory.length; slot < len; slot++) {
                    if (character.inventory[slot][1].name == 'air') {
                        character.inventory[slot][2] = entity.type
                        character.inventory[slot][1] = copyOBJ(entity.content);
                        character.inventory[slot][0] = 1;
                        delete world.entities[i];
                        break;
                    } else {
                        if (areObjectsEqual(entity.content, character.inventory[slot][1])) {
                            if (character.inventory[slot][0] < character.inventory[slot][1].stackability) {
                                character.inventory[slot][0] += 1;
                                delete world.entities[i];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    if(!inInventory){
        for (let i = 0; i < 9; i++) {
            //updates the hot bar
            if(character.inventory[i][1].durability && character.inventory[i][1].durability<=0){
                character.inventory[i][0]=0
                character.inventory[i][1]=copyOBJ(blocks[0])
                character.inventory[i][2]='none'
            }

            //item powers
            if(character.inventory[i][1].name="purePower"){
                if(keys.z){
                    let speed=10;
                    for(let balls=0;balls<6;balls++){
                        let angle=Math.PI*2*balls/6
                        newEntity(entities[8],chax,chay,Math.cos(angle)*speed,Math.sin(angle)*speed)
                    }
                }
            }
        }
    }

    if(inInventory){
        //update inventory
        let startX=(canvas.width-slotSize*3)/2;
        let startY=(canvas.height/2-slotSize*3)/2;
        let x=startX;
        let y=startY;
        let len=craft.length;
        //updates crafting sqaure
        recipe=""
        for(let i=0;i<len;i++){
            if(mousePos[0]>x+border && mousePos[0]<x+border+innerSlotSize && mousePos[1]>y+border && mousePos[1]<y+border+innerSlotSize){
                if (mouseBut[0]) {
                    if(!alreadyPressed['leftclick']){
                        let temp=copyOBJ(moveItem)
                        moveItem=copyOBJ(craft[i])
                        craft[i]=copyOBJ(temp)
                        alreadyPressed['leftclick']=true
                    }
                    previousSlot[0]="craft"
                    previousSlot[1]=-1
                }else{
                    alreadyPressed['leftclick']=false
                }
                if(mouseBut[2]){
                    if(previousSlot[0]!="craft" || previousSlot[1]!=i){
                        previousSlot[0]="craft"
                        previousSlot[1]=i
                        if(moveItem[1].name!="air"){
                            if(craft[i][1].name=="air"){
                                craft[i][0]=1
                                craft[i][1]=copyOBJ(moveItem[1])
                                craft[i][2]=moveItem[2]
                                moveItem[0]-=1
                                if(moveItem[0]<=0){
                                    moveItem[0]=0
                                    moveItem[1]=copyOBJ(blocks[0])
                                    moveItem[2]="none"
                                }
                            }else{
                                if(areObjectsEqual(moveItem[1],craft[i][1])){
                                    if(craft[i][0]<craft[i][1].stackability){
                                        craft[i][0]+=1
                                        moveItem[0]-=1
                                        if(moveItem[0]<=0){
                                            moveItem[0]=0
                                            moveItem[1]=copyOBJ(blocks[0])
                                            moveItem[2]="none"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{
                    previousSlot[0]="craft"
                    previousSlot[1]=-1
                }            
            }
            x+=slotSize
            if((i+1)%3==0){
                y+=slotSize
                x=startX
            }
            recipe+="#"+craft[i][1].name;
        }
        x=canvas.width/2+slotSize*3/2+(canvas.width/2+slotSize*3/2-slotSize)/2;
        y=(canvas.height/2-slotSize)/2;
        let craftButX=startX+slotSize*3+(x-(startX+slotSize*3))/2-slotSize;
        if(mousePos[0]>craftButX && mousePos[0]<craftButX+slotSize*2 && mousePos[1]>y && mousePos[1]<y+slotSize){
            if(mouseBut[0]){
                if(craftRecipes[recipe]){
                    for(let n=0;n<craftRecipes[recipe].number;n++){
                        if(craftRecipes[recipe].product[0]=="block"){
                            newEntity(blocks[craftRecipes[recipe].product[1]],chax,chay,'block',0,0)
                        }else{
                            newEntity(entities[craftRecipes[recipe].product[1]],chax,chay,'entity',0,0)
                        }
                    }
                    let len=craft.length;
                    for(let i=0;i<len;i++){
                        craft[i][0]-=1
                        if(craft[i][0]<=0){
                            craft[i][0]=0
                            craft[i][1]=copyOBJ(blocks[0])
                            craft[i][2]="block"
                        }
                    }
                }
            }
        }
        startX=0;
        startY=canvas.height/2;
        x=startX;
        y=startY;
        len=character.inventory.length;
        //updates inventory
        for(let i=0;i<len;i++){
            if(mousePos[0]>x+border && mousePos[0]<x+border+innerSlotSize && mousePos[1]>y+border && mousePos[1]<y+border+innerSlotSize){
                if (mouseBut[0]) {
                    if(!alreadyPressed['leftclick']){
                        let temp=copyOBJ(moveItem)
                        moveItem=copyOBJ(character.inventory[i])
                        character.inventory[i]=copyOBJ(temp)
                        alreadyPressed['leftclick']=true
                    }
                    previousSlot[0]="craft"
                    previousSlot[1]=-1
                }else{
                    alreadyPressed['leftclick']=false
                }
                if(mouseBut[2]){
                    if(previousSlot[0]!="inventory" || previousSlot[1]!=i){
                        previousSlot[0]="inventory"
                        previousSlot[1]=i
                        if(moveItem[1].name!="air"){
                            if(character.inventory[i][1].name=="air"){
                                character.inventory[i][0]=1
                                character.inventory[i][1]=copyOBJ(moveItem[1])
                                character.inventory[i][2]=moveItem[2]
                                moveItem[0]-=1
                                if(moveItem[0]<=0){
                                    moveItem[0]=0
                                    moveItem[1]=copyOBJ(blocks[0])
                                    moveItem[2]="none"
                                }
                            }else{
                                if(areObjectsEqual(moveItem[1],character.inventory[i][1])){
                                    if(character.inventory[i][0]<character.inventory[i][1].stackability){
                                        character.inventory[i][0]+=1
                                        moveItem[0]-=1
                                        if(moveItem[0]<=0){
                                            moveItem[0]=0
                                            moveItem[1]=copyOBJ(blocks[0])
                                            moveItem[2]="none"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{
                    previousSlot[0]="craft"
                    previousSlot[1]=-1
                } 
            }
            x+=slotSize
            if((i+1)%9==0){
                y+=slotSize
                x=startX
            }
        }
    }

    //controls the energy based of the users actions
    character.energy += character.maxenergy / 1000;
    if (!(character.x == character.validpos[0] && character.y == character.validpos[1])) {
        character.energy -= 0.13;
    }
    if (previousenergy > character.energy) {
        character.maxenergy += (previousenergy - character.energy) / 400;
    }
    previousenergy = character.energy;
    if (character.energy < 0) {
        character.energy = 0;
    }
    if (character.energy > character.maxenergy) {
        character.energy = character.maxenergy;
    }

    //controls the health based of the users actions
    if (character.health < 0) {
        character.health = 0;
    }
    if (character.health > character.maxhealth) {
        character.health = character.maxhealth;
    }
}


function drawImage(ctx, image, x, y, w, h, degrees) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(degrees);
    ctx.translate(-x - w / 2, -y - h / 2);
    ctx.drawImage(image, x, y, w, h);
    ctx.restore();
}

//set some variables for rendering
ctx.font = "20px Arial";
let slotSize = 70;
let innerSlotSize = 60;
let border=(slotSize - innerSlotSize) / 2;

//renders all the data
function draw() {
    //define if inventory or world should be drawn
    if(!inInventory){
        ctx.fillStyle = groundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //define the area of the world that should be rendered
        let sx = Math.floor(character.x - canvas.width / blockSize / 2);
        let sy = Math.floor(character.y - canvas.height / blockSize / 2);
        let ex = Math.floor(character.x + canvas.width / blockSize / 2) + 1;
        let ey = Math.floor(character.y + canvas.height / blockSize / 2) + 1;

        //draw the world blocks
        for (let a = sx; a <= ex; a++) {
            for (let b = sy; b <= ey; b++) {
                if (world.blocks[`${a}#${b}`].texture != "none") {
                    let blockX = a * blockSize + canvas.width / 2 - blockSize / 2 - character.x * blockSize;
                    let blockY = b * blockSize + canvas.height / 2 - blockSize / 2 - character.y * blockSize;
                    ctx.drawImage(textures[world.blocks[`${a}#${b}`].texture], blockX, blockY, blockSize, blockSize);
                }
            }
        }

        //draw all world entities
        for (let i in world.entities) {
            let entity = world.entities[i];
            if(entity.content.texture!="none"){
                ctx.drawImage(textures[entity.content.texture], entity.x * blockSize + canvas.width / 2 - blockSize / 2 - character.x * blockSize, entity.y * blockSize + canvas.height / 2 - blockSize / 2 - character.y * blockSize, ItemDropSize * blockSize, ItemDropSize * blockSize);
            }
        }

        //change the way character faces based on direction moved and draws the character
        if (character.x - character.validpos[0] < 0) {
            character.direction = Math.PI * 1.5;
        }
        if (character.x - character.validpos[0] > 0) {
            character.direction = Math.PI * 0.5;
        }
        if (character.y - character.validpos[1] < 0) {
            character.direction = 0;
        }
        if (character.y - character.validpos[1] > 0) {
            character.direction = Math.PI;
        }
        drawImage(ctx, character.skin, canvas.width / 2 - character.hitbox[0] * blockSize / 2, canvas.height / 2 - character.hitbox[1] * blockSize / 2, character.hitbox[0] * blockSize, character.hitbox[1] * blockSize, character.direction);
        //draw manna and stamina stats
        ctx.fillStyle = "rgb(150,150,150)";
        ctx.fillRect(canvas.height / 30 - 6, canvas.height / 30 - 6, canvas.width / 6 + 12, canvas.height / 16 + canvas.height / 16 + 18);
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(canvas.height / 30, canvas.height / 30, canvas.width / 6, canvas.height / 16);
        ctx.fillStyle = "rgb(64,191,0)";
        ctx.fillRect(canvas.height / 30, canvas.height / 30, canvas.width / 6 * (character.health / character.maxhealth), canvas.height / 16);
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(canvas.height / 30, canvas.height / 30 + 6 + canvas.height / 16, canvas.width / 6, canvas.height / 16);
        ctx.fillStyle = "rgb(51,153,255)";
        ctx.fillRect(canvas.height / 30, canvas.height / 30 + 6 + canvas.height / 16, canvas.width / 6 * (character.energy / character.maxenergy), canvas.height / 16);

        //draw the main inventory bar
        let startX = (canvas.width - 9 * slotSize) / 2;
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(startX, canvas.height - slotSize, slotSize * 9, slotSize);
        ctx.fillStyle = "rgb(51,153,255)";
        ctx.fillRect(startX + slotSize * hotBarSlot, canvas.height - slotSize, slotSize, slotSize);
        let x;
        let y;
        for (let i = 0; i < 9; i++) {
            //draw the inventory items onto main inventory bar
            x=startX + slotSize * i + border
            y=canvas.height - slotSize + border;
            ctx.fillStyle = "rgb(200,200,200)";
            ctx.fillRect(x, y, innerSlotSize, innerSlotSize);
            if (character.inventory[i][1].texture != "none") {
                ctx.drawImage(textures[character.inventory[i][1].texture], x, y, innerSlotSize, innerSlotSize);
                ctx.fillStyle = "rgb(40,40,40)";
                if(character.inventory[i][0]>1){
                    ctx.fillText(`${character.inventory[i][0]}`, x, y + innerSlotSize)
                }
                if(character.inventory[i][1].durability && character.inventory[i][1].durability<character.inventory[i][1].maxdurability){
                    ctx.fillStyle = "rgb(64,191,0)";
                    ctx.fillRect(x,y+innerSlotSize*9/10,innerSlotSize*character.inventory[i][1].durability/character.inventory[i][1].maxdurability,innerSlotSize*1/10);
                }
            }

        }

    //draw inventory   
    }else{
        let backgroundColor="rgb(200,200,200)"
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //define where crafting sqaure rendering should start
        let startX=(canvas.width-slotSize*3)/2;
        let startY=(canvas.height/2-slotSize*3)/2;
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(startX,startY,slotSize*3,slotSize*3);
        let x=startX;
        let y=startY;
        let len=craft.length;
        //draw the items in crafting sqaure
        for(let i=0;i<len;i++){
            ctx.fillStyle = "rgb(230,230,230)";
            ctx.fillRect(x+ border,y+ border,innerSlotSize,innerSlotSize);
            if(craft[i][1].texture != "none"){
                ctx.drawImage(textures[craft[i][1].texture], x+ border,y+ border,innerSlotSize,innerSlotSize);
                if(craft[i][0]>1){
                    ctx.fillStyle = "rgb(40,40,40)";
                    ctx.fillText(`${craft[i][0]}`,x+ border,y+ border+innerSlotSize)
                }
            }
            if(craft[i][1].durability && craft[i][1].durability<craft[i][1].maxdurability){
                ctx.fillStyle = "rgb(64,191,0)";
                ctx.fillRect(x+border,y+border+innerSlotSize*9/10,innerSlotSize*craft[i][1].durability/craft[i][1].maxdurability,innerSlotSize*1/10);
            }
            x+=slotSize
            if((i+1)%3==0){
                y+=slotSize
                x=startX
            }
        }
    
        //draws the item that can be crafted
        x=canvas.width/2+slotSize*3/2+(canvas.width/2+slotSize*3/2-slotSize)/2;
        y=(canvas.height/2-slotSize)/2;
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(x,y,slotSize,slotSize);
        ctx.fillStyle = "rgb(230,230,230)";
        ctx.fillRect(x+border,y+border,innerSlotSize,innerSlotSize);
        if(craftRecipes[recipe]){
            let currentTexture;
            if(craftRecipes[recipe].product[0]=="block"){
                currentTexture=blocks[craftRecipes[recipe].product[1]].texture
            }else{
                currentTexture=entities[craftRecipes[recipe].product[1]].texture
            }
            ctx.drawImage(textures[currentTexture],x+border,y+border,innerSlotSize,innerSlotSize);
        }

        //draw the craft button
        let craftButX=startX+slotSize*3+(x-(startX+slotSize*3))/2-slotSize;
        if(mousePos[0]>craftButX && mousePos[0]<craftButX+slotSize*2 && mousePos[1]>y && mousePos[1]<y+slotSize){
            if(mouseBut[0]){
                ctx.drawImage(craftButton2,craftButX,y,slotSize*2,slotSize);
            }else{
                ctx.drawImage(craftButton1,craftButX,y,slotSize*2,slotSize);
            }
        }else{
            ctx.drawImage(craftButton0,craftButX,y,slotSize*2,slotSize);
        }

        //draw inventory
        startX=0;
        startY=canvas.height/2;
        x=startX;
        y=startY;
        len=character.inventory.length;
        for(let i=0;i<len;i++){
            ctx.fillStyle = "rgb(100,100,100)";
            ctx.fillRect(x,y,slotSize,slotSize);
            ctx.fillStyle = "rgb(230,230,230)";
            ctx.fillRect(x+ border,y+ border,innerSlotSize,innerSlotSize);
            if(character.inventory[i][1].texture != "none"){
                ctx.drawImage(textures[character.inventory[i][1].texture], x+ border,y+ border,innerSlotSize,innerSlotSize);
                if(character.inventory[i][0]>1){
                    ctx.fillStyle = "rgb(40,40,40)";
                    ctx.fillText(`${character.inventory[i][0]}`,x+ border,y+ border+innerSlotSize)
                }
            }
            if(character.inventory[i][1].durability && character.inventory[i][1].durability<character.inventory[i][1].maxdurability){
                ctx.fillStyle = "rgb(64,191,0)";
                ctx.fillRect(x+border,y+border+innerSlotSize*9/10,innerSlotSize*character.inventory[i][1].durability/character.inventory[i][1].maxdurability,innerSlotSize*1/10);
            }
            x+=slotSize
            if((i+1)%9==0){
                y+=slotSize
                x=startX
            }
        }
        //draw the moved item
        if(moveItem[1].texture!="none"){
            ctx.drawImage(textures[moveItem[1].texture], mousePos[0]-innerSlotSize/2,mousePos[1]-innerSlotSize/2,innerSlotSize,innerSlotSize);
            if(moveItem[0]>1){
                ctx.fillStyle = "rgb(40,40,40)";
                ctx.fillText(`${moveItem[0]}`,mousePos[0]-innerSlotSize/2,mousePos[1]-innerSlotSize/2+innerSlotSize)
            }
        }
    }
}
//main loop
let fps = 60;
let time = new Date();
function animate() {
    if (new Date() - time > 1000 / fps) {
        //adjust canvas if window changes
        if (canvas.height != window.innerHeight || canvas.width != window.innerWidth) {
            canvas = document.getElementById("myCanvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx = canvas.getContext("2d");
            ctx.font = "20px Arial";
        }

        time = new Date();
        update();
        draw();
    }
    requestAnimationFrame(animate);
}
animate()

window.addEventListener("mousemove", (event) => {
    mousePos[0] = event.offsetX;
    mousePos[1] = event.offsetY;
})
window.addEventListener("mousedown", (event) => {
    mouseBut[event.button] = true;
})
window.addEventListener("mouseup", (event) => {
    mouseBut[event.button] = false;
})

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});
document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
    keyPressed = event.key;
})
document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
    keyPressed = "none";
})