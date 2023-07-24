import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BSC, BSCTestnet, Hardhat } from "../chains";
import { ethers } from "ethers";

@Injectable()
export class ProviderFactoryService {
  public chains: {
    [k: number]: {
      providerUrl: string;
      publicConfig: {
        FACTORY_ADDRESS: string;
      };
    };
  } = {};
  constructor(private readonly configService: ConfigService) {
    this.chains = {
      [BSC.chainId]: {
        providerUrl: this.configService.get("BSCMAINNET_PROVIDER_URL"),
        publicConfig: {
          FACTORY_ADDRESS: this.configService.get("FACTORY_ADDRESS_BSC"),
        },
      },
      [BSCTestnet.chainId]: {
        providerUrl: this.configService.get("BSCTESTNET_PROVIDER_URL"),
        publicConfig: {
          FACTORY_ADDRESS: this.configService.get("FACTORY_ADDRESS_BSCTESTNET"),
        },
      },
      [Hardhat.chainId]: {
        providerUrl: this.configService.get("HARDHAT_PROVIDER_URL"),
        publicConfig: {
          FACTORY_ADDRESS: this.configService.get("FACTORY_ADDRESS_HARDHAT"),
        },
      },
    };
  }

  create(chainId: number) {
    if (!this.chains[chainId]) {
      throw Error("wrong chain");
    }
    return new ethers.JsonRpcProvider(this.chains[chainId].providerUrl);
  }
}
