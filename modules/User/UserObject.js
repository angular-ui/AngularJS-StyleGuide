var module = angular.module('App.User');
module.factory( 'User', (BaseObject, $http) => {
  class User extends BaseObject {
    /**
     * Get list of users
     * 
     * @returns {Promise<User[]>}
     */
    static list() {
      return $http.get('/api/users')
        .then( (response) => response.data.map( user => new User(user) ));
    }


    /**
     * Validity function for use in the view / form
     *
     * @note Client-side validation is a convenience, server-side validation is imperative 
     */
    validate(property) {
      if (!User.rules[property])
        return true;

      var pattern = new RegExp(User.rules[property]);
      return pattern.test(this[property]);
    }
    
    create() {
      return this.cache('creating', () => 
        $http.post('/api/users', this)
          // Attach additional data from server to this object
          .then( data => Object.assign(this, data) )
      );
    }
    
    update() {
      return this.cache('updating', () => 
        $http.put('/api/users', this)
          // Attach additional data from server to this object
          .then( data => Object.assign(this, data) )
      );
    }
  }

  User.rules = {
    name: '[a-zA-Z0-1]{4,}', // 4 or more alphanum chars
    email: '.+this.gmail.com'
  };

  return User;
});
