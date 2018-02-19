// If we detect that a new block broke the chain or something is wrong with it, 
// there is a way to rollback changes or put the block back into a correct state,
// but that is beyond the scope of this project.

// A security issue would be someone changing a block, and then calculating the
// hash for all the blocks after that, and you will end up with a valid chain, even
// though it was tampered with. We also dont want our blockchain to be spammed.
// This is where proof-of-work comes in. You have to prove that you put in a lot of
// computing power to create a block, or 'mining'. 

// Bitcoin requires the hash of a block to begin with a certain amount of 0s. Because
// you cannot influence the output of a hash function, you have to use a lot of computing
// power and hope to get lucky with the correct # of 0s for the hash. This is called 'dificulty',
// and this is set so that there is a steady amount of new blocks. In bitcoins case, the aim
// is to create one new block every 10 minutes. As computers get stronger, the difficulty
// is increased.

const SHA256 = require('crypto-js/sha256');

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, previousHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		// Random # that doesnt have anything to do with block, but can be changed.
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
		this.chain = [new Block("01/01/2018", "Genesis Block", "0")];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
		block.mineBlock(this.difficulty);

		this.chain.push(block);
		
		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;

		for(const block of this.chain) {
			for(const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}
				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}

		return balance;
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
jakeCoin.createTransaction(new Transaction('address1', 'address2', 100));
jakeCoin.createTransaction(new Transaction('address2', 'address1', 50));

jakeCoin.minePendingTransactions('jake-address');
console.log('\nBalance of jake is', jakeCoin.getBalanceOfAddress('jake-address'));

jakeCoin.minePendingTransactions('jake-address');
console.log('\nBalance of jake is', jakeCoin.getBalanceOfAddress('jake-address'));