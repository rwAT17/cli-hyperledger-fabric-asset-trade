const gateway = new Gateway()
import { Wallets, Gateway, Transaction } from 'fabric-network'

export async function setUpGateway() {
	const CONNECTION_PROFILE_PATH = '../profiles/connection.json'
	const connectionProfile = require(CONNECTION_PROFILE_PATH)
	const wallet = await Wallets.newFileSystemWallet('./wallet')

	let connectionOptions = {
		identity: 'Tomek',
		wallet: wallet,
		// discovery: { enabled: false, asLocalhost: true },
	}

	await gateway.connect(connectionProfile, connectionOptions)
}

export async function getContract() {
	await setUpGateway()
	const network = await gateway.getNetwork('mychannel')
	const contract = network.getContract('basic')

	return contract
}
