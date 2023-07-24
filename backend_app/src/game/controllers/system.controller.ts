import { Controller, Get, Param } from "@nestjs/common";
import { ProviderFactoryService } from "../provider-factory.service";

@Controller("system")
export class SystemController {
  constructor(private readonly providerFactoryService: ProviderFactoryService) {}
  @Get("main/:chainId")
  async main(@Param("chainId") chainId: number) {
    const configs = this.providerFactoryService.chains;
    if (!configs[chainId]) {
      return {};
    }
    return configs[chainId].publicConfig;
  }
}
