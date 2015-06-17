angular.module('app').factory('Paginator', function($http){

  var Paginator = function(url, options){
    this.url = url;
    this.options = {
      limit: 50,
      offset: 0
    };
    //add everything to the this.params object
    for (var name in options){
      this.options[name] = options[name];
    }
    this.items = [];
    this.hasMore = true;
    this.loading = false;
    //make first call for items at initialization
    this.next();
  };

  Paginator.prototype.next = function(){
    var self = this;

    this.loading = true;

    if (this.hasMore) {
      return $http.get(this.url, { params: this.options }).then(function(response) {
        //If the results are less than the required limit then the results are finished
        if(response.data.results.length < self.options.limit){
          self.hasMore = false
        }
        self.items = self.items.concat(response.data.results);
        self.options.offset = self.items.length;
        self.loading = false;
        return self.items;
      });
    }
  }

  return Paginator;
});
