var module = angular.module('App.Auth', ['ui.router', 'ui.bootstrap']);

module.factory('Auth', ($q, $http) => {
  /**
   * Auth
   */
  return {
    /**
     * Retrieves the currently logged in user
     * @returns {Promise<User>}
     */
    checkCredentials() {
      return $http.get('/api/session');
    },
    /**
     * @param {UserObject} user
     * @param {boolean} rememberMe
     */
    login(user, rememberMe = false) {
      return $http.post('/api/session', user);
    }
  }
});
