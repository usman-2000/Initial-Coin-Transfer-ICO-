// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

contract CryptoDevToken is ERC20,Ownable{

    mapping (uint256 => bool) public tokenIdClaimed;
    uint256 public constant tokensPerNFT = 10 * 10**18;
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant maxTotalSupply = 10000 * 10**18;

    ICryptoDevs CryptoDevsNFT;

    constructor(address _cryptodevscontract) ERC20 ("Crypto Dev NFT","CD"){
        CryptoDevsNFT = ICryptoDevs(_cryptodevscontract);
    }

    function mint(uint256 amount) public payable{
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount , "Ether sent is incorrect");

        uint256 amountWithDecimals = amount *10**18;
        require(totalSupply()+amountWithDecimals <= maxTotalSupply,"Exceeds the max total supply available.");

        _mint(msg.sender , amountWithDecimals);

    }

    function claim() public {
        address sender = msg.sender;
        uint256 balance = CryptoDevsNFT.balanceOf(sender);

        require(balance > 0, "You don't have any cryto NFT's");
        uint amount = 0;
        for(uint i = 0; i < amount; i++){
            uint tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender,i);
            if(!tokenIdClaimed[tokenId]){
                amount+=1;
                tokenIdClaimed[tokenId ] = true;
            } 
        }
        require(amount > 0, "You have already claimed all the tokens");
        _mint(msg.sender,amount * tokensPerNFT);
    }

    function withdraw() public onlyOwner{
        uint256 amount = address(this).balance;
        require(amount > 0 ,"You donot have balance to withdraw");

        address _owner = owner();
        (bool sent ,) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}
    fallback() external payable {}


}
