import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class ExampleCommand {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  id: Required<string> = '';
}
