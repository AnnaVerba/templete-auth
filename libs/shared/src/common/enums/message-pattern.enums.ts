export enum AuthMessagePatternEnum {
  verifyEmail = 'verifyEmail',
  signUp = 'signUp',
  signIn = 'signIn',
  signInWithEmail = 'signInWithEmail',
  verifyLoginToken = 'verifyLoginToken',
  logout = 'logout',
  refresh = 'refresh',
  forgotPassword = 'forgotPassword',
  recoveryPassword = 'recoveryPassword',

  getGoogleAuthUrl = 'getGoogleAuthUrl',
  loginWithGoogle = 'loginWithGoogle',

  getFacebookAuthUrl = 'getFacebookAuthUrl',
  loginWithFacebook = 'loginWithFacebook',
}

export enum DeliveryMessagePatternEnum {
  sendEmail = 'sendEmail',
}

export enum UserManagementMessagePatternEnum {
  findAllUsers = 'findAllUsers',
  createNewUser = 'createNewUser',
  findUserByEmail = 'findUserByEmail',
  findUserById = 'findUserById',
  updateUser = 'updateUser',
  deleteUser = 'deleteUser',

  updateUserProfile = 'updateUserProfile',

  addSession = 'addSession',
  findSession = 'findSession',
  updateSession = 'updateSession',
  findAllUserSessions = 'findAllUserSessions',
  expireSession = 'expireSession',
  deleteSession = 'deleteSession',

  addProvider = 'addProvider',
  findProvider = 'findProvider',
  findProviderByUser = 'findProviderByUser',
  updateProvider = 'updateProvider',
  deleteProvider = 'deleteProvider',

  addRoleToUser = 'addRoleToUser',
  removeRoleFromUser = 'removeRoleFromUser',

  findAllRoles = 'findAllRoles',
  createRole = 'createRole',
  addPermissionToRole = 'addPermissionToRole',
  removePermissionFromRole = 'removePermissionFromRole',
  findRoleById = 'findRoleById',
  updateRole = 'updateRole',
  deleteRole = 'deleteRole',

  createPermission = 'createPermission',
  updatePermission = 'updatePermission',
  findPermissionById = 'findPermissionById',
  findAllPermissions = 'findAllPermissions',
  deletePermission = 'deletePermission',
}
