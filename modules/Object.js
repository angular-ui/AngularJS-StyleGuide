var module = angular.module('App');

module.factory('BaseObject', ($q) => {
  class BaseObject {

    constructor(data) {
      Object.assign(this, data);
    }

    /**
     * Switch to high-memory mode
     *
     * Usually means it's being rendered on screen and should get extra details and keep them updated
     */
    open() {}

    /**
     * Switch to low-memory mode
     *
     * Unsubscribe unnecessary overhead
     */
    close() {}
    
    /**
     * Prevents parallel queries and provides a stateful flag for view rendering
     * 
     * Also allows you to permanently store cache to prevent any subsequent calls
     * 
     * @param {string} name         Name of property flag to use for caching the promise
     * @param {function} callback   Executes the query and returns a promise
     * @param {boolean} [permanent] If the cache should be removed upon completion (default:false)
     */
    cache(name, callback, permanent = false) {
      // if promise already present (in progress) then return it instead
      if (this[name])
        return this[name];
      
      // sets (truthy) flag reference to promise + avoids redundant calls
      return this[name] = callback()
        // flag cleanup (doesn't affect chaining)
        .finally( () => {
          if (!permanent)
            this[name] = null;
        });
    }

    /**
     * object.save() - Convenience wrapper
     * 
     * Sets an `object.saving` flag to the promise (truthy) and clears the flag when finished
     * Using `Promise.finally()` allows you to execute code on success OR fail withought affecting chaining
     */
    save() {
      return this.cache('saving', () => this.id ? this.update() : this.create() );
    }

    /**
     * object.create() - stubbed with example state flag creating
     * 
     * @note Use object.save() instead of calling this method directly
     */
    create() {
      return this.cache('creating', () => $q.when(this) );
    }
    
    /**
     * object.update() - stubbed with example state flag updating
     * 
     * @note Use object.save() instead of calling this method directly
     */
    update() {
      return this.cache('updating', () => $q.when(this) );
    }

    /**
     * object.delete() - stubbed with example state flag updating
     */
    delete() {
      return this.cache('deleting', () => $q.when(this) );
    }

    /**
     * Make a copy of object for use in forms
     * 
     * When you edit a record in a form, you want the original to be preserved while the user makes changes
     * This allows you to edit a record exactly as if you were creating one without having to worry about
     * rolling back changes to the object.
     * 
     * @note This makes a shallow copy only
     */
    clone() {
      var constructor = Object.getPrototypeOf(this).constructor;
      return new constructor(this);
    }

    /**
     * Cleans up listeners (should run when discarding object)
     */
    destroy() {}
  }

  return BaseObject;
});
