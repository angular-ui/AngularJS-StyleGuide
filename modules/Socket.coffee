module = angular.module('App')

module.factory 'Socket', (Stream, $rootScope) ->

	class Socket
		constructor: (@url) ->
			@queue = []

			@open()


		setupQueryStream: ->
			# opening a socket is async and a queue may form
			@socket.onopen = =>
				@flush()

			if !@queryStream
				@queryStream ?= new Stream()

				@queryStream.listen (data) =>

					# Stringify now in case data changes while waiting in @queue
					data = JSON.stringify(data)

					if @socket.readyState is WebSocket.OPEN
						@send(data)
					else
						@queue.push(data)
						if @socket.readyState is WebSocket.CLOSE
							@open()


		setupEventStream: ->
			@eventStream ?= new Stream()

			@socket.onmesssage = (data) =>
				# Now Entering AngularJS...
				$rootScope.$apply ->
					@eventStream.push( JSON.parse(data) )


		close: ->
			@socket.close()

		open:  ->
			@socket = new WebSocket(@url)
			@setupQueryStream()
			@setupEventStream()


		send: (data) ->
			@socket.send( data )

		flush: ->
			while item = @queue.pop()
				@send(item)

	new Socket('/api')
