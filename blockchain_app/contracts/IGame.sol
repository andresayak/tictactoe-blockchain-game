// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGame {
    function init(uint _timeoutTime, address _token, uint _coins, uint _size) external;

}
