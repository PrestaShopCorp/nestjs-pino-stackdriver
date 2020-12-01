export interface CorrelationIdConfigInterface {
  headerName?: string;
  idGenerator?: () => string;
}
