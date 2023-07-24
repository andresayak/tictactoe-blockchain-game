import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const items = [
  {
    type: 0,
    address: "0xbf9fBFf01664500A33080Da5d437028b07DFcC55",
    createdAt: new Date().getTime(),
    lastStepAt: new Date().getTime(),
    creator: "0x018dF9cD73Db88D8f69D96ee8d34BB65425aB004",
    token: "Test Token (AAA)",
    tokenAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    tokenDecimals: 18,
    amount: "1000000000000000000",
    timeout: 60,
    size: 100,
  },
];

@Controller("my")
export class MyController {
  constructor(private readonly configService: ConfigService) {}
  @Get("wait/:address")
  async wait() {
    return {
      items,
    };
  }

  @Get("progress/:address")
  async progress() {
    return {
      items,
    };
  }

  @Get("closed/:address")
  async closed() {
    return {
      items,
    };
  }
}
