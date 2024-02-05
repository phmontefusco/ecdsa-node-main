//import sha256 from 'ethereum-cryptography/sha256';
import { toHex}  from 'ethereum-cryptography/utils';
//import keccak from 'ethereum-cryptography/keccak';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';


//const { sha256 } = require("ethereum-cryptograph/getPublicKeyy/sha256");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
console.log("private key " + toHex(privateKey));
console.log("public key " + toHex(publicKey));