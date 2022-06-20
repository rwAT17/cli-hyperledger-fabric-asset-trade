import { Wallets } from 'fabric-network'
import { promises as fsp } from 'fs'
import * as fs from 'fs'
import * as path from 'path'

export async function walletPut(): Promise<void> {
	let keyname = await fsp
		.readdir(
			'../../test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/'
		)
		.then(names => {
			return names
		})

	console.log(keyname)
	//Hardcoded paths to cert and key of User randomly generated from command. Check for your key name.
	let key = path.join(
		'../../test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/',
		keyname[0]
	)
	console.log(key)
	const cert =
		'/Users/rwats/Hyperledge/fabric-samples-apple-m1/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem'

	const certificate = fs.readFileSync(cert).toString()
	const privateKey = fs.readFileSync(key).toString()

	const wallet = await Wallets.newFileSystemWallet('./wallet')

	const identityLabel = 'Tomek'

	const identity = {
		credentials: {
			certificate,
			privateKey,
		},
		mspId: 'Org1MSP',
		type: 'X.509',
	}
	await wallet.put(identityLabel, identity)
}
