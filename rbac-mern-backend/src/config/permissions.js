export const Roles = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

// Declarative permission matrix
export const Permission = {
  POST_CREATE: 'posts:create',
  POST_READ: 'posts:read',
  POST_UPDATE: 'posts:update',
  POST_DELETE: 'posts:delete',
  USER_MANAGE: 'users:manage'
};

export const RolePermissions = {
  [Roles.ADMIN]: [
    Permission.POST_CREATE,
    Permission.POST_READ,
    Permission.POST_UPDATE,
    Permission.POST_DELETE,
    Permission.USER_MANAGE
  ],
  [Roles.EDITOR]: [
    Permission.POST_CREATE,
    Permission.POST_READ,
    Permission.POST_UPDATE // only own via ownership check
  ],
  [Roles.VIEWER]: [
    Permission.POST_READ
  ]
};

export function canRole(role, permission) {
  const perms = RolePermissions[role] || [];
  return perms.includes(permission);
}
