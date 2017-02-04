foxapp = angular.module('app.controllers', ["ion-datetime-picker"])

    .controller('AppCtrl', function ($scope, $state, $rootScope, Config, $ionicLoading, $localstorage) {
        $scope.serverBaseUrl = Config.serverBaseUrl;
        $scope.logout = function () {
            $rootScope.userModel.isLogIn = false;

            $scope.userModel.isLogIn = false;
            $localstorage.setObject('loginData', {});
            $localstorage.setObject('userModel', {});
            $state.go('app.featured');
        };

        $scope.showLoading = function () {
            $scope.loading = $ionicLoading.show({
                content: 'Loading...'
            });
        };
        $scope.showProcessing = function () {
            $scope.loading = $ionicLoading.show({
                content: 'Processing...'
            });
        };
        $scope.hide = function () {
            $scope.loading.hide();
        };

    })


	
	.controller('DashCtrl', function($scope,ionicDatePicker , ionicTimePicker, $rootScope, socket, Images, Locations, $localstorage , $ionicSlideBoxDelegate, $ionicLoading) {
	
	console.log("in dashctrl"); 
	//var imageArr =  [] ; 
	$scope.GPSMessage ="" ; 
	$scope.imageArr = [] ;
    $scope.photos = [] ; 
	$scope.latlongArr = [] ;  
	
	
	
	console.log( "in dash");
	
	$scope.mode = "specific" ; 
	$scope.currentDate = new Date();
	var div = document.getElementById('imageDivSpecific');console.log("got div "  + div ) ; 
	 div.style.visibility = 'visible'; 
	 
	 var div = document.getElementById('dvMapSpecific');console.log("got div "  + div ) ; 
	 div.style.visibility = 'visible'; 
	 
	// $scope.errorMessage = " No error " ; 
	 //$scope.debugMessage = " All's well " ; 
     //$scope.GPSMessage = "GPS data " ; 
	 //$scope.ImageMessage = " Image Data  " ; 
	 
	
	 //latlongArr = [] ; 
	 //$scope.photos = [] ; 
	 $scope.gotImages = false  ; 
    zoomLevel = 10; 
	$scope.img_counter = 0 ; 
	
    $scope.vehicleArr = $localstorage.getObject("vehicleArr") ; 
	console.log( " veh arr is "  + $scope.vehicleArr) ;  
 
	var counter = 1 ; 
	$scope.mode= "specific" ; 

	
					  
    
	
	//console.log("image in photos is " + $scope.photos[0].src); 
	
	$scope.show = function() {
		console.log("in showing loading ") ; 
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
    $scope.hide = function(){
		console.log("in hiding loading ") ; 
        $ionicLoading.hide();
  };
	 $scope.nextSlide = function() {
		 
		console.log( "showing next slide current is " + $ionicSlideBoxDelegate.currentIndex()); 
		
		
      $ionicSlideBoxDelegate.next();
	 }
	 
	 $scope.showNext = function() {
		 console.log("showing next " + $scope.img_counter ) ;
	     if ( $scope.img_counter  < $scope.photos.length )
		 $scope.img_counter ++ ; 
		else 
			console.log( "reached end ") ; 
		 
	 }
	 
	 $scope.showPrev = function() {
		 console.log("showing prev " + $scope.img_counter ) ; 
		 if ( $scope.img_counter > 1 )
		 $scope.img_counter -- ; 
	 else 	
		 console.log("at the beginning");  
		 
	 }
	 
	

 
 	//$scope.sleep(15000) ; 

	
	 $scope.sleep = function (milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
	 
	 
	 
	$scope.getData = function() { 
	console.log("going for data" + $scope.total_images ) ; 
	/*
	var new_image =  { src :'http://im.rediff.com/news/2012/nov/06slde1.jpg' , 
                      desc : 'Test ' } ; 
					  console.log("src is " + new_image.src )
	$scope.photos.push(new_image ) ; 
	*/
	
	//$scope.photos = [] ; 
	var imgArr = [] ; 
	// $scope.show($ionicLoading); 
	//might have to remove this if this does not work for specific 
	
	//latlongArr = []; 
	
	  var div = document.getElementById('imageDivSpecific');console.log("got div "  + div ) ; 
	  //1console.log( "got scope as " + $scope.photos[0].src );
	div.style.visibility = 'visible'; 
	  
	  if (( $scope.vehicleId ==null ) || ( $scope.forDate == null ) || ( $scope.fromTime == null  ) || ( $scope.toTime == null ) ) 
		
		{ 
		console.log("vid"  + $scope.vehicleId+"< for date>"+$scope.forDate+"< fromtime>" + $scope.fromTime+"<"+$scope.toTime+"<") ; 
			$scope.errorMessage = "Vehicle id , date , From time and To time are mandatory " ; 
		console.log( "error here ") ; 
			//$scope.hide($ionicLoading);  
				return  ; 
  
			}
			else $scope.errorMessage = "Fetcing values for this time range " ; 
				  console.log("vid"  + $scope.vehicleId+"< for date>"+$scope.forDate+"< fromtime>" + $scope.fromTime.getHours()+"<"+$scope.toTime.getMinutes()+"<") ; 


 $scope.ImageMessage = "Showing Images for Vehicle"; 
	

 $scope.getImages() ; 
 
 console.log( " scope now really has " + $scope.photos.length ) ; 
 

//$scope.photos = $localstorage.getObject("imageArr") ; 

	/*
	Images.execute( vehicleData).then(function (data) { 
							console.log( "data is " + data );
							if ( data == 0 ) 
							{
									$scope.ImageMessage = "No Image  data available for this duration " ; 
									$localstorage.setObject("imageArr", "") ;
									console.log( "hiding image dive did not get any data ") ; 
									$scope.showHideDiv( 'imageDiv','hide') ; $scope.gotImages = false  ; 
									return ; 
 
							}
							console.log( " file name is " + data[0].event_file_name);
							if ( data[0] == null   ) 
							{
								console.log( "got undefined "); 
								//return ;
							}
							$scope.gotImages = true ; 
							
							$scope.showHideDiv( 'imageDiv','show') ; 
                            console.log("got vehicle" + data.length  ) ; 
							for ( i = 0 ; i < data.length ; i ++ ) {
								new_image =  { "src" :"http://foxsolutions.in/fox/"+ data[i].event_file_name   , 
                      "desc" :'' } ; 
					  
							
							imgArr.push( new_image ) ;
							//console.log("scope photos now has 1 " + $scope.photos.length);	
							 
							}
							$scope.photos = imgArr ; 
								console.log("scope photos now has 2 " + $scope.photos.length);	
								return imgArr ; 
								
							
								}) ; 
	*/
	
	//$scope.debugMessage = "calling showMap" ; 
	$scope.showMap() ; 
	
	} 
	

	$scope.getImages = function() { 
	var month = $scope.forDate.getMonth() + 1 ; 
	var year = $scope.forDate.getYear() + 1900 ; 
	console.log( " month is " + month  + "year is " + year ) ; 
	var dt = $scope.forDate.getDate() + "-" + month  + "-" + year ; 
	console.log("dt is " + dt ) ; 
	$scope.img_counter = 1 ; 
	var imgArr = [] ; 
	
	//$scope.photos = [] ; 
	 $scope.done = 0 ; 
	 
	
	//var vehicleData = { vehicleId : $scope.vehicleId , fromDate : $scope.forDate.getDay() + "-"  + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : $scope.forDate + " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
	var vehicleData = { vehicleId : $scope.vehicleId , fromDate : dt + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : dt+ " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
    console.log( " vehicle data is " + vehicleData.vehicleId ) ; 	
	    console.log( " vehicle data is " + vehicleData.fromDate ) ; 	
    console.log( " vehicle data is " + vehicleData.toDate ) ; 	
	$scope.total_images = 56 ; 
	Images.execute( vehicleData).then(function (data) { 
	var new_image ;  
	
	
	
	 for ( i = 0 ; i < data.length ; i ++ ) {
								new_image =  { "src" :"http://foxsolutions.in/fox/"+ data[i].event_file_name   , 
                      "desc" :'' } ; 
					  
	imgArr.push(new_image);
	console.log("new imagae is "+ new_image.src ) ; 
	 }
	 
	});
	
    $scope.photos = imgArr; 
	
	//console.log( "from service got " +  imgArr.length + "first fike " + imgArr[0].src  ); 
	 
	
	//$rootScope.total_images = 55 ; 
	  
	//$scope.errorMessage = "showing Images NOW  " + $scope.photos.length   ;
	  
	
 ; 
	
	
	 
	}
	

	

	
	$scope.showHideDiv = function( divName , action){
		
	var div = document.getElementById(divName);console.log("got div "  + div ) ; 
	if ( action == 'show' )
	 div.style.visibility = 'visible'; 
	 else 
		  div.style.visibility = 'hidden'; 
		
		}

    $scope.getImages2 = function() { 
   
    $scope.ImageMessage = "Showing Images for Vehicle"; 
	

	var month = $scope.forDate.getMonth() + 1 ; 
	var year = $scope.forDate.getYear() + 1900 ; 
	console.log( " month is " + month  + "year is " + year ) ; 
	var dt = $scope.forDate.getDate() + "-" + month  + "-" + year ; 
	console.log("dt is " + dt ) ; 
	//$scope.photos = [] ; 
	var imgArr = [] ; 
	
	//var vehicleData = { vehicleId : $scope.vehicleId , fromDate : $scope.forDate.getDay() + "-"  + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : $scope.forDate + " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
	var vehicleData = { vehicleId : $scope.vehicleId , fromDate : dt + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : dt+ " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
    console.log( " vehicle data is " + vehicleData.vehicleId ) ; 	
	    console.log( " vehicle data is " + vehicleData.fromDate ) ; 	
    console.log( " vehicle data is " + vehicleData.toDate ) ; 	
var new_image ; 
	
	Images.execute( vehicleData).then(function (data) { 
							console.log( "data is " + data );
							if ( data == 0 ) 
							{
									$scope.ImageMessage = "No Image  data available for this duration " ; 
									$localstorage.setObject("imageArr", "") ;
									console.log( "hiding image dive did not get any data ") ; 
									$scope.showHideDiv( 'imageDiv','hide') ; $scope.gotImages = false  ; 
									return ; 

							}
							console.log( " file name is " + data[0].event_file_name);
							if ( data[0] == null   ) 
							{
								console.log( "got undefined "); 
								//return ;
							}
							$scope.gotImages = true ; 
							
							$scope.showHideDiv( 'imageDiv','show') ; 
                            console.log("got vehicle" + data.length  ) ; 
							for ( i = 0 ; i < data.length ; i ++ ) {
								new_image =  { "src" :"http://foxsolutions.in/fox/"+ data[i].event_file_name   , 
                      "desc" :'' } ; 
					  
								//$rootScope.userModel.imageArr.push(new_image) ; 
								//console.log("array legth is now  " + $rootScope.imageArr.length) ;
								//$scope.photos.push(new_image); 
								
								
								//imageArr.push( "src:'http://foxsolutions.in/fox/"+ data[i].event_file_name +"' , desc:'TEST' " ) ;
							//$scope.imageArr.push( new_image ) ;
							$scope.photos.push( new_image ) ;
							imgArr.push(new_image); 
							console.log("imageArr length now "+imgArr.length) ; 
							}
							//$localstorage.setObject("imageArr", imageArr) ; 
							//$rootScope.photos = imageArr; 
							console.log( "focusing on div");
							
							var div1 = document.getElementById("prevButton") ; 
							console.log("got element" + div1 ) ; 
							//div1.focus(); 
							
							 
							console.log("got photos now  " + imgArr.length) ;
						
							
								}) ; 
	var imagediv = document.getElementById('imageDiv');console.log("got div "  + div ) ; 
	  
	imagediv.style.visibility = 'visible'; 
    //console.log('enabling slider for photos' + $rootScope.userModel.imageArr) ;
    $ionicSlideBoxDelegate.enableSlide(); 
	
	 
	 
    setTimeout(function() {  
     
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
                $scope.$apply() ; 
     });
	 console.log("return arr of length" + imgArr.length); 
	 
	 	return imgArr ; 
}
   
   $scope.showImages = function() { 

	$scope.debugMessage = " for specific mode in getImages " ; 
    var localArr =  $scope.getImages(); 
	console.log( "local arr is " + localArr.length) ; 
    //console.log( "image arr is " + $scope.photos.length)  ; 

     //$scope.drawMap(); 
	} 

    $scope.showMap = function() {
	
	$scope.GPSMessage = "Showing GPS information for Vehicle" ; 
     $scope.getLocations(); 
    //console.log( "lat long arr is " + latlongArr)  ; 

     //$scope.drawMap(); 
	} 

$scope.getLocations  = function() { 

	
	var month = $scope.forDate.getMonth() + 1 ; 
	var year = $scope.forDate.getYear() + 1900 ; 
	console.log( " month is " + month  + "year is " + year ) ; 
	var dt = $scope.forDate.getDate() + "-" + month  + "-" + year ; 
	
	
	var vehicleData = { vehicleid : $scope.vehicleId.toUpperCase() , from_dt : dt + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , to_dt : dt+ " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes() , status : 'specific' } ;
	console.log("vehicle data is  now  " + vehicleData.vehicleid + "," + vehicleData.from_dt + "," + vehicleData.to_dt + "," + vehicleData.status	) ; 
	
	
	Locations.execute(vehicleData).then( function(data) { 
	$scope.latlongArr = Locations.get() ; 
	
	console.log( "****latlong has " + $scope.latlongArr.length );
	 $scope.drawMap(); 
	})
	; 
	
	
	/*
	Locations.execute( vehicleData).then(function (data) { 
	latlongArr = [] ; 
	
							if ( data == 0 ) 
							{
									$scope.GPSMessage = "No GPS data available for this duration " ; 
									console.log( 'did not get any data for vehicle ' + data.length  ); 
									$localstorage.setObject("latlongArr", "") ;
									$scope.showHideDiv( 'dvMap','hide') ; 									
									return ; 
							}
							
							$scope.showHideDiv( 'dvMap','show') ; 		
                            console.log("got vehicle" + data  ) ; 
							for ( i = 0 ; i < data.length ; i ++ ) {
								new_location =  { "latitude" :data[i].latitude   , 
                      "longitude" : data[i].longitude } ; 
					  
								//$rootScope.userModel.imageArr.push(new_image) ; 
								//console.log("array legth is now  " + $rootScope.imageArr.length) ;
								//$scope.photos.push(new_image); 
								
								
								//imageArr.push( "src:'http://foxsolutions.in/fox/"+ data[i].event_file_name +"' , desc:'TEST' " ) ;
							latlongArr.push( new_location ) ;
								//console.log("new loca is " + new_location) ; 
							}
							$localstorage.setObject("latlongArr", latlongArr) ; 
							//$rootScope.photos = imageArr; 
							 	}) 
								
		*/				
								
	}

	 $scope.drawMap = function() { 
	 
        //latlongArr = $localstorage.getObject("latlongArr") ; 
		$scope.GPSMessage = "showing GPS for " + $scope.latlongArr.length +"co-ordinates"  ; 
		var div = document.getElementById('dvMapSpecific');console.log("got div "  + div ) ; 
	 div.style.visibility = 'visible'; 
		console.log( " in drawmap "+ $scope.latlongArr.length) ; 

        if ( $scope.latlongArr.length > 0 ) { 		
		console.log( " herei n drawmap ") ; 
        //$scope.getLocations() ; 
        var mapOptions = {
            center: new google.maps.LatLng($scope.latlongArr[0].latitude, $scope.latlongArr[0].longitude),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("dvMapSpecific"), mapOptions);
        var infoWindow = new google.maps.InfoWindow();
        var lat_lng = new Array();
        var latlngbounds = new google.maps.LatLngBounds();
        for (i = 0; i < $scope.latlongArr.length; i++) {
            var data = $scope.latlongArr[i]
            var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
            lat_lng.push(myLatlng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
            latlngbounds.extend(marker.position);
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.description);
                    infoWindow.open(map, marker);
                });
            })(marker, data);
        }
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);
 
        //***********ROUTING****************//
 
        //Initialize the Path Array
        var path = new google.maps.MVCArray();
 
        //Initialize the Direction Service
        var service = new google.maps.DirectionsService();
 
        //Set the Path Stroke Color
        var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });
        console.log( 'zoom level is ' + map.getZoom()) ; 
 
        //Loop and Draw Path Route between the Points on MAP
        for (var i = 0; i < lat_lng.length; i++) {
            if ((i + 1) < lat_lng.length) {
                var src = lat_lng[i];
                var des = lat_lng[i + 1];
                path.push(src);
                poly.setPath(path);
                service.route({
                    origin: src,
                    destination: des,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                    }
                });
            }
        }
    }
}
	 
	
$scope.datePickerCallback = function (val) {
	console.log("in callback "); 
	
  if(typeof(val)==='undefined'){		
      console.log('Date not selected');
  }else{
      console.log('Selected date is : ', val);
	  
	  
  }
};


$scope.showSelectValue = function(vehicle)  {
	
	$scope.vehicleId = vehicle ; 
	console.log( "vehicle id is " + vehicle + "in scope " + $scope.vehicleId ) ; 
	$scope.latlongArr = [] ; 
	$scope.photos = [];
	
	
	
}

 $scope.setMode = function ( mode ) { 
 $scope.mode = mode ; 
 console.log ( " mode is " + $scope.mode + "vehicle is" + $scope.vehicleId  ) ; 
 
 //remove specific div 
 /*
 var timerange = document.getElementById('timerange');
    timerange.parentNode.removeChild(timerange);
   // return false;
*/
	
 
 //end remove
 var div = document.getElementById('timerange');

 if ( $scope.mode == "live" ) { 
 
// hide
div.style.visibility = 'hidden';

if ($scope.vehicleId == null ) 
{
	console.log ( "select vehicle first ") ; 
	alert("select Vehicle first "); 
$scope.errorMessage = "Vehicle id is mandatory " ; 
return ; 
}
 
 $scope.photos = [] ; 
 
 var mapOptions = {
            center: new google.maps.LatLng("", ""),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
		
  var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
  //map.clearOverlays() ; 
  
 //$scope.drawMap(); 
 $scope.GPSMessage =  "Waiting for LiveFeed for GPS co-ordinates.... " ; 
 $scope.ImageMessage = "Waiting for Live Images....  " ; 
 $scope.showImages() ; 
 $scope.showMap(); 
 
 
 } 
 else 
 {
	 div.style.visibility = 'visible';
	 
 }
 /*
 console.log("showing images ") ; 
 
 $scope.showImages(); 
 console.log("showing map ") ; 
 $scope.showMap(); 
 */
 
 }
	
	$scope.showDate  = function()  { 
	console.log("in showdate"); 
	
	 var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' +  new Date(val));
		val = new Date(val) + ""; 
		var dateArr= val.split(" ") ; 
	  $scope.forDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[3] ; 
	  
      }, dateFormat : 'dd-mm-yyyy' 
     } 
    
      ionicDatePicker.openDatePicker(ipObj1);
    
	
	
	}
	
	;
	
	$scope.showFromTime = function() { 
	console.log("in from time "); 
	var ipFromTime  = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
		console.log ( " time is " + selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes() );
	  $scope.fromTime = selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes(); 
		
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Select'    //Optional
  };

  ionicTimePicker.openTimePicker(ipFromTime);
};

	

	
	$scope.showToTime = function() {
		console.log("in to time "); 
		var ipToTime  = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
		console.log ( " time is " + selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes() );
	  $scope.toTime = selectedTime.getUTCHours()+ ':' + selectedTime.getUTCMinutes(); 
		
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Select'    //Optional
  };

  ionicTimePicker.openTimePicker(ipToTime);
};


	
})

.controller('LiveCtrl', function( $scope, $rootScope, socket, Images, Locations, $localstorage , $ionicSlideBoxDelegate, $ionicLoading) {
	
	console.log("in Livectrl"); 
	var imageArr =  [] ; 
	
	$scope.mode = "live" ; 
	$scope.currentDate = new Date();
	var div = document.getElementById('imageDivLive');console.log("got div "  + div ) ; 
	 div.style.visibility = 'visible'; 
	 
	 var div = document.getElementById('dvMapLive');console.log("got div "  + div ) ; 
	 div.style.visibility = 'visible'; 
	 
	// $scope.errorMessage = " No error " ; 
	 //$scope.debugMessage = " All's well " ; 
     //$scope.GPSMessage = "GPS data " ; 
	 //$scope.ImageMessage = " Image Data  " ; 
	 
	
	 $scope.latlongArr = [] ; 
	 //$scope.photos = [] ; 
	 $scope.gotImages = false  ; 
    zoomLevel = 10; 
	$scope.img_counter = 0 ; 
	
    $scope.vehicleArr = $localstorage.getObject("vehicleArr") ; 
	console.log( " veh arr is "  + $scope.vehicleArr) ;  
 
	var counter = 1 ; 
	$scope.mode= "specific" ; 
	var new_image =  { src :'http://im.rediff.com/news/2012/nov/06slde1.jpg' , 
                      desc : 'Test ' } ; 
					  console.log("src is " + new_image.src )
	//$scope.photos = imageArr ; 
	//$scope.photos = $rootScope.photos; 
	
					  
     //$scope.photos.push(new_image) ; 
	//$scope.photos.push(new_image) ; 
	
	//console.log("image in photos is " + $scope.photos[0].src); 
	
	$scope.show = function() {
		console.log("in showing loading ") ; 
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
    $scope.hide = function(){
		console.log("in hiding loading ") ; 
        $ionicLoading.hide();
  };
	 

	
	$scope.showHideDiv = function( divName , action){
		
	var div = document.getElementById(divName);console.log("got div "  + div ) ; 
	if ( action == 'show' )
	 div.style.visibility = 'visible'; 
	 else 
		  div.style.visibility = 'hidden'; 
		
		}

    $scope.getImages = function() { 
   
    $scope.ImageMessage = "Showing Images for Vehicle"; 
	

	var month = $scope.forDate.getMonth() + 1 ; 
	var year = $scope.forDate.getYear() + 1900 ; 
	console.log( " month is " + month  + "year is " + year ) ; 
	var dt = $scope.forDate.getDate() + "-" + month  + "-" + year ; 
	console.log("dt is " + dt ) ; 
	//$scope.photos = [] ; 
	var imageArr = [] ; 
	
	//var vehicleData = { vehicleId : $scope.vehicleId , fromDate : $scope.forDate.getDay() + "-"  + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : $scope.forDate + " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
	var vehicleData = { vehicleId : $scope.vehicleId , fromDate : dt + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , toDate : dt+ " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes()  } ;
    console.log( " vehicle data is " + vehicleData.vehicleId ) ; 	
	    console.log( " vehicle data is " + vehicleData.fromDate ) ; 	
    console.log( " vehicle data is " + vehicleData.toDate ) ; 	
var new_image ; 
	
	Images.execute( vehicleData).then(function (data) { 
							console.log( "data is " + data );
							if ( data == 0 ) 
							{
									$scope.ImageMessage = "No Image  data available for this duration " ; 
									$localstorage.setObject("imageArr", "") ;
									console.log( "hiding image dive did not get any data ") ; 
									$scope.showHideDiv( 'imageDiv','hide') ; $scope.gotImages = false  ; 
									return ; 

							}
							console.log( " file name is " + data[0].event_file_name);
							if ( data[0] == null   ) 
							{
								console.log( "got undefined "); 
								//return ;
							}
							$scope.gotImages = true ; 
							
							$scope.showHideDiv( 'imageDiv','show') ; 
                            console.log("got vehicle" + data.length  ) ; 
							for ( i = 0 ; i < data.length ; i ++ ) {
								new_image =  { "src" :"http://foxsolutions.in/fox/"+ data[i].event_file_name   , 
                      "desc" :'' } ; 
					  
								//$rootScope.userModel.imageArr.push(new_image) ; 
								//console.log("array legth is now  " + $rootScope.imageArr.length) ;
								//$scope.photos.push(new_image); 
								
								
								//imageArr.push( "src:'http://foxsolutions.in/fox/"+ data[i].event_file_name +"' , desc:'TEST' " ) ;
							imageArr.push( new_image ) ;
							console.log(new_image) ; 
							}
							$localstorage.setObject("imageArr", imageArr) ; 
							$rootScope.photos = imageArr; 
							console.log( "focusing on div");
							
							var div1 = document.getElementById("prevButton") ; 
							console.log("got element" + div1 ) ; 
							//div1.focus(); 
							
							 
							//console.log("got photos " + $rootScope.imageArr.length) ;
								}) ; 
	var imagediv = document.getElementById('imageDivLive');console.log("got div "  + div ) ; 
	  
	imagediv.style.visibility = 'visible'; 
    //console.log('enabling slider for photos' + $rootScope.userModel.imageArr) ;
    $ionicSlideBoxDelegate.enableSlide(); 
	
	 
    setTimeout(function() {  
     
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
                $scope.$apply() ; 
     });
}
   
   $scope.showImages = function() { 

    
    

    socket.on( "image", function(data) { 
	
	console.log( " vehicle got it "  + data[0].vehicle_id ) ; 
	if ( (data[0].vehicle_id).toUpperCase() == ($scope.vehicleId).toUpperCase() ) { 
    console.log("here in images " + data.length ) ; 

    console.log ( "got notification" + data[0].event_file_name +"xx") ; 
    
         new_image.src = "http://foxsolutions.in/fox/"+data[0].event_file_name  ; 
         //new_image.desc = "Image " + counter ; 


        //console.log( "lat long length is now before " + $scope.photos.length) ;
		$scope.ImageMessage = "Showing " + new_image.src ; 
		
      $scope.photos = new_image.src;
      console.log( "image is  now " + $scope.photos  ) ; 
	}
		else 
			console.log( "not the vehicle I want.got for  >" + data[0].vehicle_id  + "<") ; 
		
      //$scope.drawMap() ; 
     
  });
}
 

    $scope.showMap = function() {
	

socket.on( "gps", function(data) {
    console.log("here" + data[0].vehicle_id ) ; 
 //var latlongArr = [] ;
    console.log ( "got notification" + data[0].latitude +"xx" +  data[0].longitude) ; 
    if ( (data[0].vehicle_id).toUpperCase() == ($scope.vehicleId).toUpperCase() ) {  
         var location = data[0] ; 
         $scope.GPSMessage = " Showing GPS -" + data[data.length-1].latitude + "-"+ data[data.length-1].longitude ; 
		 
		//latlongArr = $localstorage.getObject("latlongArr") ; 
		/*
		if ( latlongArr.length == 0 ) { 
		 console.log( "lat long length is now before " + latlongArr.length) ; 
		 latlongArr = [] ; 
		 }
		 */
		 
      $scope.latlongArr.push(location );
      console.log( "lat long length is now " + $scope.latlongArr.length) ; 
        //$localstorage.setObject("latlongArr",latlongArr) ; 
		
      $scope.drawMap() ; 
	} 
	else console.log( " not the vehicle I want " + data[0].vehicle_id) ; 
	
  });
}



$scope.getLocations  = function() { 

/*
     latlongArr = [
            {
                
                "latitude": '18.641400',
                "longitude": '72.872200',
                
            }
        ,
            {
                "latitude": '18.964700',
                "longitude": '72.825800',
                
            }
        ,
            {
                
                "latitude": '18.523600',
                "longitude": '73.847800',
                
            }
    ];
    console.log( " waiting for lat long ");
	*/
	
	
	var month = $scope.forDate.getMonth() + 1 ; 
	var year = $scope.forDate.getYear() + 1900 ; 
	console.log( " month is " + month  + "year is " + year ) ; 
	var dt = $scope.forDate.getDate() + "-" + month  + "-" + year ; 
	
	
	var vehicleData = { vehicleid : $scope.vehicleId.toUpperCase() , from_dt : dt + " " + $scope.fromTime.getHours()+ ":"+ $scope.fromTime.getMinutes() , to_dt : dt+ " " + $scope.toTime.getHours()+ ":"+ $scope.toTime.getMinutes() , status : 'specific' } ;
	console.log("vehicle data is  now  " + vehicleData.vehicleid + "," + vehicleData.from_dt + "," + vehicleData.to_dt + "," + vehicleData.status	) ; 
	
	Locations.execute( vehicleData).then(function (data) { 
	latlongArr = [] ; 
	
							if ( data == 0 ) 
							{
									$scope.GPSMessage = "No GPS data available for this duration " ; 
									console.log( 'did not get any data for vehicle ' + data.length  ); 
									$localstorage.setObject("latlongArr", "") ;
									$scope.showHideDiv( 'dvMapSpecific','hide') ; 									
									return ; 
							}
							
							$scope.showHideDiv( 'dvMapLive','show') ; 		
                            console.log("got vehicle" + data  ) ; 
							for ( i = 0 ; i < data.length ; i ++ ) {
								new_location =  { "latitude" :data[i].latitude   , 
                      "longitude" : data[i].longitude } ; 
					  
								//$rootScope.userModel.imageArr.push(new_image) ; 
								//console.log("array legth is now  " + $rootScope.imageArr.length) ;
								//$scope.photos.push(new_image); 
								
								
								//imageArr.push( "src:'http://foxsolutions.in/fox/"+ data[i].event_file_name +"' , desc:'TEST' " ) ;
							latlongArr.push( new_location ) ;
								console.log("new loca is " + new_location) ; 
							}
							$localstorage.setObject("latlongArr", latlongArr) ; 
							//$rootScope.photos = imageArr; 
							 	}) 
								
							
								
	}

	 $scope.drawMap = function() { 
	 
        //latlongArr = $localstorage.getObject("latlongArr") ; 
		
		console.log( " in drawmap "+ $scope.latlongArr.length) ; 

        if ( $scope.latlongArr.length >= 0 ) { 		
        //$scope.getLocations() ; 
        var mapOptions = {
            center: new google.maps.LatLng($scope.latlongArr[0].latitude, $scope.latlongArr[0].longitude),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("dvMapLive"), mapOptions);
        var infoWindow = new google.maps.InfoWindow();
        var lat_lng = new Array();
        var latlngbounds = new google.maps.LatLngBounds();
        for (i = 0; i < $scope.latlongArr.length; i++) {
            var data = $scope.latlongArr[i]
            var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
            lat_lng.push(myLatlng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
            latlngbounds.extend(marker.position);
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.description);
                    infoWindow.open(map, marker);
                });
            })(marker, data);
        }
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);
 
        //***********ROUTING****************//
 
        //Initialize the Path Array
        var path = new google.maps.MVCArray();
 
        //Initialize the Direction Service
        var service = new google.maps.DirectionsService();
 
        //Set the Path Stroke Color
        var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });
        console.log( 'zoom level is ' + map.getZoom()) ; 
 
        //Loop and Draw Path Route between the Points on MAP
        for (var i = 0; i < lat_lng.length; i++) {
            if ((i + 1) < lat_lng.length) {
                var src = lat_lng[i];
                var des = lat_lng[i + 1];
                path.push(src);
                poly.setPath(path);
                service.route({
                    origin: src,
                    destination: des,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                    }
                });
            }
        }
    }
}
	 
	

$scope.showSelectValue = function(vehicle)  {
	
	$scope.vehicleId = vehicle ; 
	console.log( "vehicle id is " + vehicle + "in scope " + $scope.vehicleId ) ; 
	$scope.showImages() ; 
	$scope.showMap() ; 
	
	
	
}

 $scope.setMode = function ( mode ) { 
 $scope.mode = mode ; 
 console.log ( " mode is " + $scope.mode + "vehicle is" + $scope.vehicleId  ) ; 
 

 
 //end remove
 var div = document.getElementById('timerange');

 if ( $scope.mode == "live" ) { 
 
// hide
div.style.visibility = 'hidden';

if ($scope.vehicleId == null ) 
{
	console.log ( "select vehicle first ") ; 
	alert("select Vehicle first "); 
$scope.errorMessage = "Vehicle id is mandatory " ; 
return ; 
}
 
 $scope.photos = [] ; 
 
 var mapOptions = {
            center: new google.maps.LatLng("", ""),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
		
  var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
  //map.clearOverlays() ; 
  
 //$scope.drawMap(); 
 $scope.GPSMessage =  "Waiting for LiveFeed for GPS co-ordinates.... " ; 
 $scope.ImageMessage = "Waiting for Live Images....  " ; 
 $scope.showImages() ; 
 $scope.showMap(); 
 
 
 } 
 else 
 {
	 div.style.visibility = 'visible';
	 
 }



 }
	
})
	
	
     
    .controller('LoginCtrl', function ($scope, $state, $location, Login, Vehicle , $rootScope, $localstorage,$ionicLoading) {
        console.log( "in controller ") ; 

		$scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };

		
        $scope.username = "";
        $scope.loginAlerts = [];
        $rootScope.userModel.isLogIn = false ;
        $scope.userModel.isLogIn = false ;
		
		
        var formdata = new FormData();
        formdata.append("username", "ritesh@gmail.com");
        formdata.append("password", "iloyal@123");
        //$scope.loginData = {
        //    username: "ritesh@gmail.com",
        //    password: "iloyal@123"
        //}
        $scope.loginData = {
            username: "",
            password: ""
        }
      
 
        $scope.doLogin = function (loginData) {
           
           console.log( "in login of controller "+loginData);
           console.log( "is login is " + $rootScope.userModel.isLogIn ) ; 
           console.log(loginData) ; 
		    //$scope.show($ionicLoading);

            $scope.loginAlerts = [];
            if (validate(loginData) == false) return;

            //$scope.$parent.showProcessing();
            Login.execute(loginData).then(function (data) {
                console.log(data);
                //data = data[0];
                if (data  >  0) {
                    console.log( "here in success ") ; 
                    $rootScope.userModel.isLogIn = true;
                    $rootScope.userModel.userid = data;
                    
                    $scope.userModel.isLogIn = true ;

                    $localstorage.setObject('loginData', loginData);
                    $localstorage.setObject('userModel', $rootScope.userModel);
                  
					
                    Vehicle.execute( data).then(function (vehicledata) { 
                            console.log("got vehicle" + vehicledata ) ; 
                  vehicleArr = [] ; 

                    $rootScope.userModel.vehicle = vehicledata; 
                      console.log(" vehicle id is " + vehicledata ) ;  
					  for ( i = 0 ; i < vehicledata.length; i ++ ) {
						  console.log ( "got veh" + vehicledata[i].vehicle_id) ; 
						  vehicleArr.push(vehicledata[i].vehicle_id ) ; 
						  
					  }
					  $localstorage.setObject('vehicleArr', vehicleArr);
                    }); 
                    //window.location.href="#/app/camera";
					//$scope.hide($ionicLoading);  
					//ionicLoading.hide() ; 
                    $location.path('/home');
                    
                    // $route.routes[null];
                   //$
					 
                    $scope.$parent.hide();
                }
                else {
                    var _alert = { type: "danger", message: "The id  or password you entered is incorrect. " }
					//$ionicLoading.hide();
                    $scope.loginAlerts.push(_alert);
                    $scope.$parent.hide();
                }

            }, function (error, status) {
                console.log(error);
				//$ionicLoading.hide();
                $rootScope.userModel.isLogIn = false;
                $scope.userModel.isLogIn = false ;
                $scope.$parent.hide();
            });
        }



        function getVehicle(userid){
        console.log( "vehicle for " + userid ) ; 
        var url= 'http://foxsolutions.in/fox/api/foxGetUserVehicle/';
        $.ajax({
         type: "POST",
         url: url,
         data: {
                    userId: varUserId
               }, 
         crossDomain: true,
         cache: false,
         beforeSend: function(){},
         success: function(vehicle)
         {
            console.log('got it '); 
        if(vehicle)
        {
                console.log( 'got vehicle ' + vehicle ); 
                //localStorage.setItem("vehicleId", vehicle);
        }
        }

        
        
        });
        console.log( "vehicle is " + vehicle ) ; 
        return vehicle; 

        }
        function validate(loginData) {
            if (loginData.username == null || loginData.username == "") {
                var _alert = { type: "danger", message: "Enter user name. " }
                $scope.loginAlerts.push(_alert);
                return false;
            }
            else if (loginData.password == null || loginData.password == "") {
                var _alert = { type: "danger", message: "Enter password. " }
                $scope.loginAlerts.push(_alert);
                return false;
            }
        }

        $scope.showRegister = function()
        {
            $state.go('app.register');
        }
    })

    .controller('RegisterCtrl', function ($scope, $stateParams, $ionicLoading, Registration, $ionicPopup, $state, $ionicModal, $timeout) {
        $scope.user = {
            firstname: "", lastname: "", mobileno: "", emailid: "", birthdate: "", password: "", repassword: "", memberpin: "", rememberpin: "",
            address1: "", address2: "", city: "", pincode: "", state: "", country: ""
        };

        $scope.doRegister = function(user)
        {
            $scope.showProcessing();
            Registration.post(user).then(function (data) {
                console.log(data);
                if (data.id != "0")
                {
                    $scope.loading = $ionicLoading.show({
                        content: 'Thank you for Registering at iLoyalty.'
                    });
                    $timeout(function () {
                        $scope.loading.hide();
                        $state.go('app.login');
                    }, 2000);
                }
                $scope.$parent.hide();
            }, function (error, status) {
                $scope.$parent.hide();
            })
        }
    })

    .controller('ProfileCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })
 .controller('CameraCtrl', function ($scope, $rootScope, $localstorage) {
    console.log("in camera controller") ; 
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('GPSCtrl', function ($scope, $rootScope,socket, $localstorage) {
console.log( 'in GPS traceker controller ') ;         
})


.controller('VehicleCtrl', function ($scope, $rootScope, $localstorage) {
        $scope.profile = angular.copy($rootScope.userModel);
        var userModel = $localstorage.getObject('userModel');
        if ($rootScope.isEmptyObject(userModel) == false) {
            $scope.profile = userModel;
        }
    })

.controller('LogoutCtrl',  function ($scope, $location,$rootScope,$localstorage,$state) {
      console.log ( "in logout controller") ; 
       
        $scope.foxLogout = function( ) {
        console.log('logging out now ') ; 
            
            $rootScope.userModel.isLogIn = false ; 
            $scope.userModel.isLogIn = false ; 
			
			//$location.path('/login') ; 
            //$state.go("app.login") ; 
			$localstorage.setObject('userModel', $rootScope.userModel);
            $state.go('tabsController.login'); 
        }

          })

    .controller('ImageCtrl', function ($scope, $rootScope, socket, Images,$ionicSlideBoxDelegate) {
    console.log("in inmg controller" + $rootScope.userModel.isLogIn ) ; 
/*  
  imgArr = [] ; 
 var counter = 1 ; 
 $scope.mode= "specific" ; 
 var new_image =  { src :'' , 
                      desc : '' } ; 
                      $scope.photos =[] ; 

	*/
	
});

    
    

  ;

