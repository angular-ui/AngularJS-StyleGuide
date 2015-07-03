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
angular.module('App').factory('Paginator', function($http, $q){

  class Paginator {
    /**
     * @param  {string|function} paginate URL or callback function that returns
     *                                    a promise
     * @param  {object} options Default paginate query options
     * @param  {object} relatedHelpers Map of callback functions that take array
     *                                 of items and returns an indexed hash
     */
    constructor(paginate, options = {}, relatedHelpers = {}) {
      this.paginate = paginate;
      this.relatedHelpers = relatedHelpers;
      this.related = _.mapValues(this.relatedHelpers, () => {
        return {};
      });
      this.options = _.extend({
        limit: 20,
        offset: 0
      }, options);
      this.items = [];
      this.hasMore = true;
      this.loading = null;
    }

    next() {
      if (!this.hasMore) return $q.when();
      if (this.loading) return this.loading;

      return this.loading = this.paginate(this.options).then( items => {
        if (items.length < this.options.limit)
          this.hasMore = false;

        this.items.push.apply(this.items, items);
        this.options.offset = this.items.length;
        this.loading = null;
        return this.getRelated(items);
      });
    }

    /**
     * getRelated(newItems)
     *
     * Iterates over related data retrieval helpers
     * When each helper resolves with a hash of relatedItems, they are merged onto
     * the paginator's existing cache of related items.
     *
     * @example
     *   paginator = new Paginator(Project.list(), {}, { owners: Project.relatedOwners });
     *   paginator.next();
     *
     *   <li ng-repeat="project in paginator.projects">
     *     {{paginator.related.owners[project.owner_id].name}}
     *   </li>
     *
     * @param  {array} [items] an array of objects to pass to the related helper
     * @return {Promise}       resolved when all helpers are done
     */
    getRelated(items = this.items) {
      return $q.all(_.mapValues(this.relatedHelpers, (helper, name) =>
        helper(items)
          .then( relatedItems => _.extend(this.related[name], relatedItems) )
      ));
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
