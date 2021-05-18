/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/src/World/Block.js":
/*!***********************************!*\
  !*** ./public/src/World/Block.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Blocks_info = __webpack_require__(/*! ./Blocks_info */ "./public/src/World/Blocks_info.json");
var { Vector } = __webpack_require__(/*! ./Vector */ "./public/src/World/Vector.js");

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

/***/ }),

/***/ "./public/src/World/Blocks_info.json":
/*!*******************************************!*\
  !*** ./public/src/World/Blocks_info.json ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"1":{"name":"grass","sprite":"/imgs/blocks/grass.png"},"2":{"name":"grass","sprite":"/imgs/blocks/dirt.png"},"3":{"name":"grass","sprite":"/imgs/blocks/stone.png"}}');

/***/ }),

/***/ "./public/src/World/Player.js":
/*!************************************!*\
  !*** ./public/src/World/Player.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { Vector } = __webpack_require__(/*! ./Vector */ "./public/src/World/Vector.js");

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

/***/ }),

/***/ "./public/src/World/Vector.js":
/*!************************************!*\
  !*** ./public/src/World/Vector.js ***!
  \************************************/
/***/ ((module) => {

/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.limit = undefined;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		this.limit = undefined;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}	

		if (this.limit != undefined) 
			this.setLimit();
		
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		
		if (this.limit != undefined) 
			this.setLimit();
		
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}

		if (this.limit != undefined) 
			this.setLimit();

		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}

		if (this.limit != undefined) 
			this.setLimit();

		return this;
	},
	setLimit: function () {
		if (this.x > this.limit) 
			this.x = this.limit;
		
		if (this.y > this.limit) 
			this.y = this.limit

		if (this.x < -this.limit)
			this.x = -this.limit

		if (this.y < -this.limit) 
			this.y = -this.limit;

	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / b, a.y / b);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};

module.exports = { Vector };

/***/ }),

/***/ "./public/src/World/World.js":
/*!***********************************!*\
  !*** ./public/src/World/World.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Block } = __webpack_require__(/*! ./Block */ "./public/src/World/Block.js");
var { Vector } = __webpack_require__(/*! ./Vector */ "./public/src/World/Vector.js");

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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************!*\
  !*** ./public/src/mainEJS6.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _World_World__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./World/World */ "./public/src/World/World.js");
/* harmony import */ var _World_World__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_World_World__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _World_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./World/Player */ "./public/src/World/Player.js");
/* harmony import */ var _World_Player__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_World_Player__WEBPACK_IMPORTED_MODULE_1__);




var world = new _World_World__WEBPACK_IMPORTED_MODULE_0__.World(50);
let player = new _World_Player__WEBPACK_IMPORTED_MODULE_1__.Player(world, 0, 30);

world.loadBlocks(world_gen_info.blocks);

window.world = world;

let change_camera_accelerator_multiplicator = true;

let ltime = 0, ctime = 0;


requestAnimationFrame(update);
function update(gtime) {    
    world.clean();
    setTimeout(() => { requestAnimationFrame(update); }, 1000/100);

    ctime = gtime - ltime; ltime = gtime;

    player.update(ctime);
    world.updateBlocks();

    if (change_camera_accelerator_multiplicator) {
        player.camera_accelerator_multiplicator = 0.08;
        change_camera_accelerator_multiplicator = false;
    }
}

})();

/******/ })()
;
//# sourceMappingURL=mainEJS6.js.map