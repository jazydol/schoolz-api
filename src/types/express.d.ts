import { UserType } from '../modules/users/enums/user-type.enum';

declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      type: UserType;
      name: string;
    }
  }
}

