# Deploy contract

```shell
npm install
```

```shell
npx hardhat compile
npx hardhat node
```

```shell
npx hardhat run --network localhost scripts/deploy.js
```

If you get an error regarding JSON-RPC error, delete the metamask network, and add it back, it is http://localhost:8545, chainID: 31337