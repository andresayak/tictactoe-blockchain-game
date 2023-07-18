// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IERC20.sol";
import "./TicTacToeERC20.sol";
import "./IGame.sol";
import "./utils/Ownable.sol";
import "./utils/Context.sol";

contract Factory is Ownable {
    IGame[] public games;

    event GameCreated(address game, address creator);

    function _msgSender() internal view override(Context) returns (address) {
        return Context._msgSender();
    }

    function createGame(uint _timeoutTime, address _token, uint _coins, uint _size) public returns(address) {
        IGame game = (new TicTacToeERC20(address(this)));
        game.init(_timeoutTime, _token, _coins, _size);
        games.push(game);

        assert(IERC20(_token).transferFrom(_msgSender(), address(game), _coins));

        emit GameCreated(address(game), _msgSender());
        return address(game);
    }
}
