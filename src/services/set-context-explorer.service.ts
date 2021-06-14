import { OnModuleInit, Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Logger } from './logger.service';

@Injectable()
export class SetContextExplorer implements OnModuleInit {
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
        if (service && service instanceof Logger && !service.hasContext()) {
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
