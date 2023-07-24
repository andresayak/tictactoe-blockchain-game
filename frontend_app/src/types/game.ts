export type GameDataType = {
  type?: number;
  tokenAddress: string;
  factoryAddress: string;
  creatorAddress: string;
  address: string;
  params: any;
  chainId: number;
  status: number;
  createdAt: Date;
};

export type GameTicTacToeDataType = GameDataType & {
  params: {
    size: string;
    coins: string;
    timeoutTime: string;
  }
}

export type GameStatusType = {
  turnNumber: number;
  lastStepTime: number,
  currentTurn: number;
  status: number;
  player2: string;
}

export const gameTypes = [
  'Tic Tac Toe'
];
