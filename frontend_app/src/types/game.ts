export type GameType = {
  type?: number;
  address: string;
  createdAt: number;
  lastStepAt: number;
  creator: string;
  token: string;
  tokenAddress: string;
  tokenDecimals: number
  amount: string;
  timeout: number;
  size: number;
};

export type GameStatusType = {
  turnNumber: number;
  lastStepTime: number,
  currentTurn: number;
  status: number;
  tokenAddress: string;
  coins: number;
  player1: string;
  player2: string;
  timeout: number;
  currentTime: number;
  size: number;
}

export const gameTypes = [
  'Tic Tac Toe'
];
