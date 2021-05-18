const { Block } = require("./Block");
var { Vector } = require("./Vector");

class World {
    constructor(size) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight;
        this.worldRenderDistance = new Vector(20, 15);

        this.canvas.addEventListener('contextmenu', event => event.preventDefault());

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.size = size;
        this.blocks = [];
        this.player = undefined;

        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight,
            this.ctx = this.canvas.getContext("2d");
            this.player.camera_position_update();
            this.ctx.imageSmoothingEnabled = false; });
    }

    arrayRemove(arr, value) {    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    
    createBlock(coordX, coordY, id) {   
        for (let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            if (block.coord.x == coordX && block.coord.y == coordY) { return; }
        }
        let block = new Block(coordX, coordY, id, this);
        this.blocks.push(block);
        return block;
    }   

    clean() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }

    updateBlocks() {
        this.blocks.forEach((block, index) => {
            if (block.delete_in_next_update) {
                this.blocks = this.arrayRemove(this.blocks, index)
            } else {
                block.update();
            }
        });
    }

    loadBlocks(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            let block_info = blocks[i];
            let block = new Block(block_info.x, block_info.y, block_info.id, this);
            this.blocks.push(block);
        }
    }
}


module.exports = { World } 