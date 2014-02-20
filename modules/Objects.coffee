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
        
        # Convenience wrapper so we don't have to inject $q everywhere    
        resolve: $q.when
        
        # Convenience wrapper so we don't have to inject $q everywhere
        reject: $q.reject
            
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
            
            # keep @projects collection up-to-date
            @downStream.onValue (data) =>
                switch data.event
                    when 'projectCreated'
                        @projects?[data.id] = new ProjectObject(@upStream, @downStream, data)
                    when 'projectDeleted'
                        delete @projects?[data.id]
                        
        getProjects: ->
            # if a collection of projects is already available, we don't need to query
            if @projects
                return @resolve(@projects)
            
            @query( { method: 'findAllProjects' } ).then (projects) => # => preserves the outter `this` reference
                # child projects are stored as a collection property
                @projects = {}
                
                # each project is spun up as a ProjectObject instance
                for project, id of projects
                    @projects[id] = new ProjectObject(@upStream, @downStream, project)
                    
                # return the collection
                @projects
                
        getProject: (id) ->
            if @projects
                @resolve(@projects[id])
            else
                @getProjects().then => # => preserves the `this` reference
                    @projects[id] or @reject()
                    
        close: ->
            super()
            # Stop maintaining children collections
            @projects = null
                            
            
    # Singleton, this is where the socket streams are wired into the ORM
    new AppObject(Socket.queryStream, Socket.eventStream)
