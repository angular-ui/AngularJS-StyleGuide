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
     * object.save() - Convenience wrapper
     * 
     * Sets an `object.saving` flag to the promise (truthy) and clears the flag when finished
     * Using `Promise.finally()` allows you to execute code on success OR fail withought affecting chaining
     */
    save() {
      return this.saving = ( this.id ? this.update() : this.create() )
        .finally( () => this.saving = null );
    }

    /**
     * object.create() - stubbed with example state flag creating
     * 
     * @note Use object.save() instead of calling this method directly
     */
    create() {
      return this.creating = $q.when(this)
        .finally( () => this.creating = null );
    }
    
    /**
     * object.update() - stubbed with example state flag updating
     * 
     * @note Use object.save() instead of calling this method directly
     */
    update() {
      return this.updating = $q.when(this)
        .finally( () => this.updating = null );
    }

    /**
     * object.delete() - stubbed with example state flag updating
     */
    delete() {
      return this.deleting = $q.when(this)
        .finally( () => this.deleting = null );
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
      // TODO: add support for queries by passing parent(?)
      return new constructor(this);
    }

    /**
     * Cleans up listeners (should run when discarding object)
     */
    destroy() {}
  }

  return BaseObject;
});
