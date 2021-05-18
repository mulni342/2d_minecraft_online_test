import { World } from "./World/World";
import { Player } from "./World/Player";


var world = new World(50);
let player = new Player(world, 0, 30);

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
