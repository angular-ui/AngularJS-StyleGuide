module = angular.module('App')

module.factory 'Streamer', ($q) ->

    class Streamer
        constructor: ->
            @listeners = []
        
        on: (listener) ->
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
