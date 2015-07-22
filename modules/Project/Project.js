/*
Project Module
============
*/
var module = angular.module('App.Project', ['ui.router', 'ui.bootstrap'])

module.config(function($stateProvider) {
  $stateProvider.state( 'projects', {
    parent: 'authenticated',
    url: '/projects',
    templateUrl: 'modules/Project/Projects.html',
    controller: 'Projects',
    resolve: {
      projects: (authenticatedUser, Project) => Project.list(authenticatedUser.id)
    },
    // `breadcrumbs` resolved in `authenticated` state
    onEnter(breadcrumbs) {
      breadcrumbs.push({ label: 'Projects', sref: 'projects' });
    },
    onExit(breadcrumbs) {
      breadcrumbs.pop();
    },
  });
  $stateProvider.state( 'projects.new', {
    url: '/new', // /projects/new (state must be defined BEFORE /:projectId)
    resolve: {
      project: (authenticatedUser, Project) => new Project({ user_id: authenticatedUser.id })
    },
    templateUrl: 'modules/Project/Form.html',
    controller: 'ProjectForm',
    // `breadcrumbs` resolved in `authenticated` state
    onEnter(breadcrumbs) {
      breadcrumbs.push({ label: 'New', sref: 'projects.new' });
    },
    onExit(breadcrumbs) {
      breadcrumbs.pop();
    }
  });
  $stateProvider.state( 'project', {
    parent: 'projects',
    url: '/:projectId', // /projects/:projectId (state must be defined AFTER /new)
    views: {
      '': { // Projects.html: <ui-view></ui-view>
        templateUrl: 'modules/Project/Project.html',
        controller: 'Project'
      },
      'header@authenticated': { // Authenticated.html: <ui-view name="header"></ui-view>
        templateUrl: 'modules/Project/ProjectHeader.html',
        controller: 'ProjectHeader'
      }
    },
    resolve: {
      project: ($stateParams, Project) => Project.get($stateParams.projectId)
    },
    onEnter(project, breadcrumbs) {
      project.open();
      breadcrumbs.push({ label: project.name, sref: 'project' }); // Params inferred when going up
    },
    onExit(project, breadcrumbs) {
      project.close();
      breadcrumbs.pop();
    }
  });
  $stateProvider.state( 'project.edit', {
    templateUrl: 'modules/Project/Form.html',
    controller: 'ProjectForm'
  });
});

module.controller( 'Projects', ($scope, projects) => {
  $scope.projects = projects;
});

module.controller( 'Project', ($scope, project) => {
  $scope.project = project;
});

module.controller( 'ProjectHeader', ($scope, project) => {
  $scope.project = project;
});

module.controller( 'ProjectForm', ($scope, project) => {
  // injected `project` is either a new object or an existing object
  $scope.project = project;
});
