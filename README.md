# eth - tools


## Intro   
This project aims to setup development environment in order to integrate with ZeroX contracts and also a few other DEX smart contracts including the ones from Bitfinex
 
* Develop scripts that deploy existing contracts given abi and bytecode (or copy from mainnet to local ganache)
* Develop scripts that allow interacting with few methods of those contracts (e.g. transfer, deposit, etc).
* gas estimation and troubleshooting for development  
* Allow all engineers to run the same dev environment locally  
* Successfully call contact methods for all contracts provided (e.g., transfer, deposit, etc) from the code
* Ability to use the same code for testnet/mainnet if needed (obviously with different configuration/keys)

## Contract Setup 
All ZeroX contracts are already part of the local snapshot (assuming they are working ok) then the next step is to setup all other contracts (listed below) and then providing ability to interact with them 

Refer to the mainnet contract section to see the list of contracts that need to be setup  

## Contract interaction 
Use contract.js file to deploy contracts or call methods (the script is very basic) 

the script can be improved:

- better code for easy deployments
- Easier interaction with methods
- Optimized gas estimation 
- Easier troubleshooting 

All contracts are ERC20 at this stage but other types may be added. 

ERC20 methods:
- Deploy 
- Transfer 
- Approve 
- BalanceOf
- TotalSupply
- Mint 

DEX methods
- Deposit (for DEX)
- Withdraw (for DEX)

## Ganache setup 

Ganache setup is based on ZeroX so it includes all the ZeroX contracts and also basic accounts/private keys 
https://github.com/0xProject/wiki/blob/e77a22a64ca2b60c35cb904763eaf2658b7ebc73/developer-tools/3-Ganache-Setup-Guide.md


### Running Ganache
* `npm install` 
* `cd ganache` 
* `npm start`   (this will start the local ganache version) 

### Available Accounts

* (0) 0x5409ED021D9299bf6814279A6A1411A7e866A631 (100 ETH)
* (1) 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb (100 ETH)
* (2) 0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84 (100 ETH)
* (3) 0xE834EC434DABA538cd1b9Fe1582052B880BD7e63 (100 ETH)
* (4) 0x78dc5D2D739606d31509C31d654056A45185ECb6 (100 ETH)
* (5) 0xA8dDa8d7F5310E4A9E24F8eBA77E091Ac264f872 (100 ETH)
* (6) 0x06cEf8E666768cC40Cc78CF93d9611019dDcB628 (100 ETH)
* (7) 0x4404ac8bd8F9618D27Ad2f1485AA1B2cFD82482D (100 ETH)
* (8) 0x7457d5E02197480Db681D3fdF256c7acA21bDc12 (100 ETH)
* (9) 0x91c987bf62D25945dB517BDAa840A6c661374402 (100 ETH)

### Private Keys

* (0) 0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d
* (1) 0x5d862464fe9303452126c8bc94274b8c5f9874cbd219789b3eb2128075a76f72
* (2) 0xdf02719c4df8b9b8ac7f551fcb5d9ef48fa27eef7a66453879f4d8fdc6e78fb1
* (3) 0xff12e391b79415e941a94de3bf3a9aee577aed0731e297d5cfa0b8a1e02fa1d0
* (4) 0x752dd9cf65e68cfaba7d60225cbdbc1f4729dd5e5507def72815ed0d8abc6249
* (5) 0xefb595a0178eb79a8df953f87c5148402a224cdf725e88c0146727c6aceadccd
* (6) 0x83c6d2cc5ddcf9711a6d59b417dc20eb48afd58d45290099e5987e3d768f328f
* (7) 0xbb2d3f7c9583780a7d3904a2f55d792707c345f21de1bacb2d389934d82796b2
* (8) 0xb2fd4d29c1390b71b8795ae81196bfd60293adf99f9d32a0aff06288fcdac55f
* (9) 0x23cb7121166b9a2f93ae0b7c05bde02eae50d64449b2cbb42bc84e9d38d6cc89

nemonic:  concert load couple harbor equip island argue ramp clarify fence smart topic


### ZeroX Contract addresses in local Ganache:
--- 
* Exchange.sol: 0x48bacb9266a570d521063ef5dd96e61686dbe788
* ERC20Proxy.sol: 0x1dc4c1cefef38a777b15aa20260a54e584b16c48
* ERC721Proxy.sol: 0x1d7022f5b17d2f8b695918fb48fa1089c9f85401
* MultiAssetProxy.sol: 0x6a4a62e5a7ed13c361b176a5f62c2ee620ac0df8
* ZRXToken.sol: 0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c
* AssetProxyOwner.sol: 0x04b5dadd2c0d6a261bfafbc964e0cac48585def3
* WETH9.sol: 0x0b1ba0af832d7c05fd64161e0db78e85978e8082
* Forwarder.sol: 0x6000eca38b8b5bba64986182fe2a69c57f6b5414
* OrderValidator.sol: 0x32eecaf51dfea9618e9bc94e9fbfddb1bbdcba15
* DutchAuction.sol: 0x7e3f4e1deb8d3a05d9d2da87d9521268d0ec3239
* Coordinator.sol: 0x4d3d5c850dd5bd9d6f4adda3dd039a3c8054ca29
* CoordinatorRegistry.sol: 0xaa86dda78e9434aca114b6676fc742a18d15a1cc
* Dummy tokens for testing

* DummyERC20Token.sol: 0x34d402f14d58e001d8efbe6585051bf9706aa064
* DummyERC20Token.sol: 0x25b8fe1de9daf8ba351890744ff28cf7dfa8f5e3
* DummyERC20Token.sol: 0xcdb594a32b1cc3479d8746279712c39d18a07fc0
* DummyERC20Token.sol: 0x1e2f9e10d02a6b8f8f69fcbf515e75039d2ea30d
* DummyERC20Token.sol: 0xbe0037eaf2d64fe5529bca93c18c9702d3930376
* DummyERC721Token.sol: 0x07f96aa816c1f244cbc6ef114bb2b023ba54a2eb


### DEX token Contract addresses:
To add the following contracts 
* OMG 
* USDT
* USDC
* ENJ
* DAI

### DEX wrapper addresses:
To add the following contracts 

* OMG Wrapper:  
* ETH Wrapper 
* USDT Wrapper 
* USDC Wrapper 
* ENJ Wrapper 
* DAI Wrapper 
* ZRX Wrapper 

## mainnet contracts
ETH:
* Wrapper contract: 0x50cB61AfA3F023d17276DCFb35AbF85c710d1cfF

OMG 
* main contract: 0xd26114cd6EE289AccF82350c8d8487fedB8A0C07
* wrapper contract: 0xb5dfdfb2a1c97b329361d261239c51e5f88d035d

USDT 
* main contract: 0xdac17f958d2ee523a2206206994597c13d831ec7
* wrapper contract: 0x33d019eb137b853f0cdf555a5d5bd2749135ac31

DAI
* main contract: 0x6b175474e89094c44da98b954eedeac495271d0f
* wrapper contract: 0x2cd04bb68786834f199ce12074da7b8832129fe1

USDC 
* main contract: 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
* wrapper: 0x0890fbf0f9b3d55a7e3f251b6afcbe691a29873b

ENJ:
* main: 0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c
* wrapper: 0x3f46e145dfcd84230c8e0684efb8bce3f0965fba

ZRX:
wrapper: 0x862916f9709e499a94fbca7a8f451eb443d34cad 

