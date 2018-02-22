/**
 * Paginator - Simple paginator utility example that abstracts logic in a controllable pattern
 *
 * @param paginate {function} Query function that takes paginationOptions
 *
 * @example
 *   let paginatedProjects = new Paginator(Project.list, { limit: 50 });
 *   paginatedProjects.items; // data accessible here
 *   paginatedProjects.next(); // load the first/subsequent data
 *
 * @example
 *   let projectId = 23;
 *   // Customize the paginator function
 *   let paginatedTasks = new Paginator( (paginationOptions) => Task.list( projectId, paginationOptions) );
 *
 * @example
 *   let projectId = 23;
 *   // Set default parameters for paginator function
 *   let paginatedTasks = new Paginator( Task.list, { projectId: projectId });
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
      this.resetOptions = options;
      this.paginate = paginate;
      this.relatedHelpers = relatedHelpers;
      this.related = _.mapValues(this.relatedHelpers, () => {
        return {};
      });
    }

    /**
     * The function that performs the query
     *
     * @param  {url|function} paginate
     *   If a url is provided, a wrapper for $http.get() is created
     *   If a callback is provided, use that instead
     */
    set paginate(paginate) {
      this.reset();
      if (angular.isString(paginate))
        this._paginate = (paginateOptions) => $http.get(paginate, { params: paginateOptions });
      else
        this._paginate = paginate;
    }

    /**
     * @returns {function}
     */
    get paginate() {
      return this._paginate;
    }

    /**
     * Clear items collection. Useful for preserving related data.
     *
     * @note If you want a hard reset of all related data, create a new Paginator
     * 
     * @param {object} [resetOptions]
     *   Optional hash of options to reset with,
     *   otherwise last reset options will be used
     */
    reset(resetOptions = this.resetOptions) {
      this.resetOptions = resetOptions;
      this.options = _.extend({
        limit: 20,
        offset: 0
      }, resetOptions);
      this.hasMore = true;
      return this.items = [];
    }

    /**
     * Load more items and add to cache
     * @param {Promise}
     */
    next() {
      if (!this.hasMore) return $q.when();
      if (this.loading) return this.loading;

      return this.loading = this.paginate(this.options).then( items => {
        if (items.length < this.options.limit)
          this.hasMore = false;

        this.items.push.apply(this.items, items);
        this.options.offset = this.items.length;
        return this.getRelated(items)
          .then( related => this.items )
          .finally( () => this.loading = null );
      });
    }

    /**
     * Add item to cache and retrieve related data
     *
     * @param  {index|object} item Reference to an object or the index
     */
    add(item) {
      this.items.unshift(item);
      return this.getRelated([item]);
    }

    /**
     * Remove item from cache
     *
     * @param  {index|object} item Reference to an object or the index
     */
    remove(item) {
      if (!this.items[item])
        item = this.items.indexOf(item);
      
      if (~item)
        this.items.splice(item, 1);
    }

    /**
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

  }

  return Paginator;
});
