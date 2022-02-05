"use strict";

var dispAmountDiv = document.getElementById('dispAmount');
var costDiv = document.getElementById('cost');
var amountRangeVal = document.getElementById('amount');
var txData = document.getElementById('txData');
var txBaseUri = 'https://mumbai.polygonscan.com/tx/'; // Initiate gallery and buy-panel displays

window.addEventListener('load', function () {
  var baseUri = 'https://ipfs.io/ipfs/bafybeicw5khhomrsu4wuocjqde6mbw46xwput6veukdnvg5zql6vx5ipei/';
  setInterval(function () {
    document.getElementById('PImg').src = "".concat(baseUri).concat(Math.floor(Math.random() * 10001), ".png"); // 
  }, 2000);
  dispAmountDiv.innerHTML = amount.value < 10 ? "0".concat(amount.value) : amount.value;
  cost.innerHTML = "\u039E".concat((amount.value * 0.005).toFixed(3));
});
amount.addEventListener('input', function (e) {
  dispAmountDiv.innerHTML = amount.value < 10 ? "0".concat(amount.value) : amount.value;
  cost.innerHTML = "\u039E".concat((amount.value * 0.005).toFixed(3));
}); // Alerts popup handle

var alertPlaceholder = document.querySelector('.alertPlaceholder');

var alert = function alert(message, type) {
  alertPlaceholder.innerHTML = '';
  alertPlaceholder.insertAdjacentHTML('beforeend', '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
}; // blocking loading panel.


var loadingPanelShow = function loadingPanelShow(state) {
  document.querySelector("#loadingBlock").hidden = state ? false : true;
  document.querySelector("#mintbbtn").style.pointerEvents = state ? 'none' : 'auto';
}; // Web3 and Metmask


var syncWallet = function syncWallet() {
  var chainId;
  return regeneratorRuntime.async(function syncWallet$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(window.ethereum === undefined)) {
            _context.next = 4;
            break;
          }

          alert('Please install Metamask.', 'info');
          _context.next = 41;
          break;

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_chainId'
          }));

        case 6:
          chainId = _context.sent;

          if (!(chainId !== '0x13881')) {
            _context.next = 41;
            break;
          }

          _context.prev = 8;
          _context.next = 11;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: '0x13881'
            }]
          }));

        case 11:
          _context.next = 30;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](8);

          if (!(_context.t0.code === 4902)) {
            _context.next = 28;
            break;
          }

          _context.prev = 16;
          _context.next = 19;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x13881',
              chainName: 'Polygon Mumbai testnet',
              rpcUrls: ["https://rpc-mumbai.matic.today", "https://matic-mumbai.chainstacklabs.com", "https://rpc-mumbai.maticvigil.com", "https://matic-testnet-archive-rpc.bwarelabs.c"],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18
              }
            }]
          }));

        case 19:
          dispUserPanel();
          _context.next = 26;
          break;

        case 22:
          _context.prev = 22;
          _context.t1 = _context["catch"](16);
          alert("Code: ".concat(_context.t1.code, " Msg: ").concat(_context.t1.message), 'warning');
          return _context.abrupt("return");

        case 26:
          _context.next = 30;
          break;

        case 28:
          alert("Code: ".concat(_context.t0.code, " Msg: ").concat(_context.t0.message), 'warning');
          return _context.abrupt("return");

        case 30:
          _context.prev = 30;
          _context.next = 33;
          return regeneratorRuntime.awrap(ethereum.request({
            method: 'eth_requestAccounts'
          }));

        case 33:
          _context.next = 40;
          break;

        case 35:
          _context.prev = 35;
          _context.t2 = _context["catch"](30);
          alert("Code: ".concat(_context.t2.code, " Msg: ").concat(_context.t2.message), 'warning');
          loadingPanelShow(false);
          return _context.abrupt("return");

        case 40:
          ;

        case 41:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 13], [16, 22], [30, 35]]);
};

var mint = function mint() {
  var mintCost, approve, _mint;

  return regeneratorRuntime.async(function mint$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(ethereum.selectedAddress === null)) {
            _context2.next = 9;
            break;
          }

          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(syncWallet());

        case 4:
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

        case 9:
          mintCost = 5000000000000000; // wei => 0.005 WETH
          // Start loading and btn disable

          loadingPanelShow(true);
          _context2.prev = 11;
          _context2.next = 14;
          return regeneratorRuntime.awrap(wethContract.methods.approve("0xB3E8BF31Da5585e50640A2157d4986d964726e92", (document.getElementById('amount').value * mintCost).toString()).send({
            from: ethereum.selectedAddress
          }));

        case 14:
          approve = _context2.sent;
          // cast transaction hash and gas
          txData.insertAdjacentHTML('beforeend', "<div class='Tx'>Approve Tx: <a target='_blank' href='".concat(txBaseUri).concat(approve.transactionHash, "'>", "".concat(approve.transactionHash.slice(0, 4), "...").concat(approve.transactionHash.slice(-4)), "</a>, Gas Used: ").concat(approve.gasUsed, "</div>"));
          _context2.prev = 16;
          _context2.next = 19;
          return regeneratorRuntime.awrap(powlContract.methods.mint(parseInt(document.getElementById('amount').value)).send({
            from: ethereum.selectedAddress
          }));

        case 19:
          _mint = _context2.sent;
          // cast transaction hash and gas
          txData.insertAdjacentHTML('beforeend', "<div class='Tx'>Mint Tx: <a target='_blank' href='".concat(txBaseUri).concat(_mint.transactionHash, "'>", "".concat(_mint.transactionHash.slice(0, 4), "...").concat(_mint.transactionHash.slice(-4)), "</a>, Gas Used: ").concat(_mint.gasUsed, "</div>")); // Stop loading and btn disable

          loadingPanelShow(false);
          _context2.next = 29;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t1 = _context2["catch"](16);
          alert("Code: ".concat(_context2.t1.code, " Msg: ").concat(_context2.t1.message), 'warning');
          loadingPanelShow(false);
          return _context2.abrupt("return");

        case 29:
          ;
          _context2.next = 37;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t2 = _context2["catch"](11);
          alert("Code: ".concat(_context2.t2.code, " Msg: ").concat(_context2.t2.message), 'warning');
          loadingPanelShow(false);
          return _context2.abrupt("return");

        case 37:
          ;

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 6], [11, 32], [16, 24]]);
}; // Detect chain change


ethereum.on('chainChanged', function (_chainId) {
  if (_chainId !== '0x13881') window.location.reload();
}); // Detect user change

ethereum.on('accountsChanged', function (accounts) {
  debugger;
}); // ABIS

var wethAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]';
var powlAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"creditPowls","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"giftPowl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gifted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintMax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"switchPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
var web3 = new Web3(window.ethereum);
var wethContract = new web3.eth.Contract(JSON.parse(wethAbi), '0x326C977E6efc84E512bB9C30f76E30c160eD06FB');
var powlContract = new web3.eth.Contract(JSON.parse(powlAbi), '0xB3E8BF31Da5585e50640A2157d4986d964726e92');