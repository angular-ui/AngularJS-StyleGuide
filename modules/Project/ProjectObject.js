module = angular.module('App.Project')
module.factory('ProjectObject', (BaseObject, $http) => {
  class Project extends BaseObject {
    static list(userId) {
      return $http.get('/api/projects', { params: { user_id: userId } })
        .then( (response) => response.data.map( project => new Project(project) ) );
    }

    static get(id) {
      return $http.get(`/api/projects/${id}`)
        .then( (response) => new Project(response.data));
    }


    create() {
      return this.cache('creating', () => $http.post('/api/projects', this )
        .then( (response) => {
          this.id = response.data.id;
          return response.data;
        })
      );
    }

    update() {
      return this.cache('updating', () => $http.put(`/api/projects/${this.id}`, this) );
    }
  }

  return Project;
});
