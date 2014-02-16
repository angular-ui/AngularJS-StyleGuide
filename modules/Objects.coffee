module = angular.module('App')

module.factory 'BaseObject', ($q) ->
	
	class BaseObject
		constructor: (upStream = new Bacon.Bus(), @downStream = new Bacon.Bus(), initData = {}) ->
			@upStream = new Bacon.Bus()
			# Make this object stream push into the parent object stream
			# TODO: bus.merge() may be the wrong method
			upStream.merge( @upStream )
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

        query: (payload) ->
        	@upStream.push(payload)

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
