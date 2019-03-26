import keythereum from 'keythereum';
import crypto from 'crypto';
import EthereumTx from 'ethereumjs-tx';
import Web3 from 'web3';

export default class InviteWallet {
    constructor(rpcUrl = 'https://rinkeby.infura.io/v3/357ce0ddb3ef426ba0bc727a3c64c873') {
        this.contractAddressRinkeby = '0x920d5ab09f78085d9be70b4cfa5f9c83aabb56f2';
        this.ABI = [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "invite",
                        "type": "string"
                    },
                    {
                        "name": "wallet",
                        "type": "address"
                    },
                    {
                        "name": "walletFileHash",
                        "type": "string"
                    }
                ],
                "name": "createInvite",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "invite",
                        "type": "string"
                    },
                    {
                        "name": "username",
                        "type": "string"
                    }
                ],
                "name": "register",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newWallet",
                        "type": "address"
                    }
                ],
                "name": "resetWallet",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "hash",
                        "type": "string"
                    }
                ],
                "name": "setHash",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "username",
                        "type": "string"
                    }
                ],
                "name": "setUsername",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "username",
                        "type": "string"
                    }
                ],
                "name": "getAddressByUsername",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "username",
                        "type": "string"
                    }
                ],
                "name": "getHashByUsername",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "getHashByWallet",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getMyUsername",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "wallet",
                        "type": "address"
                    }
                ],
                "name": "getUsername",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "username",
                        "type": "string"
                    }
                ],
                "name": "getWalletByUsername",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "userId",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "UsersInfo",
                "outputs": [
                    {
                        "name": "SwarmHash",
                        "type": "string"
                    },
                    {
                        "name": "SwarmType",
                        "type": "uint32"
                    },
                    {
                        "name": "Username",
                        "type": "string"
                    },
                    {
                        "name": "Wallet",
                        "type": "address"
                    },
                    {
                        "name": "WalletFileHash",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "Wallets",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ];
        this.web3 = new Web3(rpcUrl);
        this.fromAddress = null;
        this.privateKey = null;
    }

    setAccount(fromAddress, privateKey) {
        this.fromAddress = fromAddress;
        this.privateKey = new Buffer(privateKey, 'hex');
    }

    createWallet(password = null) {
        return new Promise((resolve, reject) => {
            const dk = keythereum.create();
            if (!password) {
                password = InviteWallet.randomString(10);
            }

            const options = {
                kdf: "pbkdf2",
                cipher: "aes-128-ctr",
                kdfparams: {
                    c: 262144,
                    dklen: 32,
                    prf: "hmac-sha256"
                }
            };

            keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, keyObject => {
                resolve({
                    data: keyObject,
                    password
                });
            });
        });
    }

    validate(keyObject, password) {
        return new Promise((resolve, reject) => {
            keythereum.recover(password, keyObject, data => {
                if (data instanceof Error) {
                    reject(data);
                } else {
                    resolve(data.toString('hex'));
                }
            });
        });
    }

    static randomString(length) {
        return crypto.randomBytes(length).toString('hex');
    }

    getContract(fromAddress) {
        return this.web3.eth.Contract(this.ABI, this.contractAddressRinkeby, {from: fromAddress});
    }

    sendTransaction(method, ...params) {
        const f = this.getContract(this.fromAddress).methods[method](...params);
        const dataF = this.getContract(this.fromAddress).methods[method](...params).encodeABI();

        return this.web3.eth.getTransactionCount(this.fromAddress)
            .then(nonce => {
                return f.estimateGas()
                    .then(gas => {
                        return {
                            nonce,
                            gas
                        }
                    });
            })
            .then(data => {
                const rawTx = {
                    nonce: this.web3.utils.toHex(data.nonce),
                    gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('1', 'gwei')),
                    gasLimit: this.web3.utils.toHex(data.gas),
                    to: this.contractAddressRinkeby,
                    value: this.web3.utils.toHex(0),
                    data: dataF
                };
                const tx = new EthereumTx(rawTx);
                tx.sign(this.privateKey);
                const serializedTx = tx.serialize();

                // promise hack because default promise return incorrect data (error). recheck later
                return new Promise((resolve, reject) => {
                    this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (error, hash) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(hash);
                        }
                    })
                });
            });
    }

    resetAccount() {
        // todo create new account
        // write new account to smart contract (as new reset account)
        // transfer all funds to new account
        // unlink old account from new account
    }

    createInvite(invite, toAddress, fileHash) {
        return this.sendTransaction('createInvite', invite, toAddress, fileHash);
    }

    setUsername(username) {
        return this.sendTransaction('setUsername', username);
    }
}