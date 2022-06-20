#!/usr/bin/env node
import { Command } from 'commander'
import { TextDecoder } from 'util'
import { Wallets, Gateway, Transaction } from 'fabric-network'
import { promises as fsp } from 'fs'
import { walletPut } from './services/walletput'
const utf8Decoder = new TextDecoder()
const gateway = new Gateway()

const program = new Command()
program.usage('[command]').name('string-util').description('Transfer Assets').version('0.8.0')

program // Add new wallet
	.command('walletPut')
	.description('Init new wallet')
	.action(async function () {
		walletPut()
	})

program // shows wallet data
	.command('showWallet')
	.description('Show wallet data')
	.argument('[walletPath]', 'default value is ./wallet')
	.action(async (walletPath = './wallet') => {
		try {
			const wallet = await Wallets.newFileSystemWallet(`${walletPath}`)
			let name = await wallet.get('Tomek')

			if (name === undefined) {
				console.log('Please enter other wallet name')
				await fsp.rmdir(walletPath)
			} else {
				console.log(name)
			}
		} catch (error) {
			console.log(error)
		}
	})

program
	.command('showAllAssets')
	.description('Show all assets')
	.action(async function () {
		try {
			await setUpGateway()
			let contract = await getContract()
			// await contract.submitTransaction('CreateAsset', 'asset3', 'red', '5', 'Fujitsu', '1300')
			// await contract.submitTransaction('CreateAsset', 'asset2', 'green', '10', 'Siemens', '1000')
			const resultBytes = await contract.evaluateTransaction('GetAllAssets')
			const resultJson = utf8Decoder.decode(resultBytes)
			const result = JSON.parse(resultJson)
			console.log(result)
		} catch (error) {
			console.log(error)
		} finally {
			gateway.disconnect()
		}
	})

program
	.command('getAssetById <assetId>')
	.description('Show asset with a particular Id')
	.action(async function (assetId) {
		try {
			await setUpGateway()

			let contract = await getContract()

			const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId)

			const resultJson = utf8Decoder.decode(resultBytes)
			const result = JSON.parse(resultJson)
			console.log('Asset: ', result)
		} catch (error: any) {
			if (error.status === 500) {
				console.log(`The asset ${assetId} does not exist`)
			} else {
				console.log(error)
			}
		} finally {
			gateway.disconnect()
		}
	})

program
	.command('transferAsset <assetId> <newOwnerName>')
	.description('Transfer asset with given Id to new owner')
	.action(async function (assetId, newOwnerName) {
		try {
			await setUpGateway()
			let contract = await getContract()
			const transaction = contract.createTransaction('TransferAsset')

			await transaction.submit(assetId, newOwnerName).then(function () {
				console.log(`Transfered asset with ID: ${assetId} to ${newOwnerName}`)
			})
		} catch (error: any) {
			if (error.responses[0].response.status === 500) {
				console.log(`The asset ${assetId} does not exist`)
			} else {
				console.log(error.responses)
			}
		} finally {
			gateway.disconnect()
		}
	})

// Functions to setup gateway
async function setUpGateway() {
	const CONNECTION_PROFILE_PATH = '../profiles/connection.json'
	const connectionProfile = require(CONNECTION_PROFILE_PATH)
	const wallet = await Wallets.newFileSystemWallet('./wallet')

	let connectionOptions = {
		identity: 'Tomek',
		wallet: wallet,
	}

	await gateway.connect(connectionProfile, connectionOptions)
}

async function getContract() {
	await setUpGateway()
	const network = await gateway.getNetwork('mychannel')
	const contract = network.getContract('basic')

	return contract
}

program.parse(process.argv)
