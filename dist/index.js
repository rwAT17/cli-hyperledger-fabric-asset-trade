#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const util_1 = require("util");
const fabric_network_1 = require("fabric-network");
const fs_1 = require("fs");
const walletput_1 = require("./services/walletput");
const utf8Decoder = new util_1.TextDecoder();
const gateway = new fabric_network_1.Gateway();
const program = new commander_1.Command();
program.usage('[command]').name('string-util').description('Transfer Assets').version('0.8.0');
program // Add new wallet
    .command('walletPut')
    .description('Init new wallet')
    .action(async function () {
    (0, walletput_1.walletPut)();
});
program // shows wallet data
    .command('showWallet')
    .description('Show wallet data')
    .argument('[walletPath]', 'default value is ./wallet')
    .action(async (walletPath = './wallet') => {
    try {
        const wallet = await fabric_network_1.Wallets.newFileSystemWallet(`${walletPath}`);
        let name = await wallet.get('Tomek');
        if (name === undefined) {
            console.log('Please enter other wallet name');
            await fs_1.promises.rmdir(walletPath);
        }
        else {
            console.log(name);
        }
    }
    catch (error) {
        console.log(error);
    }
});
program
    .command('showAllAssets')
    .description('Show all assets')
    .action(async function () {
    try {
        await setUpGateway();
        let contract = await getContract();
        // await contract.submitTransaction('CreateAsset', 'asset3', 'red', '5', 'Fujitsu', '1300')
        // await contract.submitTransaction('CreateAsset', 'asset2', 'green', '10', 'Siemens', '1000')
        const resultBytes = await contract.evaluateTransaction('GetAllAssets');
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        gateway.disconnect();
    }
});
program
    .command('getAssetById <assetId>')
    .description('Show asset with a particular Id')
    .action(async function main(assetId) {
    try {
        await setUpGateway();
        let contract = await getContract();
        const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('Asset: ', result);
    }
    catch (error) {
        if (error.status === 500) {
            console.log(`The asset ${assetId} does not exist`);
        }
        else {
            console.log(error);
        }
    }
    finally {
        gateway.disconnect();
    }
});
program
    .command('transferAsset <assetId> <newOwnerName>')
    .description('Transfer asset with given Id to new owner')
    .action(async function (assetId, newOwnerName) {
    try {
        await setUpGateway();
        let contract = await getContract();
        const transaction = contract.createTransaction('TransferAsset');
        await transaction.submit(assetId, newOwnerName).then(function () {
            console.log(`Transfered asset with ID: ${assetId} to ${newOwnerName}`);
        });
    }
    catch (error) {
        if (error.responses[0].response.status === 500) {
            console.log(`The asset ${assetId} does not exist`);
        }
        else {
            console.log(error.responses);
        }
    }
    finally {
        gateway.disconnect();
    }
});
// async function logWallet(): Promise<void> {
// 	const wallet = await Wallets.newFileSystemWallet('./wallet')
// 	let name = await wallet.get('Tomek')
// 	console.log(name)
// }
// async function showWallet(walletPath: string) {
// 	const wallet = await Wallets.newFileSystemWallet(`${walletPath}`)
// 	let name = await wallet.get('Tomek')
// 	if (name === undefined) {
// 		console.log('Please enter other walle name')
// 	} else {
// 		console.log(name)
// 	}
// }
// Functions to setup gateway
async function setUpGateway() {
    const CONNECTION_PROFILE_PATH = '../profiles/connection.json';
    const connectionProfile = require(CONNECTION_PROFILE_PATH);
    const wallet = await fabric_network_1.Wallets.newFileSystemWallet('./wallet');
    let connectionOptions = {
        identity: 'Tomek',
        wallet: wallet,
    };
    await gateway.connect(connectionProfile, connectionOptions);
}
async function getContract() {
    await setUpGateway();
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('basic');
    return contract;
}
program.parse(process.argv);
//# sourceMappingURL=index.js.map