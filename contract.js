var Web3 = require('web3');
var fs = require('fs');
var Tx = require('ethereumjs-tx').Transaction;

let address;
let ownerAddress;
let ownerPrivateKey;
let privateKey;
let baseUrl;
let ethWContractAddress;
let omgWContractAddress;
let omgContractAddress;

process.argv.forEach(function (val, index, array) {
    if (val && index == 2) {
        env = val;
    }
    if (val && index == 3) {
        trader = val;
    }
});

if (process.env.MODE === "main") {
    omgContractAddress =  '';
    omgWContractAddress = '';
    ethWContractAddress = '';
    baseUrl = 'https://mainnet.infura.io/v3/' +  process.env.INFURA_API_KEY;

    ownerAddress = '0x0FE1829403d422470cd4cf0aBAd4bCEc9aA2eBF6';
    ownerPrivateKey = '75dfcedfefce284ba566e11dc193f21aa196c464bf6b20bba288aa99aebde9ba';

    if (process.env.TRADER === "1") {
        address = '';
        privateKey = '';
    } else {
        address = '';
        privateKey = '';
    }
} else if (process.env.MODE === "ropsten") {
    omgContractAddress =  '0x04133cc7f88bdd38376d36Ba2d91CE0E21958C5D';
    omgWContractAddress = '0xba5889e8b4f891dcb308cbe3182ac0e528447de2';
    ethWContractAddress = '0xbd40ae7049f2f12c7c8cead00781c2993e88f940';
    baseUrl = 'https://ropsten.infura.io/v3/' +  process.env.INFURA_API_KEY;

    ownerAddress = '';
    ownerPrivateKey = '';

    if (process.env.TRADER === "1") {
        address = '';
        privateKey = '';
    } else {
        address = '';
        privateKey = '';
    }
} else {
    baseUrl = 'http://localhost:8545';
    omgContractAddress =  '0xF23276778860e420aCFc18ebeEBF7E829b06965c';
    omgWContractAddress = '0x72D5A2213bfE46dF9FbDa08E22f536aC6Ca8907e';
    ethWContractAddress = '0x59adefa01843C627BA5d6Aa350292b4B7cCAE67a';   

    ownerAddress = '0x5409ED021D9299bf6814279A6A1411A7e866A631'; // accounts[0] in dev ganache
    ownerPrivateKey = 'f2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d';

    if (process.env.TRADER === "1") {
        address = '0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84'; // accounts[2] in dev ganache
        privateKey = 'df02719c4df8b9b8ac7f551fcb5d9ef48fa27eef7a66453879f4d8fdc6e78fb1';
    } else {
        address = '0xE834EC434DABA538cd1b9Fe1582052B880BD7e63'; // accounts[3] in dev ganache
        privateKey = 'ff12e391b79415e941a94de3bf3a9aee577aed0731e297d5cfa0b8a1e02fa1d0';
    }
}

const web3 = new Web3(new Web3.providers.HttpProvider(baseUrl));
const delay = (ms) => new Promise(res => setTimeout(res, ms));
function waitConfirmedTx(txHash) {
    return new Promise(async (resolve, reject) => {
      var finish = false;
      while (!finish) {
        web3.eth.getTransactionReceipt(txHash, (err, res) => {
            if(err){
              finish = true;
              reject(err);
            }
            if (res) {
              finish = true;
              resolve(res);
            }
        });
        await delay(2000);
      }
    });
}

async function deployContract(contractFile, arguments) {
    try {
        const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
        const privateKeyBytes = new Buffer.from(ownerPrivateKey, 'hex');
        const count = await getNonce(ownerAddress);
        const contract = new web3.eth.Contract(obj.abi).deploy({
            data: obj.data.slice(0,2) === '0x' ? obj.data : '0x' + obj.data,
            arguments: arguments
        });
        const gasLimit = parseInt(await contract.estimateGas({from: ownerAddress}) * 1.5);
        const gasPrice = parseInt(await web3.eth.getGasPrice() * 1.5);
        const rawTransaction = {
            nonce: web3.utils.toHex(count),
            from: ownerAddress,
            gasLimit: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: contract.encodeABI()
        }

        var transaction;
        if (process.env.MODE === 'ropsten')
            transaction = new Tx(rawTransaction, {chain:'ropsten', hardfork: 'petersburg'});
        else if (process.env.MODE === 'main')
            transaction = new Tx(rawTransaction, {chain:'mainnet', hardfork: 'petersburg'});
        else
            transaction = new Tx(rawTransaction);

        transaction.sign(privateKeyBytes);
        var serialized = '0x' + transaction.serialize().toString('hex');
        var ret = await web3.eth.sendSignedTransaction(serialized);
        await waitConfirmedTx(ret.transactionHash);
        return ret.contractAddress;
    } catch (err) {
        console.log('!!!', err);
    }
    return undefined;
}

async function deployContractWeb3(contractFile, arguments) {
    var obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
    var contract = new web3.eth.Contract(obj.abi);
    contract.deploy({
        data: '0x' + obj.data,
        arguments: arguments
    }).send({
        from: ownerAddress,
        gas: 2100000,
        gasPrice: '1000000000'
    }, function (error, transactionHash) {
        if (error) {
            console.log('123', error); return;
        }
        console.log(transactionHash)
    });
}

async function balanceOf(contractFile, contractAddress, fromAddress) {
    var obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
    const abi = obj.abi;
    var contract = new web3.eth.Contract(abi, contractAddress, {from: address})

    return await contract.methods.balanceOf(fromAddress).call();
}

async function getNonce(address) {
    var count = await  web3.eth.getTransactionCount(address, "pending");
    return count;
}

async function approve(contractFile, contractAddress, fromAddress, fromPrivKey, spenderAddress, amount) {
    try {
        const count = await getNonce(fromAddress);
        const privateKeyBytes = new Buffer.from(fromPrivKey, 'hex');
        const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
        const contract = new web3.eth.Contract(obj.abi, contractAddress, {
            from: fromAddress
        }).methods.approve(spenderAddress, web3.utils.toHex(amount));
        const gasLimit = parseInt(await contract.estimateGas({from: fromAddress}) * 1.5);
        const gasPrice = parseInt(await web3.eth.getGasPrice() * 1.5);
        var rawTransaction = {
            "from":address,
            "gasPrice":web3.utils.toHex(gasPrice),
            "gasLimit":web3.utils.toHex(gasLimit),
            "to":contractAddress,
            "value":"0x0",
            "data":contract.encodeABI(),
            "nonce":web3.utils.toHex(count)
        }
        
        var transaction;
        if (process.env.MODE === 'ropsten')
            transaction = new Tx(rawTransaction, {chain:'ropsten', hardfork: 'petersburg'});
        else if (process.env.MODE === 'main')
            transaction = new Tx(rawTransaction, {chain:'mainnet', hardfork: 'petersburg'});
        else
            transaction = new Tx(rawTransaction);

        transaction.sign(privateKeyBytes);
        var serialized = '0x' + transaction.serialize().toString('hex');
        var ret = await web3.eth.sendSignedTransaction(serialized);
        await waitConfirmedTx(ret.transactionHash);
        return ret.transactionHash;
    } catch(err) {
        console.log('!!!', err);
    }
}

async function deposit(contractFile, contractAddress, fromAddress, fromPrivKey, amountToDeposit, duration) {
    try {
        const count = await getNonce(fromAddress);
        const privateKeyBytes = new Buffer.from(fromPrivKey, 'hex');
        const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
        const contract = new web3.eth.Contract(obj.abi, contractAddress, {
            from: fromAddress
        }).methods.deposit(
            web3.utils.toHex(amountToDeposit), 
            web3.utils.toHex(duration));

        const gasLimit = parseInt(await contract.estimateGas({from: fromAddress}) * 1.5);
        const gasPrice = parseInt(await web3.eth.getGasPrice() * 1.5);
        var rawTransaction = {
            "from":fromAddress,
            "gasPrice":web3.utils.toHex(gasPrice),
            "gasLimit":web3.utils.toHex(gasLimit),
            "to":contractAddress,
            "value":"0x0",
            "data":contract.encodeABI(),
            "nonce":web3.utils.toHex(count)
        }
        
        var transaction;
        if (process.env.MODE === 'ropsten')
            transaction = new Tx(rawTransaction, {chain:'ropsten', hardfork: 'petersburg'});
        else if (process.env.MODE === 'main')
            transaction = new Tx(rawTransaction, {chain:'mainnet', hardfork: 'petersburg'});
        else
            transaction = new Tx(rawTransaction);

        transaction.sign(privateKeyBytes);
        var serialized = '0x' + transaction.serialize().toString('hex');
        var ret = await web3.eth.sendSignedTransaction(serialized);
        await waitConfirmedTx(ret.transactionHash);
        return ret.transactionHash;
    } catch(err) {
        console.log('!!!', err);
    }
}

async function withdraw(contractFile, contractAddress, amountToWithdraw, v, r, s, signatureValidUntilBlock) {
    try {
        const count = await getNonce(address);
        const privateKeyBytes = new Buffer.from(privateKey, 'hex');
        const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
        const contract = new web3.eth.Contract(obj.abi, contractAddress, {
            from: address
        }).methods.withdraw(
            web3.utils.toHex(amountToWithdraw), 
            v,
            r,
            s,
            web3.utils.toHex(signatureValidUntilBlock));

        const gasLimit = parseInt(await contract.estimateGas({from: address}) * 1.5);
        const gasPrice = parseInt(await web3.eth.getGasPrice() * 1.5);
        var rawTransaction = {
            "from":address,
            "gasPrice":web3.utils.toHex(gasPrice),
            "gasLimit":web3.utils.toHex(gasLimit),
            "to":contractAddress,
            "value":"0x0",
            "data":contract.encodeABI(),
            "nonce":web3.utils.toHex(count)
        }
        
        var transaction;
        if (process.env.MODE === 'ropsten')
            transaction = new Tx(rawTransaction, {chain:'ropsten', hardfork: 'petersburg'});
        else if (process.env.MODE === 'main')
            transaction = new Tx(rawTransaction, {chain:'mainnet', hardfork: 'petersburg'});
        else
            transaction = new Tx(rawTransaction);

        transaction.sign(privateKeyBytes);
        var serialized = '0x' + transaction.serialize().toString('hex');
        var ret = await web3.eth.sendSignedTransaction(serialized);
        await waitConfirmedTx(ret.transactionHash);
        return ret.transactionHash;
    } catch(err) {
        console.log('!!!', err);
    }
}


async function totalSupply(contractFile, contractAddress, fromAddress) {
    const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
    const contract = new web3.eth.Contract(obj.abi, contractAddress, {from: address});
    return await contract.methods.totalSupply().call();
}

async function mint(contractFile, contractAddress, mintToAddress, amount) {
    try {
        const count = await getNonce(ownerAddress);
        const privateKeyBytes = new Buffer.from(ownerPrivateKey, 'hex');
        const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
        const contract = new web3.eth.Contract(obj.abi, contractAddress, {
            from: ownerAddress
        }).methods.mint(mintToAddress, amount);

        const gasLimit = parseInt(await contract.estimateGas({from: ownerAddress}) * 1.5);
        const gasPrice = parseInt(await web3.eth.getGasPrice() * 1.5);
        var rawTransaction = {
            "from":ownerAddress,
            "gasPrice":web3.utils.toHex(gasPrice),
            "gasLimit":web3.utils.toHex(gasLimit),
            "to":contractAddress,
            "value":"0x0",
            "data":contract.encodeABI(),
            "nonce":web3.utils.toHex(count)
        }
        
        var transaction;
        if (process.env.MODE === 'ropsten')
            transaction = new Tx(rawTransaction, {chain:'ropsten', hardfork: 'petersburg'});
        else if (process.env.MODE === 'main')
            transaction = new Tx(rawTransaction, {chain:'mainnet', hardfork: 'petersburg'});
        else
            transaction = new Tx(rawTransaction);

        transaction.sign(privateKeyBytes);
        var serialized = '0x' + transaction.serialize().toString('hex');
        var ret = await web3.eth.sendSignedTransaction(serialized);
        await waitConfirmedTx(ret.transactionHash);
        return ret.transactionHash;
    } catch(err) {
        console.log('!!!', err);
    }
}

async function transfer(contractFile, contractAddress, fromAddress, fromPrivKey, toAddress, amountToTransfer) {
    try {
        const count = await getNonce(fromAddress);
        const privateKeyBytes = new Buffer.from(fromPrivKey, 'hex');
        const obj = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
        const contract = new web3.eth.Contract(obj.abi, contractAddress, {
            from: fromAddress
        }).methods.transfer(toAddress, amountToTransfer);

        const gasLimit = parseInt(await contract.estimateGas({from: fromAddress}) * 1.5);
        const gasPrice = parseInt(await web3.eth.getGasPrice() * 1.5);
        var rawTransaction = {
            "from":fromAddress,
            "gasPrice":web3.utils.toHex(gasPrice),
            "gasLimit":web3.utils.toHex(gasLimit),
            "to":contractAddress,
            "value":"0x0",
            "data":contract.encodeABI(),
            "nonce":web3.utils.toHex(count)
        }
        
        var transaction;
        if (process.env.MODE === 'ropsten')
            transaction = new Tx(rawTransaction, {chain:'ropsten', hardfork: 'petersburg'});
        else if (process.env.MODE === 'main')
            transaction = new Tx(rawTransaction, {chain:'mainnet', hardfork: 'petersburg'});
        else
            transaction = new Tx(rawTransaction);

        transaction.sign(privateKeyBytes);
        var serialized = '0x' + transaction.serialize().toString('hex');
        var ret = await web3.eth.sendSignedTransaction(serialized);
        await waitConfirmedTx(ret.transactionHash);
        return ret.transactionHash;
    } catch(err) {
        console.log('!!!', err);
    }
}

async function deployAllContract() {
    const omgContractAddress = await deployContract('tokens/OMG.json', []);
    console.log('OMG ContractAddress = ', omgContractAddress);
    const omgWContractAddress = await deployContract('tokens/OMGW.json', [omgContractAddress, 'omg', 'OMG', 18, true]);
    console.log('OMGW ContractAddress = ', omgWContractAddress);
    const ethWContractAddress = await deployContract('tokens/ETHW.json', ['ethw', 'ETHW', 18]);
    console.log('ETHW ContractAddress = ', ethWContractAddress);
}

async function start() {
    /* -------- ERC20 methods -------*/
    // mint
    // let txHash = await mint('tokens/OMG.json', omgContractAddress, ownerAddress, web3.utils.toHex(10000000000000000000));
    // console.log(txHash);

    // transfer
    // let txHash = await transfer('tokens/OMG.json', omgContractAddress, ownerAddress, ownerPrivateKey, address, web3.utils.toHex(1000000000000000000));
    // console.log(txHash);

    // tootalSupply
    // let supply = await totalSupply('tokens/OMG.json', omgContractAddress, ownerAddress);
    // console.log(supply)
    
    // getBalance
    // let balance = await balanceOf('tokens/OMG.json', omgContractAddress, address);
    // console.log(balance);

    // getNonce
    // let nonce = await getNonce(ownerAddress);
    // console.log(nonce);

    /* ------- DEX methods ------ */
    // approve
    // let txHash = await approve('tokens/OMG.json', omgContractAddress, address, privateKey, omgWContractAddress, web3.utils.toHex(1000000000000000000));
    // console.log(txHash);

    // deposite
    // let txHash = await deposit('tokens/OMGW.json', omgWContractAddress, address, privateKey, web3.utils.toHex(500000000000000000), 24);
    // console.log(txHash);

    // withdraw
    // let txHash = await withdraw('tokens/ETHW.json', ethWContractAddress, 
    //     0.1e18, '0x25', '0x8b5560938cd63fcc85d21e13711646966c7b818b7d89f5e5d8253abab8e8e931', 
    //     '0x73f19e2742ed5021ec9b0f688764c1f9adf0b2acab16430f54c2347277ed2288', 100);
    // console.log(txHash);
}

// deployAllContract();
start();