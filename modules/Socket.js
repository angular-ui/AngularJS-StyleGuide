var module = angular.module('App');

module.factory('Socket', (Stream, $rootScope) => {
  class Socket {
    constructor(url) {
      this.url = url;
      this.queue = [];
      this.open();
    }

    setupQueryStream() {
      // opening a socket === async and a queue may form
      this.socket.onopen = () => this.flush();

      if (!this.queryStream) {
        this.queryStream = new Stream();

        this.queryStream.listen( (data) => {
          // Stringify now in case data changes while waiting in this.queue
          data = JSON.stringify(data);

          if (this.socket.readyState === WebSocket.OPEN) {
            this.send(data);
          } else {
            this.queue.push(data);
            if (this.socket.readyState === WebSocket.CLOSE)
              this.open();
          }
        });

      }
    }

    setupEventStream() {
      this.eventStream = this.eventStream || new Stream();

      this.socket.onmesssage = (data) => {
        // Now Entering AngularJS...
        $rootScope.$apply( () => this.eventStream.push( JSON.parse(data) ));
      };
    }

    close() {
      this.socket.close();
    }

    open() {
      this.socket = new WebSocket(this.url);
      this.setupQueryStream();
      this.setupEventStream();
    }

    send(data) {
      return this.socket.send( data );
    }

    flush() {
      while (item = this.queue.pop()) {
        this.send(item);
      }
    }
  }

  // Singleton
  return new Socket('/api');
});
