angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/login',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('cameraFeed', {
    url: '/camera',
    templateUrl: 'templates/cameraFeed.html',
    controller: 'ImageCtrl'
  })
  .state('specific', {
    url: '/specific',
	cache         : false, 
    templateUrl: 'templates/showSpecific.html',
    controller: 'DashCtrl'
  })
  
   .state('live', {
    url: '/live',
	cache         : false, 
    templateUrl: 'templates/showLive.html',
    controller: 'LiveCtrl'
  })
  .state('gPSTracker', {
    url: '/gps',
    templateUrl: 'templates/gPSTracker.html',
    controller: 'GPSCtrl'
  })
  
.state('videoSpecific', {
    url: '/video',
    templateUrl: 'templates/showSpecificVideos.html',
    controller: 'videoCtrl'
  })
  
  .state('videoLive', {
    url: '/videolive',
    templateUrl: 'templates/showLiveVideos.html',
    controller: 'LiveVideoCtrl'
  })
   

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'VehicleCtrl'
  })

  .state('logout', {
    url: '/logout',
    templateUrl: 'templates/logout.html',
    controller: 'LogoutCtrl'
  })


$urlRouterProvider.otherwise('/home')

  

});