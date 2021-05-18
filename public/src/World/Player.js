var { Vector } = require("./Vector");

class Player {
    constructor(world, coordX, coordY) {
        this.world = world;
        this.world.player = this;
        this.position = new Vector(coordX * world.size, -(coordY * world.size));
        this.static_position = this.position.clone();
        this.velocity = new Vector(0, 0);
        this.velocity.limit = 7;
        this.acceleration = new Vector(0, 0)
        this.acceleration.limit = 0.4;
        this.size = new Vector(this.world.size * 0.9, (this.world.size*2) * 0.95);
        this.camera_offset = new Vector(0, 0);
        this.camera_position = new Vector(this.world.canvas.width / 2, this.world.canvas.height / 2);
        this.camera_accelerator_multiplicator = 1;
        this.velocityLimitX = 3;

        this.speed = new Vector(world.size * 0.002, world.size * 0.002);
        this.keys_down = { "KeyA": false, "KeyD": false };
        window.addEventListener("keydown", (e) => { this.keys_down[e.code] = true });
        window.addEventListener("keyup", (e) => { this.keys_down[e.code] = false });

        this.mouse_coord = new Vector(0, 0);
        this.world.canvas.addEventListener("mousemove", (e) => {
            this.mouse_coord.x = Math.floor((e.clientX - this.camera_offset.x) / this.world.size);
            this.mouse_coord.y = -Math.floor((e.clientY - this.camera_offset.y) / this.world.size);
        });
        
        this.coords = new Vector(0, 0);

        this.world.canvas.addEventListener("click", () => {
            let player_left_x = Math.floor((this.position.x - this.camera_offset.x) / world.worldSize);
            let player_right_x = Math.floor(((this.position.x + this.size.x) - this.camera_offset.x) /this.world.size);
            let player_left_y = Math.floor((this.position.y - this.camera_offset.y) / world.worldSize);
            let player_right_y = Math.floor(((this.position.y + this.size.y) - this.camera_offset.x) / this.world.size);
            if (!((this.mouse_coord.x == player_left_x  && this.mouse_coord.y == player_left_y) || 
                  (this.mouse_coord.x == player_right_x && this.mouse_coord.y == player_right_y))) {
                this.world.createBlock(this.mouse_coord.x, this.mouse_coord.y, 1); }
        });
    }

    camera_position_update() { this.camera_position = new Vector(this.world.canvas.width / 2, this.world.canvas.height / 2); }
    
    camere_movement() {
        var acceleration = Vector.subtract(this.position, this.camera_position);
        acceleration.multiply(this.camera_accelerator_multiplicator);
        this.camera_offset.subtract(acceleration);
        this.position.subtract(acceleration);
    }

    blockCollision(x, y) {
        let lastPos = this.position.clone();

        this.position.x = x;
        this.position.y = y;
        
        var ret = false;
        this.world.blocks.forEach(block => {
            if (this.collision(block)) {
                ret = true; return; }
        });    
        
        this.position = lastPos;

        return ret;
    }

    updatePlayerCoords() {
        var mid_playerX = this.position.x + (this.size.x / 2);        
        var mid_playerY = this.position.y + (this.size.y / 4);        

        this.coords.x = Math.round((mid_playerX - this.camera_offset.x) / this.world.size);
        this.coords.y = Math.round((mid_playerY - this.camera_offset.y) / this.world.size) * -1;

        if (this.coords.x == 0) { this.coords.x = 0; }
    }

    collision(block) {
        let block_pos = block.position;

        if (!block.is_displayed) return;

        return (this.position.y + this.size.y >= block_pos.y && this.position.y < block_pos.y + block.size.y) &&    
               (this.position.x + this.size.x >= block_pos.x && this.position.x < block_pos.x + block.size.x ) }

    draw() {
        this.world.ctx.fillStyle = "rgb(255, 0, 0)";
        this.world.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    update(gtime) {
        this.updatePlayerCoords();
        this.acceleration.x = this.speed.x * (this.keys_down["KeyD"] - this.keys_down["KeyA"]);
        this.acceleration.y += 0.005 * gtime;
        this.acceleration.setLimit();
        this.velocity.add(this.acceleration);
        this.velocity.setLimit();

        if (this.acceleration.x == 0) { this.velocity.x = 0; }

        if (this.blockCollision(this.position.x, this.position.y + this.velocity.y)) {
            while(!this.blockCollision(this.position.x, this.position.y + Math.sign(this.velocity.y))) {
                this.position.y += Math.sign(this.velocity.y);
            }
            this.velocity.y = 0;
            this.acceleration.y = 0;
        }
        
        if (this.blockCollision(this.position.x + this.velocity.x, this.position.y - 1)) {
            while(!this.blockCollision(this.position.x + Math.sign(this.velocity.x), this.position.y - 1)) {
                this.position.x += Math.sign(this.velocity.x); }
            this.velocity.x = 0;
        }

        if (this.velocity.x > this.velocityLimitX) this.velocity.x = this.velocityLimitX
        else if (this.velocity.x < -this.velocityLimitX)  this.velocity.x = -this.velocityLimitX
        this.position.add(this.velocity);
        this.camere_movement();
        this.draw();
        if (this.keys_down.Space && this.blockCollision(this.position.x, this.position.y + 1)) { this.velocity.y = -10; }
    }
}


module.exports = { Player }