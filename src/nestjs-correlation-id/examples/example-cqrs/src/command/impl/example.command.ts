import { IsString, IsNotEmpty } from 'class-validator';
import { HEADER_CORRELATION_ID } from '../../../../../src';

export class ExampleCommand {
  @IsNotEmpty()
  @IsString()
  id: Required<string> = '';
  @IsNotEmpty()
  @IsString()
  [HEADER_CORRELATION_ID]: string = '';
}
