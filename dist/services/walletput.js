"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletPut = void 0;
const fabric_network_1 = require("fabric-network");
const fs_1 = require("fs");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function walletPut() {
    let keyname = await fs_1.promises
        .readdir('../../test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/')
        .then(names => {
        return names;
    });
    console.log(keyname);
    //Hardcoded paths to cert and key of User randomly generated from command. Check for your key name.
    let key = path.join('../../test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/', keyname[0]);
    console.log(key);
    const cert = '/Users/rwats/Hyperledge/fabric-samples-apple-m1/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem';
    const certificate = fs.readFileSync(cert).toString();
    const privateKey = fs.readFileSync(key).toString();
    const wallet = await fabric_network_1.Wallets.newFileSystemWallet('./wallet');
    const identityLabel = 'Tomek';
    const identity = {
        credentials: {
            certificate,
            privateKey,
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };
    await wallet.put(identityLabel, identity);
}
exports.walletPut = walletPut;
//# sourceMappingURL=walletput.js.map