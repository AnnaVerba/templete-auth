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
}
