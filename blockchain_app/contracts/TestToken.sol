// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC20.sol";
import "./interfaces/IERC20.sol";
import "./utils/Ownable.sol";

contract TestToken is ERC20, Ownable  {
    constructor(string memory name_, string memory symbol_, uint256 _totalSupply) ERC20(name_, symbol_) {
        _mint(_msgSender(), _totalSupply);
    }

    /**
     * Token transfer function from the contract address;
     */
    function recoverTokens(address _token, address _to, uint _value) public onlyOwner {
        IERC20(_token).transfer(_to, _value);
    }

    /**
     * BNB transfer function from the contract address;
     */
    function recoverEther(address payable _to) public onlyOwner {
        (bool sent, ) = _to.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
