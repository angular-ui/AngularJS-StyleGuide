module = angular.module('App.Task');
module.factory( 'Task', (BaseObject, $http) => {
  class Task extends BaseObject {
    /**
     * Retrieve tasks from a project
     * @param {mixed} projectId
     * @returns {Promise<task[]>}
     */
    static list(projectId) {
      return $http.get('/api/tasks', { params: { project_id: projectId } })
        .then( response => response.data.map( task => new Task(task) ) );
    }


    /**
     * Creates a new task
     * 
     * @note Demonstrates how to have the create wait until uploading is complete
     *   Normally you might have to wait until the attachment is done before enabling
     *   submission of the form, but this way allows the user to submit before uploading
     *   is complete and makes it easy to show loading spinners.
     * 
     *   You could check either the `task.saving`, `task.creating`, or `task.uploading`
     *   properties for truthy value when the user tries to navigate away from the page.
     * 
     * @returns {Promise}
     */
    create() {
      // wraps `this.uploading` in a promise that resolves immediately if it is `null` or waits for the promise
      return this.cache('creating', () =>
        $q.when(this.uploading)
          .then( () => $http.post('/api/tasks', this) ) // uploading callback
          .then( response => Object.assign(this, response.data) ) // creating callback
      );
    }

    /**
     * Update the task
     *
     * @returns {Promise}
     */
    update() {
      // wraps `this.uploading` in a promise that resolves immediately if it is `null` or waits for the promise
      return this.cache('updating', () =>
        $q.when(this.uploading)
          .then( () => $http.put(`/api/tasks/${this.id}`, this) ) // uploading callback
          .then( response => Object.assign(this, response.data) ) // creating callback
      );
    }
    
    /**
     * Allow you to upload attachments to tasks
     * 
     * @note Added to demonstrate clean ways to have 1 method wait for another method to finish
     * @param {mixed} attachment
     * @returns {Promise}
     */
    upload(attachment) {
      return this.cache('uploading', () => 
        $http.post(`/api/attachments`, attachment)
          .then( response => this.attachments = response.data )
      );
    }
  }

  return Task;
});
