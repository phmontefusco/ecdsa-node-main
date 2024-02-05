//const express = require("express");
import express from "express";
const app = express();
//const cors = require("cors");
import cors from "cors";
const port = 3042;


import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import * as secp from 'ethereum-cryptography/secp256k1';
import {keccak256} from 'ethereum-cryptography/keccak';

app.use(cors());
app.use(express.json());

const balances = {
  "02cb1d1b1993e71d9843d6aa08d3d336654da27b07020040320e428e475cb13d20": 100,
  "03b3fb19fd1e44c3c0191ae96ce122ee65337e0686c4819eb7c3fc575bbf202be6": 50,
  "02becf7be570682793b9a28b4d5218b8472eb5911a9a8582e3cd475a86ade1b8c9": 75,
};


// private key: 12e14dc8fb9cacf6cc661e26127ab1a82fc0358c8b86d454a846d97982eb10b8
// public key: 02cb1d1b1993e71d9843d6aa08d3d336654da27b07020040320e428e475cb13d20

// private key: 6323288d4149a0ff9d166b0f54779004add891b38303ef2913eb9ed5c12c743b
// public key: 03b3fb19fd1e44c3c0191ae96ce122ee65337e0686c4819eb7c3fc575bbf202be6

// private key: 6d6ed7019c56eaf5105fd6f1efe8f7a8d5776f5023a855da79acc02e249fb6b4
// public key: 02becf7be570682793b9a28b4d5218b8472eb5911a9a8582e3cd475a86ade1b8c9


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, sig:sigStringed, msg } = req.body;

  const { recipient, amount } = msg;

  // convert stringified bigints back to bigints
  const sig = {
    ...sigStringed,
    r: BigInt(sigStringed.r),
    s: BigInt(sigStringed.s)
  }

  const hashMessage = (message) => keccak256(Uint8Array.from(message));

  const isValid = secp.secp256k1.verify(sig, hashMessage(msg), sender) === true;
  
  if(!isValid) res.status(400).send({ message: "Bad signature!"});

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
