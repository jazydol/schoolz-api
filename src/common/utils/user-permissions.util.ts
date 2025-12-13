import { UserType } from '../../modules/users/enums/user-type.enum';

/**
 * Checks if a user with the given role can create a user with the target role
 * @param requesterRole - The role of the user making the request
 * @param targetRole - The role of the user being created
 * @returns true if allowed, false otherwise
 */
export function canCreateUserType(
  requesterRole: UserType,
  targetRole: UserType,
): boolean {
  // Super admins can create all user types
  if (requesterRole === UserType.SUPER_ADMIN) {
    return true;
  }

  // School admins can create: school_admin, teacher, student, parent
  // But NOT super_admin
  if (requesterRole === UserType.SCHOOL_ADMIN) {
    return [
      UserType.SCHOOL_ADMIN,
      UserType.TEACHER,
      UserType.STUDENT,
      UserType.PARENT,
    ].includes(targetRole);
  }

  // Teachers, students, and parents cannot create any users
  return false;
}

/**
 * Gets the list of user types that a role can create
 * @param role - The role to check
 * @returns Array of user types that can be created
 */
export function getCreatableUserTypes(role: UserType): UserType[] {
  if (role === UserType.SUPER_ADMIN) {
    return [
      UserType.SUPER_ADMIN,
      UserType.SCHOOL_ADMIN,
      UserType.TEACHER,
      UserType.STUDENT,
      UserType.PARENT,
    ];
  }

  if (role === UserType.SCHOOL_ADMIN) {
    return [
      UserType.SCHOOL_ADMIN,
      UserType.TEACHER,
      UserType.STUDENT,
      UserType.PARENT,
    ];
  }

  // Teachers, students, and parents cannot create any users
  return [];
}

