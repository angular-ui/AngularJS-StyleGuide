###
Task Module
============
###

                                    # Module Tree Dependencies
module = angular.module('App.Task', ['App.Project', 'ui.router']).config ($stateProvider) ->
    $stateProvider.state 'tasks',
        parent: 'project'
        url: '/tasks'
        templateUrl: 'modules/Task/Tasks.html'
        controller: 'Tasks'
        resolve:
            tasks: (project) ->
                project.getTasks()
    $stateProvider.state 'tasks.new',
        url: '/new' # /projects/:projectId/tasks/new (state must be defined BEFORE /:taskId)
        resolve:
            task: (project) ->
                project.newTask()
        templateUrl: 'modules/Task/Form.html'
        controller: 'TaskForm'
    $stateProvider.state 'task',
        parent: 'tasks'
        url: '/:taskId' # /projects/:projectId/tasks/:taskId (state must be defined AFTER /new)
        views:
            '': # Projects.html: <ui-view></ui-view>
                templateUrl: 'modules/Task/Task.html'
                controller: 'Task'
            'header@project': # Project/Project.html: <ui-view name="header"></ui-view>
                templateUrl: 'modules/Task/TaskHeader.html'
                controller: 'TaskHeader'
        resolve:
            task: (project, $stateParams) ->
                project.getTask($stateParams.taskId)
        onEnter: (task) ->
            task.open()
        onExit: (project) ->
            task.close()
            
    $stateProvider.state 'task.edit',
        templateUrl: 'modules/Task/Form.html'
        controller: 'TaskForm'

module.controller 'Tasks', ($scope, tasks) ->
    $scope.tasks = tasks
    

module.controller 'Task', ($scope, task) ->
    $scope.task = task
    
module.controller 'TaskHeader', ($scope, task) ->
    $scope.task = task
    
module.controller 'TaskForm', ($scope, task) ->
    # injected `task` is either a new object or an existing object
    $scope.task = task
            
module.factory 'TaskObject', (BaseObject) ->
    class TaskObject extends BaseObject
        constructor: (upStream, downStream, initData) ->
            super(upStream, downStream, initData)
            
            
            @downStream.onValue (data) =>
                switch data.event
                    # cleanup this project from memory
                    when 'taskDeleted'
                        @close()
                    # keep this object up-to-date
                    when 'taskUpdated'
                        for value, property in data
                            @[property] = value
                        
            # Decorate queries with context
            @upStream.onValue (data) =>
                data.taskId = @id
        
        
        create: ->
                                          # Pass `this` as the payload
            @query( { method: 'createTask', data: @ } ).then (task) =>
                # Apply the generated ID to this object
                @id = task.id
                # keep in mind that this object should be discarded, as a
                # duplicate instance (attached to the proper streams) will be auto-generated
                
        update: ->
                                          # Pass `this` as the payload
            @query( { method: 'updateTask', data: @ } )
