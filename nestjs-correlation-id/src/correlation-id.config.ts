import { v4 as uuidv4 } from 'uuid';
import { HEADER_CORRELATION_ID } from './constants';
import { CorrelationIdConfigInterface } from './interfaces';

type Config = Required<CorrelationIdConfigInterface>;

// Reduce uuid size
const flickrBase58 =
  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const toFlickr = require('any-base')('0123456789abcdef', flickrBase58);

const shortIdGenerator = () => {
  const longId = uuidv4()
    .toLowerCase()
    .replace(/-/g, '');
  return toFlickr(longId);
};

const defaultConfig = {
  headerName: HEADER_CORRELATION_ID,
  idGenerator: shortIdGenerator,
} as Config;

export class CorrelationIdConfig {
  private readonly _config: Config;

  constructor(config: CorrelationIdConfigInterface = {}) {
    this._config = { ...defaultConfig, ...config };
  }

  get() {
    return this._config;
  }
}
