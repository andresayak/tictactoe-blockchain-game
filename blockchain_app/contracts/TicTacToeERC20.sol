// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IERC20.sol";
import "./IGame.sol";

contract TicTacToeERC20 is IGame {
    enum GameStatus{WAIT, PROGRESS, FINISHED, CANCELED}
    enum Side{NONE, PLAYER1, PLAYER2}

    uint16 public constant GAME_TYPE = 0;
    uint public birthdayBlock;
    address public immutable factory;
    address public immutable treasury;
    uint8 public immutable fee;
    uint16 public timeoutTime;
    address public token;
    uint public coins;
    uint8 public size;
    uint64 public turnNumber;
    uint256 public lastStepTime;
    uint256 public createdTime;
    address public player1;
    address public player2;
    Side public winner = Side.NONE;
    Side public currentTurn = Side.PLAYER1;
    GameStatus public status = GameStatus.WAIT;

    mapping(uint8 => mapping(uint8 => Side)) public board;

    event GameStart(address player2);
    event GameStep(Side side, uint8 row, uint8 col);
    event GameEnded(Side side, uint256 amountWon, uint256 fee);

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Only players can call this function");
        _;
    }

    modifier duringGame() {
        require(status != GameStatus.WAIT, "Game hasn't started");
        require(status != GameStatus.FINISHED, "Game has ended");
        _;
    }

    constructor(address _factory, address _treasury, uint8 _fee){
        factory = _factory;
        treasury = _treasury;
        fee = _fee;
        createdTime = block.timestamp;
        birthdayBlock = block.number;
    }

    function init(uint16 _timeoutTime, address _token, uint _coins, uint8 _size) external {
        require(msg.sender == factory, 'not factory');
        require(_size >= 3 && _size <= 100, "Wrong size");
        require(_timeoutTime >= 60 && _timeoutTime <= 65535, "Wrong timeout");
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
        lastStepTime = block.timestamp;
        emit GameStart(player2);
    }

    function cancel() external {
        require(msg.sender == player1, "Only creator can cancel game");
        require(status == GameStatus.WAIT, "Game has started");
        assert(IERC20(token).transfer(msg.sender, coins));
        status = GameStatus.CANCELED;
    }

    function timeout() duringGame external {
        require(lastStepTime + timeoutTime < block.timestamp, 'timeout has not yet');
        winner = (currentTurn == Side.PLAYER1) ? Side.PLAYER2 : Side.PLAYER1;
        endGame();
    }

    function step(uint8 _row, uint8 _col) external duringGame onlyPlayers {
        require(_row < size && _col < size, "Invalid row or column");
        require(board[_row][_col] == Side.NONE, "Cell already occupied");
        require(msg.sender == (currentTurn == Side.PLAYER1?player1:player2), "Not your turn");

        board[_row][_col] = currentTurn;
        lastStepTime = block.timestamp;

        emit GameStep(currentTurn, _row, _col);

        uint lastTurn = uint(size) * uint(size) - 1;
        if (checkWinner()) {
            endGame();
        } else if (turnNumber == lastTurn) {
            endGame();
        } else {
            currentTurn = (currentTurn == Side.PLAYER1) ? Side.PLAYER2 : Side.PLAYER1;
            turnNumber++;
        }
    }

    function checkWinner() internal returns (bool) {
        for (uint8 i = 0; i < size - 2; i++) {
            for (uint8 j = 0; j < size - 2; j++) {
                if (board[i][j] != Side.NONE) {
                    if ((board[i][j] == board[i][j + 1] && board[i][j] == board[i][j + 2])
                    || (board[i][j] == board[i + 1][j] && board[i][j] == board[i + 2][j])
                    || (board[i][j] == board[i + 1][j + 1] && board[i][j] == board[i + 2][j + 2])
                        || (i > 1 && j > 1 && board[i][j] == board[i - 1][j - 1] && board[i][j] == board[i - 2][j - 2])
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
            address _winnerAddress = (winner == Side.PLAYER1) ? player1 : player2;
            uint _amountWon = coins * 2;
            uint _fee = _amountWon * fee / 100;
            uint _amountWonAfterFee = _amountWon - _fee;
            assert(IERC20(token).transfer(_winnerAddress, _amountWonAfterFee));
            assert(IERC20(token).transfer(treasury, _fee));
            emit GameEnded(winner, _amountWonAfterFee, _fee);
        } else {
            assert(IERC20(token).transfer(player1, coins));
            assert(IERC20(token).transfer(player2, coins));
            emit GameEnded(Side.NONE, 0, 0);
        }
    }

    function currentTime() external view returns (uint256){
        return block.timestamp;
    }
}
