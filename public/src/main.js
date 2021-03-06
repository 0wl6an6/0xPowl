// Load Contracts
let polygonConnect = new Web3('https://polygon-rpc.com/'); // To pull data without relaying on the network the users wallet is connected
let metamaskConnect = new Web3(window.ethereum); // connect through metmask provider for sending transactions
let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
let powlAddress = '0x751497a863f606EAFCd63418b920Ad98f5d7f972';
let wethContract = new metamaskConnect.eth.Contract(JSON.parse(wethAbi), wethAddress);
let powlContract = new metamaskConnect.eth.Contract(JSON.parse(powlAbi), powlAddress);
let pc = new polygonConnect.eth.Contract(JSON.parse(powlAbi), powlAddress);

let dispAmountDiv = document.querySelector('#dispAmount');
let costDiv = document.querySelector('#cost');
let amount = document.querySelector('#amount');
let txData = document.querySelector('#txData');
let txBaseUri = 'https://polygonscan.com/tx/';
let mintCost = 0.005;

// Initiate dapp
window.addEventListener('load', async ()=>{
  // Load gallery
  let baseUri = 'https://ipfs.io/ipfs/bafybeicw5khhomrsu4wuocjqde6mbw46xwput6veukdnvg5zql6vx5ipei/';
  setInterval(()=>{
    document.getElementById('PImg').src = `${baseUri}${Math.floor(Math.random()*10001)}.png`; // 
  }, 2000);
  // Amount and price display
  dispAmountDiv.innerHTML = amount.value < 10 ? `0${amount.value}` : amount.value; 
  cost.innerHTML = `Ξ${(amount.value*mintCost).toFixed(3)}`;
  // Update minted
  updateMinted();
  // Detect the provider (window.ethereum)
  if (window.ethereum === undefined) {
    alert('Please install Metamask.', 'info');
  } else {
    // Detect which network the user is connected to
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x89') {
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
  cost.innerHTML = `Ξ${(amount.value*mintCost).toFixed(3)}`;
});

amount.addEventListener('change', (e) => {
  updateUserPanel();
});



// update user panel if wallet's connected.
let updateUserPanel = async () => {
  document.querySelector('#userpanel').innerHTML = '';
  if (ethereum.selectedAddress) {
    let balance = await wethContract.methods.balanceOf(ethereum.selectedAddress).call();
    let balanceDisp = parseFloat(metamaskConnect.utils.fromWei(balance)).toFixed(8);
    let color = balanceDisp > document.querySelector('#amount').value*mintCost ? 'success' : 'danger';
    document.querySelector('#userpanel').innerHTML = `Connected with ${ethereum.selectedAddress.slice(0,4)}...${ethereum.selectedAddress.slice(-4)}. Balance: <span class='text-${color}'>Ξ${balanceDisp}</span>`;
  }
}

setTimeout(updateUserPanel, 100);
ethereum.on('accountsChanged', ()=> { updateUserPanel(); });


// Update minted amount
let updateMinted = async () => {
  let minted = await pc.methods.minted().call();
  document.querySelector('#mintamount').innerHTML = '';
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

// Handle networks
let changeNetworks = async () => {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x89' }],
  });
}

let addNetwork = async () => {
  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: [
          "https://polygon-rpc.com/",
          "https://rpc-mainnet.matic.network",
          "https://matic-mainnet.chainstacklabs.com",
          "https://rpc-mainnet.maticvigil.com",
          "https://rpc-mainnet.matic.quiknode.pro",
          "https://matic-mainnet-full-rpc.bwarelabs.com"
        ],
        blockExplorerUrls: ['https://polygonscan.com/'],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        }
      }],
  });
}

ethereum.on('chainChanged', (_chainId) => { if (_chainId !== '0x89') {window.location.reload(); }});

// Mint function
let mint = async () => { 
  if (ethereum.chainId !== '0x89') {
    loadingPanelShow(true);
    await changeNetworks();
    loadingPanelShow(false);
  }
  // Start loading and btn disable
  loadingPanelShow(true);
  try { // Get the user's account(s)
    await ethereum.request({ method: 'eth_requestAccounts' });
    try { // request allowance for amount in WETH contract
      let approve = await wethContract.methods.approve(powlAddress, (document.getElementById('amount').value*metamaskConnect.utils.toWei(mintCost.toString())).toString()).send({from: ethereum.selectedAddress});
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
