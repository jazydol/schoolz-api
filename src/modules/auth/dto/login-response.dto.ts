import { UserType } from '../../users/enums/user-type.enum';

export class LoginResponseDto {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    type: UserType;
  };
}

