module = angular.module('App')

module.factory 'Socket', ($q, $rootScope) ->

	class Socket
		constructor: ->
			@setupQueryStream()
			@setupEventStream()

		setupQueryStream: ->
			@queryStream = new Bacon.Bus()
			@queryStream.onValue (payload) ->
				# TODO: Change to proper query code
				@socket.query(payload)

		setupEventStream: ->
			@eventStream = new Bacon.Bus()
			# TODO: Change to proper onmessage code
			@socket.onmesssage = ->
				$rootScope.$apply ->
					@eventStream.push()

	new Socket()
