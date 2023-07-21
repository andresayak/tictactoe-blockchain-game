// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGame {
    function init(uint16 _timeoutTime, address _token, uint _coins, uint8 _size) external;

}
