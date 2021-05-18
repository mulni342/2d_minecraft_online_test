var Blocks_info = require("./Blocks_info");
var { Vector } = require("./Vector");

class Block {
    constructor(coordX, coordY, id, world) {
        this.position = new Vector(coordX * world.size, -(coordY * world.size));
        this.static_position = this.position.clone();
        this.coord = new Vector(coordX, coordY);
        this.id = id;
        this.world = world;
        this.solid_block = true;
        this.delete_in_next_update = false;
        this.size = new Vector(this.world.size, this.world.size);
        this.is_displayed = false;
        this.img = document.createElement("img");
        this.img.src = Blocks_info[this.id].sprite;

    }

    remove() { this.delete_in_next_update = true }; 

    display() {
        var px = Math.abs(this.world.player.coords.x - this.coord.x);
        var py = Math.abs(this.world.player.coords.y - this.coord.y);
        
        if (px < this.world.worldRenderDistance.x) {
            if (py < this.world.worldRenderDistance.y) {
                this.world.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);    
                this.is_displayed = true;
                return;
            }
        }
    }

    update() {
        this.position.x = (this.static_position.x + this.world.player.camera_offset.x);
        this.position.y = (this.static_position.y + this.world.player.camera_offset.y);
        this.display();
    }

}

module.exports = { Block }