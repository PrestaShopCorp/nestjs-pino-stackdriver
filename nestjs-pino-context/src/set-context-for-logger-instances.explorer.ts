import { OnModuleInit, Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { PinoContextLogger } from './pino-context-logger.service';

@Injectable()
export class SetContextForLoggerInstancesExplorer implements OnModuleInit {
  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.explore();
  }

  explore() {
    const setContext = (wrapper: InstanceWrapper) => {
      if (!wrapper.instance) {
        return;
      }
      Object.values(wrapper.instance).forEach(service => {
        if (
          service &&
          service instanceof PinoContextLogger &&
          !service.hasContext()
        ) {
          service.setContext(wrapper.name);
        }
      });
    };

    this.discoveryService
      .getProviders()
      .forEach((wrapper: InstanceWrapper) => setContext(wrapper));

    this.discoveryService
      .getControllers()
      .forEach((wrapper: InstanceWrapper) => setContext(wrapper));
  }
}
