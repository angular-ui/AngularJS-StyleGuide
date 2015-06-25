var module = angular.module('App');

module.factory('Stream', () => {
  class Stream {
    constructor() {
      this.listeners = [];
      this.children = [];
    }

    listen(listener) {
      this.listeners.push(listener);

      // unsubscriber
      return () => {
        this.listeners.splice( this.listeners.indexOf(listener), 1 );
      };
    }

    push(data) {
      // allow listeners to modify the data (use sparingly)
      let changeData = (newValue) => data = newValue;

      for (let listener in this.listeners) {
        data = this.listeners[listener](data, changeData) || data;
      }

      for (let childStream in this.children) {
        this.children[childStream].push(data);
      }
    }

    destroy() {
      this.listeners = [];
      this.children = [];
    }

    // Events from this stream will then go into the passed stream
    child(stream) {
      this.children.push(stream);

      // unsubscriber
      return () => {
        this.children.splice( this.children.indexOf(stream), 1 );
      };
    }
  }

  return Stream;
});
