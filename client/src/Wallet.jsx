import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
//import * as secp from 'ethereum-cryptography/secp256k1';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex}  from 'ethereum-cryptography/utils';

// private key: 12e14dc8fb9cacf6cc661e26127ab1a82fc0358c8b86d454a846d97982eb10b8
// public key: 02cb1d1b1993e71d9843d6aa08d3d336654da27b07020040320e428e475cb13d20

// private key: 6323288d4149a0ff9d166b0f54779004add891b38303ef2913eb9ed5c12c743b
// public key: 03b3fb19fd1e44c3c0191ae96ce122ee65337e0686c4819eb7c3fc575bbf202be6

// private key: 6d6ed7019c56eaf5105fd6f1efe8f7a8d5776f5023a855da79acc02e249fb6b4
// public key: 02becf7be570682793b9a28b4d5218b8472eb5911a9a8582e3cd475a86ade1b8c9


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    let publicKey = secp.secp256k1.getPublicKey(privateKey);
    const address = toHex(publicKey);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        {/* <input placeholder="Type an address, for example: 0x1" value={privatekey} onChange={onChange}></input> */}
        <input placeholder="Type a private key, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Address: {address.slice(0,10)+'...'}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
