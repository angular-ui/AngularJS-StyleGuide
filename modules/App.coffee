module = angular.module('App', ['ui.router', 'App.Authentication', 'App.Guest'])

module.config ($urlRouterProvider, $provide) ->

	# Default State
    $urlRouterProvider.otherwise("projects")


module.run () ->


module.factory 'BaseObject', ($q) ->
	
	class BaseObject
		constructor: (@upStream = new Bacon.Bus(), @downStream = new Bacon.Bus(), initData = {}) ->
			_.extend( @, initData )
            @promiseCaches = {}
            @listeners = []

		open: ->

		close: ->

        cache: (key, execute) ->
            if !@promiseCaches[key]?
                @promiseCaches[key] = execute().then (data) =>
                    @promiseCaches[key] = null
                    data
            @promiseCaches[key]

		# Convenience wrapper
		save: ->
			if @id
				@update()
			else
				@create()

		create: ->

		edit: ->

        delete: ->

        clone: ->
            new @constructor(null, null, @)

            
        ###
        Closes all open stream listeners

        To register a listener for cleanup, do the following
        @listeners.push @streams.someStream.onValue(...)
        ###
        close: ->
            listener() while listener = @listeners.pop()
            
module.factory 'AppObject', (BaseObject, Socket) ->
	class AppObject extends BaseObject
		constructor: (upStream, downStream, initData) ->
			super(upStream, downStream, initData)
			
	# Singleton, this is where the socket streams are wired into the ORM
	new AppObject(Socket.queryStream, Socket.eventStream)
