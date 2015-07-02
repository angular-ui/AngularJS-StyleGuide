/**
 * Paginator - Simple paginator utility example that abstracts logic in a controllable pattern
 *
 * @param paginate {function} Query function that takes paginationOptions
 *
 * @example
 *   resolve: {
 *     // Prepares the paginator
 *     paginator: function(Paginator, Project) {
 *       // Calls `Project.list(paginationOptions)`
 *       return new Paginator(Project.list, { limit: 50 });
 *     },
 *     // Queries the initial load
 *     projects: function(paginator) {
 *       return paginator.next();
 *     }
 *   }
 *
 * @example
 *   resolve: {
 *     taskPaginator: function(Paginator, Task, $stateParams) {
 *       return new Paginator( (paginationOptions) => Task.list($stateParams.projectId, paginationOptions) );
 *       // or
 *       return new Paginator( Task.list, { projectId: $stateParams.projectId } );
 *     },
 *     tasks: function(taskPaginator) {
 *       return taskPaginator.next();
 *     }
 *   }
 */
angular.module('App').factory('Paginator', function($q){
  class Paginator {
    constructor(paginate, options) {
      this.paginate = paginate;
      this.options = _.extend({
        limit: 50,
        offset: 0
      }, options);
      this.items = [];
      this.hasMore = true;
      this.loading = null;
    }

    next() {
      if (!this.hasMore) return $q.when();
      if (this.loading) return this.loading;

      return this.loading = this.paginate(this.options)
        .then( response => {
          if (response.data.results.length < this.options.limit)
            this.hasMore = false;
  
          this.items.push.apply(this.items, response.data.results);
          this.options.offset = this.items.length;
          this.loading = null;
          return this.items;
        });
    }

    /**
     * paginator.paginate - paginator function
     *
     * @param  {url|function} paginate
     *   If a url is provided, a wrapper for $http.get() is created
     *   If a callback is provided, use that instead
     */
    set paginate(paginate) {
      if (angular.isString(paginate))
        this._paginate = (paginateOptions) => $http.get(paginate, { params: paginateOptions });
      else
        this._paginate = paginate;
    }

    get paginate() {
      return this._paginate;
    }

  }
  return Paginator;
});
