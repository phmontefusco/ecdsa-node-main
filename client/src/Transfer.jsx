import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {secp256k1} from 'ethereum-cryptography/secp256k1';
import { toHex,utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from "ethereum-cryptography/keccak";


// private key: 12e14dc8fb9cacf6cc661e26127ab1a82fc0358c8b86d454a846d97982eb10b8
// public key: 02cb1d1b1993e71d9843d6aa08d3d336654da27b07020040320e428e475cb13d20

// private key: 6323288d4149a0ff9d166b0f54779004add891b38303ef2913eb9ed5c12c743b
// public key: 03b3fb19fd1e44c3c0191ae96ce122ee65337e0686c4819eb7c3fc575bbf202be6

// private key: 6d6ed7019c56eaf5105fd6f1efe8f7a8d5776f5023a855da79acc02e249fb6b4
// public key: 02becf7be570682793b9a28b4d5218b8472eb5911a9a8582e3cd475a86ade1b8c9


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const hashMessage = message => keccak256(Uint8Array.from(message));
  const signMessage = msg => secp256k1.sign(hashMessage(msg),privateKey);

  async function transfer(evt) {
    evt.preventDefault();

    const msg = { amount: parseInt(sendAmount), recipient };
    const sig = signMessage(msg);

    const stringifyBigInts = obj =>{
      for(let prop in obj){
        let value = obj[prop];
        if(typeof value === 'bigint'){
          obj[prop] = value.toString();
        }else if(typeof value === 'object' && value !== null){
          obj[prop] = stringifyBigInts(value);
        }
      }
      return obj;
    }

    // stringify bigints before sending to server
    const sigStringed = stringifyBigInts(sig);
  
    const tx = {
      sig:sigStringed, msg, sender: address
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
