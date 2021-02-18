import { CorrelationIdMetadata } from '../../../../src';

@CorrelationIdMetadata()
export class ExampleEvent {
  constructor(public readonly data: any, public readonly metadata: any) {}
}
