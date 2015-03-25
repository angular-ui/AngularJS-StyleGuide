module = angular.module('App')

module.factory 'Stream', () ->

    class Stream
        constructor: ->
            @listeners = []
            @children = []
        
        listen: (listener) ->
            @listeners.push(listener)
        
            # unsubscriber
            return =>
                @listeners = @listeners.filter (item) ->
                    item != listener
        
        push: (data) ->
            # allow listeners to modify the data (use sparingly)
            changeData = (newValue) ->
                data = newValue
            
            for listener in @listeners
                data = listener(data, changeData) || data
                
            for childStream in @children
                childStream.push(data)
        
        destroy: ->
            @listeners = []
            @children = []
            
        # Events from this stream will then go into the passed stream
        child: (stream) ->
            @children.push(stream)
            
            # unsubscriber
            return =>
                @children = @children.filter (child) ->
                    stream != child
