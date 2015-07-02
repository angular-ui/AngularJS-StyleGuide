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
      this.items = [];
      this.hasMore = true;
      this.loading = false;
      this.options = Object.assign({
        limit: 20,
        offset: 0
      }, options);
    }

    next() {
      if (this.hasMore) {
        this.loading = true;

        return this.paginate(this.options)
          .then((response) => {
            //If the results are less than the required limit then the results are finished
            this.hasMore = response.data.results.length >= this.options.limit;

            this.items = this.items.concat(response.data.results);
            this.options.offset = this.items.length;

            return this.items;
          })
          .finally(() => this.loading = false);
      } else {
        return $q.when(this.items);
      }
    }
  }

  return Paginator;
});
