###
Project Module
============

In here we're demonstrating opening a modal upon entering a state (instead of swapping a view).
###

# Tracks the previous location and allows you to redirect back to that location
previousLocation = null

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
    
