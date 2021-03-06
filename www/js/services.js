angular.module('app.services', [])

.factory('Config', function () {
    return {
        serverBaseUrl:'http://foxsolutions.in/fox/'
    }
})

.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.factory('Vehicle', function ($http, $q, Config) {

    return {
        execute: function (userData) {
            var url = Config.serverBaseUrl + "api/foxGetUserVehicle/";
            console.log("in service for vehicle " + userData ) ; 
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data : { userId: userData } 
            }).success(function (data, status, headers, cfg) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (err, status) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },

        get: function () {
            // Simple index lookup
            return;
        }
    }
})

.factory('Registration', function ($http, $q, Config) {
    return {
        post: function (userData) {
                    var _data ={firstname:userData.firstname, lastname:userData.lastname, mobileno:userData.mobileno,
                        password:userData.password, address1:userData.address1, address2:userData.address2, city:userData.city,
                        pin:userData.pincode, cardno:0, memberpin : userData.memberpin, merchantid :0,
                        dob: userData.birthdate, state: userData.state, country: userData.country,emailid:userData.emailid
                    };
                    console.log(_data);
                    var url = Config.serverBaseUrl + "api/addmember/";
                    var deferred = $q.defer();
                    $http({
                        method: 'POST',
                            url: url,
                            data: _data
                    }).success(function (data, status, headers, cfg) {
                        console.log(data);
                        deferred.resolve(data);
                    }).error(function (error, status) {
                        console.log(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
    }
}

})

.factory('Login', function ($http, $q, Config) {

    return {
        execute: function (userData) {
            var url = Config.serverBaseUrl + "api/memberlogin/";
            console.log("in service for login ") ; 
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: userData
            }).success(function (data, status, headers, cfg) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (err, status) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },

        get: function () {
            // Simple index lookup
            return;
        }
    }
})

.factory('Images', function ($http, $q, $rootScope,Config) {

var images = [] ; 


    return {
        execute: function (vehicleData) {
            var url = Config.serverBaseUrl + "api/foxGetImages/";
            console.log("in service for Images  ") ; 
            var deferred = $q.defer();
			console.log ( "vehicle data is " + vehicleData ) ; 
            $http({
                method: 'POST',
                url: url,
                data: vehicleData
            }).success(function (data, status, headers, cfg) {
                //console.log("response from api is " + data);
				//$rootScope.imagedata = data ; 
				images = data  ; 
                deferred.resolve(data);
            }).error(function (err, status) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },

        get: function () {
            // Simple index lookup
            return images ;
        }
    }
})

.factory('Videos', function ($http, $q, $rootScope,Config) {

var videos = [] ; 


    return {
        execute: function (vehicleData) {
            var url = Config.serverBaseUrl + "api/getVideos/";
            console.log("in service for Images  ") ; 
            var deferred = $q.defer();
			console.log ( "vehicle data is " + vehicleData ) ; 
            $http({
                method: 'POST',
                url: url,
                data: vehicleData
            }).success(function (data, status, headers, cfg) {
                //console.log("response from api is " + data);
				//$rootScope.imagedata = data ; 
				videos = data  ; 
                deferred.resolve(data);
            }).error(function (err, status) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },

        get: function () {
            // Simple index lookup
            return videos ;
        }
    }
})




.factory('Locations', function ($http, $q, $rootScope,Config) {

 var locations = [] ; 
 
    return {
        execute: function (vehicleData) {
            var url = Config.serverBaseUrl + "api/GPSMaps/";
            console.log("in service for Locations  ") ; 
            var deferred = $q.defer();
			console.log ( "vehicle data is " + vehicleData ) ; 
            $http({
                method: 'POST',
                url: url,
                data: vehicleData
            }).success(function (data, status, headers, cfg) {
                //console.log("response from api is " + data);
				//$rootScope.imagedata = data ; 
				locations = data ;
				
                deferred.resolve(data);
            }).error(function (err, status) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },

        get: function () {
            // Simple index lookup
			//console.log("returning locations " + locations) ; 
            return locations ;
        }
    }
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
 
  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
        if(ionic.Platform.isWebView()){
 
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
          });
 
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
          });
 
        }
        else {
 
          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);    
 
          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);  
        }       
    }
  }
})


.factory('socket', function ($rootScope) {
    var socket = io.connect('http://foxsolutions.in:4000');
    return {
        on: function (eventName, callback) {
			console.log("connected to socket "); 
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
		removeAllListeners : function() { 
		console.log( " removing all listeners ") ; 
		socket.removeAllListeners(); 
		}
    };
});
;

