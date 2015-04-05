module = angular.module('App')

module.factory 'BaseObject', ($q, Stream) ->
    
    class BaseObject
        constructor: (parentQueryStream, parentEventStream, initData = {}) ->

            for value, property in initData
                @[property] = value

            @queryStream = new Stream()
            @eventStream = new Stream()

            # for cleaning up later
            @listeners = []

            if parentQueryStream
                # Queries go up
                @listeners.push @queryStream.child( parentQueryStream )
            if parentEventStream
                # Events come down
                @listeners.push parentEventStream.child( @eventStream )


        ###
        Switch to high-memory mode

        Usually means it's being rendered on screen and should get extra details and keep them updated
        ###
        open: ->

        ###
        Switch to low-memory mode

        Unsubscribe unnecessary overhead
        ###
        close: ->

        # Convenience wrapper
        save: ->
            if @id
                @update()
            else
                @create()

        create: ->

        edit: ->

        delete: ->

        query: (data) ->
            @queryStream.push(data)

        ###
        Make a copy of object for use in forms

        When you edit a record in a form, you want the original to be preserved while the user makes changes
        This allows you to edit a record exactly as if you were creating one without having to worry about
        rolling back changes to the object.
        ###
        clone: ->
            constructor = Object.getPrototypeOf(@).constructor
            # TODO: add support for queries by passing parent(?)
            new constructor(null, null, @)

        ###
        Cleans up listeners (should run when discarding object)
        ###
        destroy: ->
            while listener = @listeners.pop()
                listener()
        
        # Convenience wrapper so we don't have to inject $q everywhere    
        resolve: $q.when
        
        # Convenience wrapper so we don't have to inject $q everywhere
        reject: $q.reject


            
module.factory 'AppObject', (BaseObject, Socket) ->
    class AppObject extends BaseObject
                    
        close: ->
            super()
            # Stop maintaining children collections
            @projects = null
                            
            
    # Singleton, this is where the socket streams are wired into the ORM
    new AppObject(Socket.queryStream, Socket.eventStream)
