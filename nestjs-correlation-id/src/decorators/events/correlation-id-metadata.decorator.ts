import { AddCorrelationId } from '..';

export const CorrelationIdMetadata = () =>
  AddCorrelationId('metadata.correlation_id');
