"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = exports.setUpGateway = void 0;
const gateway = new fabric_network_1.Gateway();
const fabric_network_1 = require("fabric-network");
async function setUpGateway() {
    const CONNECTION_PROFILE_PATH = '../profiles/connection.json';
    const connectionProfile = require(CONNECTION_PROFILE_PATH);
    const wallet = await fabric_network_1.Wallets.newFileSystemWallet('./wallet');
    let connectionOptions = {
        identity: 'Tomek',
        wallet: wallet,
        // discovery: { enabled: false, asLocalhost: true },
    };
    await gateway.connect(connectionProfile, connectionOptions);
}
exports.setUpGateway = setUpGateway;
async function getContract() {
    await setUpGateway();
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('basic');
    return contract;
}
exports.getContract = getContract;
//# sourceMappingURL=gateway.js.map