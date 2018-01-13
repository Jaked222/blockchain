// If we detect that a new block broke the chain or something is wrong with it, 
// there is a way to rollback changes or put the block back into a correct state,
// but that is beyond the scope of this project. This also lacks features such as proof
// of work, peer-to-peer network, and doesn't check funds for coin etc.

// A security issue would be someone changing a block, and then calculating the
// hash for all the blocks after that, and you will end up with a valid chain, even
// though it was tampered with. We also dont want out blockchain to be spammed.
// This is where proof-of-work comes in. You have to prove that you put in a lot of
// computing power to create a block, or 'mining'. 

// Bitcoin requires the hash of a block to begin with a certain amount of 0s. Because
// you cannot influence the output of a hash function, you have to use a lot of computing
// power and hope to get lucky with the correct # of 0s for the hash. This is called 'dificulty',
// and this is set so that there is a steady amount of new blocks. In bitcoins case, the aim
// is to create one new block every 10 minutes. As computers get stronger, the difficulty
// is increased.

const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		// Random # that doesnt have anything to do with block, but can be changed.
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log('Block mined: ', this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2018", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBLock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
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
				console.error('Current hash not equal to previous hash');
				return false;
			}

			return true;
		}
	}
}


let jakeCoin = new Blockchain();

console.log('Mining block 1...');
jakeCoin.addBLock(new Block(1, "01/10/2018", "amount 4"));

console.log('Mining block 2...');
jakeCoin.addBLock(new Block(2, "01/12/2018", "amount 10"));
