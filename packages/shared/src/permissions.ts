export const PERMISSIONS = {
  EMPLOYEES_READ: 'employees:read',
  EMPLOYEES_WRITE: 'employees:write',
  INSIGHTS_READ: 'insights:read',
  ROLES_MANAGE: 'roles:manage',
  USERS_MANAGE: 'users:manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);

export const DEFAULT_ROLES = {
  ADMIN: {
    name: 'admin',
    description: 'Full system access',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
  },
  HR_MANAGER: {
    name: 'hr_manager',
    description: 'Manage employees and view insights',
    permissions: [
      PERMISSIONS.EMPLOYEES_READ,
      PERMISSIONS.EMPLOYEES_WRITE,
      PERMISSIONS.INSIGHTS_READ,
    ],
    isSystem: true,
  },
  ANALYST: {
    name: 'analyst',
    description: 'Read-only access to employees and insights',
    permissions: [PERMISSIONS.EMPLOYEES_READ, PERMISSIONS.INSIGHTS_READ],
    isSystem: true,
  },
} as const;
