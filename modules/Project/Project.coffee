###
Project Module
============
###


module = angular.module('App.Project', ['ui.router', 'ui.bootstrap']).config ($stateProvider) ->
    $stateProvider.state 'projects',
        parent: 'authenticated'
        url: '/projects'
        templateUrl: 'modules/Project/Projects.html'
        controller: 'Projects'
        resolve:
            projects: (AppObject) ->
                AppObject.getProjects()
    $stateProvider.state 'project',
        parent: 'projects'
        url: '/:projectId' # /projects/:projectId
        views:
            '': # Projects.html: <ui-view></ui-view>
                templateUrl: 'modules/Project/Project.html'
                controller: 'Project'
            '@header': # Authenticated.html: <ui-view name="header"></ui-view>
                templateUrl: 'modules/Project/ProjectHeader.html'
                controller: 'ProjectHeader'
        resolve:
            project: (AppObject, $stateParams) ->
                AppObject.getProject($stateParams.projectId)
        onEnter: (project) ->
            project.open()
        onExit: (project) ->
            project.close()

module.controller 'Projects', ($scope, projects) ->
    $scope.projects = projects
    

module.controller 'Project', ($scope, project) ->
    $scope.project = project
    
    
module.controller 'ProjectHeader', ($scope, project) ->
    $scope.project = project
    
            
module.factory 'ProjectObject', (BaseObject, TaskObject) ->
    class ProjectObject extends BaseObject
        constructor: (upStream, downStream, initData) ->
            super(upStream, downStream, initData)
            
            # keep @tasks collection up-to-date
            @downStream.onValue (data) =>
                switch data.event
                    when 'projectDeleted'
                        @close()
                    when 'taskCreated'
                        @tasks?[data.id] = new TaskObject(@upStream, @downStream, data)
                    when 'taskDeleted'
                        delete @tasks?[data.id]
                        
            # Decorate queries with context
            @upStream.onValue (data) =>
                data.projectId = @id
                        
        getTasks: ->
            # if a collection of projects is already available, we don't need to query
            if @tasks
                return @resolve(@tasks)
            
            @query( { method: 'findAllTasks' } ).then (tasks) => # => preserves the outter `this` reference
                # child tasks are stored as a collection property
                @tasks = {}
                
                # each task is spun up as a ProjectObject instance
                for task, id of tasks
                    @tasks[id] = new TaskObject(@upStream, @downStream, task)
                    
                # return the collection
                @tasks
                
        getTask: (id) ->
            if @tasks
                @resolve(@tasks[id])
            else
                @getTasks().then => # => preserves the `this` reference
                    @tasks[id] or @reject()
                    
        close: ->
            super()
            # Stop maintaining children collections
            @tasks = null
