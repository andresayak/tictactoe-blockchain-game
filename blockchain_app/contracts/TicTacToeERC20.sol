// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IERC20.sol";
import "./IGame.sol";

contract TicTacToeERC20 is IGame {
    enum GameStatus{WAIT, PROGRESS, FINISHED}
    enum Side{NONE, PLAYER1, PLAYER2}

    address public immutable factory;
    uint public timeoutTime;
    address public token;
    uint public coins;
    uint public size;
    uint public turnNumber;
    uint public lastStepTime;
    address public player1;
    address public player2;
    Side public winner = Side.NONE;
    Side public currentTurn = Side.PLAYER1;
    GameStatus public status = GameStatus.WAIT;

    mapping(uint8 => mapping(uint8 => Side)) public board;

    event GameStart(address player2, uint8 row, uint8 col);
    event MoveMade(Side side, uint8 row, uint8 col);
    event GameEnded(Side side, uint256 amountWon);

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Only players can call this function");
        _;
    }

    modifier duringGame() {
        require(status != GameStatus.WAIT, "Game hasn't started");
        require(status != GameStatus.FINISHED, "Game has ended");
        _;
    }

    constructor(address _factory){
        factory = _factory;
    }

    function init(uint _timeoutTime, address _token, uint _coins, uint _size) external {
        require(msg.sender == factory, 'not factory');
        timeoutTime = _timeoutTime;
        player1 = tx.origin;
        token = _token;
        coins = _coins;
        size = _size;
    }

    function start() external {
        require(status == GameStatus.WAIT, "Game has started");
        assert(IERC20(token).transferFrom(msg.sender, address(this), coins));
        player2 = msg.sender;
        status = GameStatus.PROGRESS;
    }

    function timeout() duringGame external {
        require(lastStepTime + timeoutTime < block.timestamp, 'timeout has not yet');
        winner = (currentTurn == Side.PLAYER1) ? Side.PLAYER2 : Side.PLAYER1;
        endGame();
    }

    function step(uint8 row, uint8 col) external duringGame onlyPlayers {
        require(row < size && col < size, "Invalid row or column");
        require(board[row][col] == Side.NONE, "Cell already occupied");
        Side _side = (msg.sender == player1) ? Side.PLAYER1 : Side.PLAYER2;
        require(currentTurn == _side, "Not your turn");

        board[row][col] = _side;
        lastStepTime = block.timestamp;

        emit MoveMade(_side, row, col);

        if (checkWinner()) {
            endGame();
        } else if (turnNumber == 8) {
            endGame();
        } else {
            currentTurn = (_side == Side.PLAYER1) ? Side.PLAYER2 : Side.PLAYER1;
            turnNumber++;
        }
    }

    function checkWinner() internal returns (bool) {
        for (uint8 i = 0; i < size - 2; i++) {
            for (uint8 j = 0; j < size - 2; j++) {
                if(board[i][j] != Side.NONE){
                    if ((board[i][j] == board[i][j+1] && board[i][j] == board[i][j+2])
                        || (board[i][j] == board[i+1][j] && board[i][j] == board[i+2][j])
                        || (board[i][j] == board[i+1][j+1] && board[i][j] == board[i+2][j+2])
                        || (i > 1 && j > 1 && board[i][j] == board[i-1][j-1] && board[i][j] == board[i-2][j-2])
                    ) {
                        winner = board[i][j];
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function endGame() internal {
        status = GameStatus.FINISHED;
        if (winner != Side.NONE) {
            address _winner = (winner == Side.PLAYER1) ? player1 : player2;
            uint amountWon = coins * 2;
            assert(IERC20(token).transfer(_winner, amountWon));
            emit GameEnded(winner, 0);
        } else {
            assert(IERC20(token).transfer(player1, coins));
            assert(IERC20(token).transfer(player2, coins));
            emit GameEnded(Side.NONE, 0);
        }
    }
}
