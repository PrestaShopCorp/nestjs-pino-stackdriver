import { IsDefined, IsString } from 'class-validator';

export class ExampleCommand {
  @IsString()
  @IsDefined()
  id: string;
}
