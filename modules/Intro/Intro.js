/*
Intro Module
============
Demonstrates putting sub-states inside a modal, such as for an introduction wizard.

*/
var module = angular.module('App.Intro', ['ui.router', 'ui.bootstrap'])

module.config(function($stateProvider) {
  $stateProvider.state( 'intro', {
    parent: 'authenticated',
    url: '/intro',
    resolve: {
      modal: function($modal) {
        return $modal.open({
          templateUrl: 'modules/Intro/Intro.html',
          controller: 'Intro',
        });
      }
    }
  });
  $stateProvider.state( 'intro.projects', {
    url: '/projects', // /intro/projects
    views: {
      'modal@': { // The $modal service places HTML at the top of the document. I know, it's weird.
        templateUrl: 'modules/Intro/projects.html'
      }
    },
  });
  $stateProvider.state( 'intro.tasks', {
    url: '/tasks', // /intro/tasks
    views: {
      'modal@': { // The $modal service places HTML at the top of the document. I know, it's weird.
        templateUrl: 'modules/Intro/tasks.html'
      }
    },
  });
  $stateProvider.state( 'intro.done', {
    url: '/done', // /intro/done
    views: {
      'modal@': { // The $modal service places HTML at the top of the document. I know, it's weird.
        templateUrl: 'modules/Intro/done.html'
      }
    },
  });
});
