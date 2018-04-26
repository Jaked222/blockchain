// If we detect that a new block broke the chain or something is wrong with it, 
// there is a way to rollback changes or put the block back into a correct state,
// but that is beyond the scope of this project. This also lacks features such as proof
// of work, peer-to-peer network, and doesn't check funds for coin etc.

const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2018", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBLock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for(var i=1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				console.error('Block hash is incorrect');
				return false;
			}


			if (currentBlock.previousHash !== previousBlock.hash) {
				console.error('Currentblock previousHash not equal to previous hash');
				return false;
			}
		}

	return true;
	}

}

let jakeCoin = new Blockchain();
jakeCoin.addBLock(new Block(1, "01/10/2018", "amount 4"));
jakeCoin.addBLock(new Block(2, "01/11/2018", "amount 10"));

console.log('is chain valid?', jakeCoin.isChainValid());

// // Doing this without the line below will simply break the block
// jakeCoin.chain[1].data = "amount 10000";
// console.log('Changed block data. Is chain valid?', jakeCoin.isChainValid());

// // Breaks the relationship with another block in the chain. Blockchain is made to
// // add blocks to it, but never to delete a block or change it.
// jakeCoin.chain[1].hash = jakeCoin.chain[1].calculateHash();
// //console.log(JSON.stringify(jakeCoin, null, 4));
// console.log('Recalculated chain[1] block hash. Is chain valid?', jakeCoin.isChainValid());

// // Now what if I recalculate the next block also? How can we prevent this issue?
// jakeCoin.chain[2].previousHash = jakeCoin.chain[1].calculateHash();
// //console.log('Recalculated previousHash of chain[2]. Is chain valid?', jakeCoin.isChainValid());

// jakeCoin.chain[2].hash = jakeCoin.chain[2].calculateHash();
// //console.log(JSON.stringify(jakeCoin, null, 4));
// console.log('Recalculated hash of chain[2]. Is chain valid?', jakeCoin.isChainValid());