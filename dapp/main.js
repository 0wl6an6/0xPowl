let dispAmountDiv = document.getElementById('dispAmount');
let costDiv = document.getElementById('cost');
let amountRangeVal = document.getElementById('amount');
let txData = document.getElementById('txData');
let txBaseUri = 'https://mumbai.polygonscan.com/tx/';

// Initiate dapp
window.addEventListener('load', async ()=>{
  // Gallery
  let baseUri = 'https://ipfs.io/ipfs/bafybeicw5khhomrsu4wuocjqde6mbw46xwput6veukdnvg5zql6vx5ipei/';
  setInterval(()=>{
    document.getElementById('PImg').src = `${baseUri}${Math.floor(Math.random()*10001)}.png`; // 
  }, 2000);
  // Amount and price display
  dispAmountDiv.innerHTML = amount.value < 10 ? `0${amount.value}` : amount.value; 
  cost.innerHTML = `Ξ${(amount.value*0.005).toFixed(3)}`;
  // Detect the provider (window.ethereum)
  if (window.ethereum === undefined) {
    alert('Please install Metamask.', 'info');
  } else {
    // Detect which network the user is connected to
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x13881') {
      loadingPanelShow(true);
      // ask to change to if not on correct one
      try {
        await changeNetworks();
        loadingPanelShow(false);
      } catch(err) {
        // if don't exist ask to add network to metamask
        if (err.code === 4902) {
          try {
            await addNetwork();
            loadingPanelShow(false);
          } catch (err) { window.location.reload(); }
        } else { window.location.reload(); }
      }
    }
  }
});

amount.addEventListener('input', (e) => {
  dispAmountDiv.innerHTML = amount.value < 10 ? `0${amount.value}` : amount.value; 
  cost.innerHTML = `Ξ${(amount.value*0.005).toFixed(3)}`;
});

// Update minted amount
let updateMinted = async () => {
  let minted = await powlContract.methods.minted().call();
  document.querySelector('#mintamount').innerHTML = minted;
} 

// Alerts popup handle
let alert = (message, type) => {
  document.querySelector('.alertPlaceholder').innerHTML = '';
  document.querySelector('.alertPlaceholder').insertAdjacentHTML('beforeend', '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
}

// blocking loading panel.
let loadingPanelShow = (state) => {
  document.querySelector("#loadingBlock").hidden = state ? false : true;
  document.querySelector("#mintbbtn").style.pointerEvents = state ? 'none' : 'auto';
}

let changeNetworks = async () => {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x13881' }],
  });
}

let addNetwork = async () => {
  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai testnet',
        rpcUrls: [
          "https://rpc-mumbai.matic.today",
          "https://matic-mumbai.chainstacklabs.com",
          "https://rpc-mumbai.maticvigil.com",
          "https://matic-testnet-archive-rpc.bwarelabs.c"
        ],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        }
      }],
  });
}

// Web3 and Metmask
let mint = async () => { 
  if (ethereum.chainId !== '0x13881') {
    loadingPanelShow(true);
    await changeNetworks();
    loadingPanelShow(false);
  }
  let mintCost = 5000000000000000; // wei => 0.005 WETH
  // Start loading and btn disable
  loadingPanelShow(true);
  try { // Get the user's account(s)
    await ethereum.request({ method: 'eth_requestAccounts' });
    try { // request allowance for amount in WETH contract
      let approve = await wethContract.methods.approve("0xB3E8BF31Da5585e50640A2157d4986d964726e92", (document.getElementById('amount').value*mintCost).toString()).send({from: ethereum.selectedAddress});
      // cast transaction hash and gas
      txData.insertAdjacentHTML('beforeend', 
        `<div class='Tx'>Approve Tx: <a target='_blank' href='${txBaseUri}${approve.transactionHash}'>${`${approve.transactionHash.slice(0,4)}...${approve.transactionHash.slice(-4)}`}</a>, Gas Used: ${approve.gasUsed}</div>`
      );
      try { // Call mint function
        let mint = await powlContract.methods.mint(parseInt(document.getElementById('amount').value)).send({from: ethereum.selectedAddress});
        // cast transaction hash and gas
        txData.insertAdjacentHTML('beforeend', 
          `<div class='Tx'>Mint Tx: <a target='_blank' href='${txBaseUri}${mint.transactionHash}'>${`${mint.transactionHash.slice(0,4)}...${mint.transactionHash.slice(-4)}`}</a>, Gas Used: ${mint.gasUsed}</div>`
        );          
        txData.insertAdjacentHTML('beforeend', 
        `<div class='msg'>Thank you! Welcome to the club. Hoot hoot!</div>`
        );
        // Update minted
        updateMinted();
        // Stop loading and btn disable
        loadingPanelShow(false);
      } catch(err) {alert(`Code: ${err.code} Msg: ${err.message}`, 'warning'); loadingPanelShow(false); return; };
    } catch(err) {alert(`Code: ${err.code} Msg: ${err.message}`, 'warning'); loadingPanelShow(false); return; };
  } catch(err) {alert(`Code: ${err.code} Msg: ${err.message}`, 'warning'); loadingPanelShow(false); return; };
}

ethereum.on('chainChanged', (_chainId) => { if (_chainId !== '0x13881') {window.location.reload(); }});

// ABIS
let wethAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]';
let powlAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"creditPowls","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"giftPowl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gifted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintMax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"switchPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]';

let web3 = new Web3(window.ethereum);
let wethContract = new web3.eth.Contract(JSON.parse(wethAbi), '0x326C977E6efc84E512bB9C30f76E30c160eD06FB');
let powlContract = new web3.eth.Contract(JSON.parse(powlAbi), '0xB3E8BF31Da5585e50640A2157d4986d964726e92');