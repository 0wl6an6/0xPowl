// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// Tokens 
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// Security
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// Utilities
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OxPowl is ERC1155, Ownable, ReentrancyGuard { 

  string  public name = "0xPowl";
  string  public symbol = "POWL";
  uint256 public paused = 0; 
  
  uint256 public minted;
  uint256 public gifted = 0;
  uint256 public totalSupply = 10000;
  uint256 public mintMax = 25;
  uint256 public mintCost = 5000000000000000; // wei => 0.005 ether

  address payable ownerAddress = payable(0xF57532AD9839Dd0f8D1D23BDf3aaf7ea9A7d8b78);
  IERC20  wethToken = IERC20(0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619);

  constructor () ERC1155("ipfs://bafybeie24nije6bd5zthv4zvdnmu45jquylhkbimm5zntdshf4wgwbtuwm/{id}.json") {}

  function uri(uint256 _tokenId) override public pure returns(string memory) {
    return string(abi.encodePacked("ipfs://bafybeie24nije6bd5zthv4zvdnmu45jquylhkbimm5zntdshf4wgwbtuwm/", Strings.toString(_tokenId), ".json"));
  }

  // Requires manual allowance on WETH contract
  // Or interaction through minting dapp https://owlgang.club
  function mint(uint256 _amount) public nonReentrant {
    require(paused != 1, 'Minting is paused'); // In-case of an emergency
    require(minted+_amount<=totalSupply, "Amount surpasses total supply"); // Check if reached max-supply.
    require(_amount <= mintMax, "Max per mint reached"); // Check for limit per mint.
    require(wethToken.balanceOf(msg.sender) > mintCost*_amount, "Not enough balance"); // Checks for users ERC20 balance 
    require(wethToken.transferFrom(msg.sender, ownerAddress, mintCost*_amount), "Transfer failed");
    if (_amount > 1) {
      batchmint(_amount, msg.sender); 
    } else {
      minted++;
      _mint(msg.sender,minted,1,"");
    }
  }

  function batchmint(uint _n, address _to) internal {
    uint256[] memory ids = new uint256[](_n); 
    uint256[] memory vals = new uint256[](_n); 
    for (uint i=0; i<_n; i++) {
      minted++;
      ids[i] = minted;
      vals[i] = 1;
    }
    _mintBatch(_to, ids, vals, "");
  }

  // 50 owls are reserved for rewards and giveaways
  function giftPowl(address _to) public onlyOwner {
    require(gifted < 50, "50 limit");
    minted++;
    _mint(_to, minted, 1, "");
  }

  // Mint 12 Powls to address - Migration from V1 to V2
  function creditPowls(address _to) public onlyOwner {
    batchmint(12, _to);
  }

  // In case of an emergency, break glass!
  function switchPaused() public onlyOwner {
    paused == 0 ? paused = 1 : paused = 0;
  }

  // This function is solely for withdrawing ERC20 funds sent 
  // to the contract itself. 
  // 
  // If such mistake happened to you, contact the owner.
  function witdrawERC20(address _token) public onlyOwner {
    IERC20 token = IERC20(_token);
    token.transfer(ownerAddress, token.balanceOf(address(this)));
  }

}