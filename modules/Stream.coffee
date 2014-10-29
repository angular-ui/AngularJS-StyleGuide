module = angular.module('App')

module.factory 'Stream', () ->

    class Stream
        constructor: ->
            @listeners = []
        
        listen: (listener) ->
            @listeners.push(listener)
        
            =>
                # TODO: use
                @listeners = @listeners.filter (item) ->
                    item != listener
        
        push: (data) ->
            for listener in @listeners
                listener(data)
        
        destroy: ->
            @listeners = []
