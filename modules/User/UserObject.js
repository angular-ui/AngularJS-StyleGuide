var module = angular.module('App.User');
module.factory( 'User', (BaseObject, $http) => {
  class User extends BaseObject {
    static list() {
      return $http.get('/api/users')
        .then( (response) => response.data.map(User.new));
    }


    // checks validity of the property (probably should be in BaseObject)
    validate(property) {
      if (!User.rules[property])
        return true;

      var pattern = new RegExp(User.rules[property]);
      return pattern.test(this[property]);
    }
  }

  User.rules = {
    name: '[a-zA-Z0-1]{4,}', // 4 or more alphanum chars
    email: '.+this.gmail.com'
  };

  return User;
});
