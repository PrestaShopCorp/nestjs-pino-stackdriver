import { Context } from '../../../nestjs-context';
import { CONTEXT_CORRELATION_ID } from '../constants';

class DecoratorsContextTool {
  context: Context = new Context();
  setContext(context: Context) {
    this.context = context;
    return this;
  }
  getCorrelationId() {
    return this.context.get(CONTEXT_CORRELATION_ID);
  }
}
const decoratorsContextTool = new DecoratorsContextTool();

export default decoratorsContextTool;
