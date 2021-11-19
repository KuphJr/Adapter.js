// get the main body and remove all text between angled brackets
const mainBody =
    response.data
    .split("<main>")[1]
    .split("</main>")[0]
    .replace(/\<[^>]*\>/g, "");
const symbols =
['BNB', 'USDT', 'SOL', 'ADA', 'XRP', 'DOT',
'HEX', 'USDC', 'DOGE', 'SHIB', 'AVAX', 'LUNA', 'LTC', 'UNI',
'LINK', 'CRO','MATIC', 'BCH', 'ALGO', 'VET', 'XLM', 'AXS', 'TRX',
'ICP', 'FIL', 'ETC', 'ATOM','THETA', 'DAI', 'FTT', 'HBAR', 'EGLD',
'MANA', 'FTM', 'HNT', 'XTZ', 'GRT', 'XMR', 'EOS', 'FLOW','CAKE',
'MIOTA', 'AAVE', 'KDA', 'LRC', 'SAND', 'KSM', 'BSV', 'NEO', 'QNT'];
const names =
['Binance Coin','Tether','Solana','Cardano','Ripple',
'Polkadot','Hex Coin','USD Coin','Dogecoin', 'SHIBA INU','Avalanche',
'Terra','Litecoin','Uniswap','Chainlink','CryptocomCoin','Polygon',
'Bitcoin Cash','Algorand','VeChain','Stellar','Axie Infinity','TRON',
'InternetComputer','Filecoin','Ethereum Classic','Cosmos','Theta Token',
'MakerDAO','FTX Token','Hedera Hashgraph','Elrond','Decentraland','Fantom',
'Helium','Tezos','The Graph','Monero','EOS','FlowDapper','PancakeSwap',
' IOTA','Aave','Kadena','Loopring','The Sandbox','Kusama','Bitcoin SV',
'Neo','Quant'];
let symbolsCount = {};
let i = 0;
for (const symbol of symbols) {
    const symbolRE = new RegExp(symbol, "g");
    const nameRE = new RegExp(names[i], "g");
    symbolsCount[symbol] = mainBody.match(symbolRE) ? mainBody.match(symbolRE).length : 0;
    symbolsCount[symbol] += mainBody.match(nameRE) ? mainBody.match(nameRE).length : 0;
    i++;
}
console.log(symbolsCount);
let maxCount = 0;
let maxSymbol = "";
for (const [symbol, count] of Object.entries(symbolsCount)) {
    if (count > maxCount) {
        maxCount = count;
        maxSymbol = symbol;
    }
}

const paddedSymbol = maxSymbol.padEnd(8-maxSymbol.length, " ");
const returnString = `${paddedSymbol}: ${maxCount}`;

return returnString;