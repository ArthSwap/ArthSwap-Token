// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract ArthSwapToken is ERC20, Ownable {
    uint256 private _totalSupply;
    uint256 private _maxSupply ;
    bool private _transferable;

    event BecameTransferable();

    constructor() ERC20("ArthSwap Token","ARSW") Ownable() {
        _maxSupply = 1000000000000000000000000000;
        _transferable = false;
    }

    modifier istransferable() {
        require(transferable() == true, "Can Not Transfer");
         _;
    }

    function transfer(address to, uint256 amount)
        public
        override
        istransferable
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override istransferable returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function mint(
        address to,
        uint256 amount
    )public onlyOwner returns (bool){
        require( totalSupply() + amount <= maxSupply());
        _mint(to,amount);
        return true;
    }

    function transferable() public view returns (bool){
        return _transferable;
    }

    function maxSupply() public view returns (uint256){
        return _maxSupply;
    }

    function toTransferable() public onlyOwner returns (bool){
        _toTransferable();
        return true;
    }

    function _toTransferable() internal onlyOwner{
        _transferable = true;
        emit BecameTransferable();
    }

}
