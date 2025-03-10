import { SHA256 as sha256 } from 'crypto-js';

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }
}

const genesisBlock: Block = new Block(
    0, 
    "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7",
    "",
    1465154705,
    "my genesis block!!"
);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = new Date().getTime() / 1000;
    const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    return newBlock;
}

const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string => {
    return sha256(index + previousHash + timestamp + data).toString();
}

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.error("invalid index");
        return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
        console.error("invalid previous hash");
        return false;
    }
    const hashForNewBlock = calculateHashForBlock(newBlock);
    if (hashForNewBlock != newBlock.hash) {
        console.info(typeof (newBlock.hash) + " " + typeof hashForNewBlock);
        console.error("invalid hash: ", hashForNewBlock + " " + newBlock.hash);
        return false;
    }
    return true;
}

const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === "number"
        && typeof block.hash === "string"
        && typeof block.previousHash === "string"
        && typeof block.timestamp === "number"
        && typeof block.data === "string";
}

const isValidChain = (blockchainToValidate: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    }
    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }
    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
}

const addBlockToChain = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.info("Received blockchain is valid. Replacing current blockchain with received blockchain.");
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.error("Received blockchain invalid");
    }
}

const calculateHashForBlock = (newBlock: Block): string => {
    // FIXME
    throw Error("Function not yet implemented");
}

const broadcastLatest = () => {
    // FIXME
    throw Error("Function not yet implemented");
};

export {
    Block,
    addBlockToChain,
    broadcastLatest,
    calculateHash,
    calculateHashForBlock,
    generateNextBlock,
    getBlockchain,
    getLatestBlock,
    isValidBlockStructure,
    isValidChain,
    isValidNewBlock,
    replaceChain,
}
