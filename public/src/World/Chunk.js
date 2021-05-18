var { ChunkBlock } = require("./Block");

class Chunk {      
    constructor(chunk_position, blocks_info, world) {
        this.chunk_position = chunk_position;
        this.world = world;
        this.blocks = [];
        this.loadBlocks(blocks_info);
    }   

    loadBlocks(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            let blockInfo = blocks[i];
            let block = new ChunkBlock(blockInfo.x, blockInfo.y, blockInfo.id, this, this.world);
            this.blocks.push(block);
        }
    }

    update() {
        for (let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            block.display(this.world);
        }
    }
}


module.exports = { Chunk }