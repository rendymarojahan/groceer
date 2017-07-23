angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, myCache, CurrentUserService, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $ionicModal) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.shopname = CurrentUserService.shopname;
  $scope.photo = CurrentUserService.picture;
  $scope.isPhoto = false;
  if ($scope.photo !== undefined) {
    $scope.isPhoto = true;
  }
  $scope.username = CurrentUserService.username;
  $scope.userid = myCache.get('thisUserId');
  $scope.shopid = myCache.get('thisMemberId');

  $scope.toggleLeft = buildToggler('left');

  // buildToggler is for create menu toggle.
  // Parameter :  
  // navID = id of navigation bar.
  function buildToggler(navID) {
      var debounceFn = $mdUtil.debounce(function () {
          $mdSidenav(navID).toggle();
      }, 0);
      return debounceFn;
  };// End buildToggler.

  // navigateTo is for navigate to other page 
  // by using targetPage to be the destination state. 
  // Parameter :  
  // stateNames = target state to go
  $scope.navigateTo = function (stateName) {
      $timeout(function () {
          $mdSidenav('left').close();
          if ($ionicHistory.currentStateName() != stateName) {
              $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true
              });
              $state.go(stateName);
          }
      }, ($scope.isAndroid == false ? 300 : 0));
  };// End navigateTo.

  //closeSideNav is for close side navigation
  //It will use with event on-swipe-left="closeSideNav()" on-drag-left="closeSideNav()"
  //When user swipe or drag md-sidenav to left side
  $scope.closeSideNav = function(){
      $mdSidenav('left').close();
  };

  $ionicPlatform.registerBackButtonAction(function(){

      if($mdSidenav("left").isOpen()){
          //If side navigation is open it will close and then return
          $mdSidenav('left').close();
      }
      else if(jQuery('md-bottom-sheet').length > 0 ) {
          //If bottom sheet is open it will close and then return
          $mdBottomSheet.cancel();
      }
      else if(jQuery('[id^=dialog]').length > 0 ){
          //If popup dialog is open it will close and then return
          $mdDialog.cancel();
      }
      else if(jQuery('md-menu-content').length > 0 ){
          //If md-menu is open it will close and then return
          $mdMenu.hide();
      }
      else if(jQuery('md-select-menu').length > 0 ){
          //If md-select is open it will close and then return
          $mdSelect.hide();
      }

      else{

          // If control :
          // side navigation,
          // bottom sheet,
          // popup dialog,
          // md-menu,
          // md-select
          // is not opening, It will show $mdDialog to ask for
          // Confirmation to close the application or go to the view of lasted state.

          // Check for the current state that not have previous state.
          // It will show $mdDialog to ask for Confirmation to close the application.

          if($ionicHistory.backView() == null){

              //Check is popup dialog is not open.
              if(jQuery('[id^=dialog]').length == 0 ) {

                  // mdDialog for show $mdDialog to ask for
                  // Confirmation to close the application.

                  $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      targetEvent: null,
                      locals: {
                          displayOption: {
                              title: "Confirmation",
                              content: "Do you want to close the application?",
                              ok: "Confirm",
                              cancel: "Cancel"
                          }
                      }
                  }).then(function () {
                      //If user tap Confirm at the popup dialog.
                      //Application will close.
                      ionic.Platform.exitApp();
                  }, function () {
                      // For cancel button actions.
                  }); //End mdDialog
              }
          }
          else{
              //Go to the view of lasted state.
              $ionicHistory.goBack();
          }
      }

  },100);

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('DialogController', function ($scope, $mdDialog, displayOption) {

    //This variable for display wording of dialog.
    //object schema:
    //displayOption: {
    //        title: "Confirm to remove all data?",
    //        content: "All data will remove from local storage.",
    //        ok: "Confirm",
    //        cancel: "Close"
    //}
    $scope.displayOption = displayOption;

    $scope.cancel = function () {
        $mdDialog.cancel(); //close dialog.
    };

    $scope.ok = function () {
        $mdDialog.hide();//hide dialog.
    };
})

.controller('ProductDialogController', function ($scope, $mdDialog, displayOption, $mdToast, $timeout, AddProductService) {

    //This variable for display wording of dialog.
    //object schema:
    //displayOption: {
    //        title: "Confirm to remove all data?",
    //        content: "All data will remove from local storage.",
    //        ok: "Confirm",
    //        cancel: "Close"
    //}
    $scope.displayOption = displayOption;

    $scope.cancel = function () {
        $mdDialog.cancel(); //close dialog.
    };

    $scope.ok = function () {
        //hide dialog.
        $mdDialog.hide();
        AddProductService.addNum($scope.displayOption.input);
    };
})

.controller('toastController', function ($scope, displayOption) {

    //this variable for display wording of toast.
    //object schema:
    // displayOption: {
    //    title: "Data Saved !"
    //}

    $scope.displayOption = displayOption;
})

.controller('registerCtrl', function($scope, $state, $ionicLoading, MembersFactory, CurrentUserService, PickTransactionServices, $mdBottomSheet, $ionicPopup, $cordovaCamera, $ionicActionSheet, $cordovaDevice, $cordovaFile, $ionicPopup, myCache) {

  $scope.uploaded = function () {
    $scope.isPhoto = true;
    $scope.photo = "Photo Uploaded";
  };
  $scope.user = {};
  $scope.currentItem = {'photo': ''};
  $scope.isPhoto = false;
  $scope.photo = "Upload Photo ?";

  $scope.doAction = function() {
    $scope.hideSheet = $ionicActionSheet.show({

      buttons: [
            { text: '<i class="icon ion-camera"></i> Take Picture' },
            { text: '<i class="icon ion-images"></i> Choose Album' },
        ],
      buttonClicked: function(index) {
        switch (index) {
                case 0:
                    $scope.currentItem = { photo: PickTransactionServices.photoSelected };
                    var options = {
                      quality: 75,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.CAMERA,
                      allowEdit: false,
                      encodingType: Camera.EncodingType.JPEG,
                      popoverOptions: CameraPopoverOptions,
                      targetWidth: 800,
                      targetHeight: 800,
                      saveToPhotoAlbum: false
                    };
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.currentItem.photo = imageData;
                        $scope.uploaded();
                        $ionicPopup.alert({title: 'Upload Success', template: 'Upload from camera success'});
                    }, function (error) {
                        $ionicPopup.alert({title: 'Upload Failed', template: error});
                        console.error(error);
                    })

                break;
                case 1:
                  $scope.currentItem = { photo: PickTransactionServices.photoSelected };
                    var options = {
                      quality: 75,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                      allowEdit: false,
                      encodingType: Camera.EncodingType.JPEG,
                      popoverOptions: CameraPopoverOptions,
                      targetWidth: 800,
                      targetHeight: 800,
                      saveToPhotoAlbum: false
                    };
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.currentItem.photo = imageData;
                        $scope.uploaded();
                        $ionicPopup.alert({title: 'Upload Success', template: 'Upload from album success'});
                    }, function (error) {
                      $ionicPopup.alert({title: 'Upload Failed', template: error});
                        console.error(error);
                    })
              
                break;
              }
              return true;
        },
      cancelText: 'Cancel',
        cancel: function() {
        $scope.isPhoto = false;
        $scope.photo = "Upload Photo ?";
        console.log('CANCELLED');}
    }); 
  }
   
  $scope.createMember = function (user) {
      
      var email = user.email;
      var password = user.password;

      // Validate form data
      if (typeof user.shopname === 'undefined' || user.shopname === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your shop name!'});
          return;
      }
      if (typeof user.ownername === 'undefined' || user.ownername === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your name!'});
          return;
      }
      if (typeof user.password === 'undefined' || user.password === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your password!'});
          return;
      }
      if (typeof user.confirm === 'undefined' || user.confirm === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your password confirmation!'});
          return;
      }
      if (typeof user.email === 'undefined' || user.email === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your email!'});
          return;
      }
      if (typeof user.address === 'undefined' || user.address === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your address!'});
          return;
      }
      if (typeof user.phone === 'undefined' || user.phone === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your phone!'});
          return;
      }
      if (user.password !== user.confirm) {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Your password not match!' + user.password + user.confirm});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Registering...'
      });

      firebase.auth().createUserWithEmailAndPassword(user.email,user.password).catch(function(error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The email entered is already in use!'});
                break;
            case "auth/invalid-email":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                break;
            case "auth/operation-not-allowed":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The accounts are not enabled!'});
                break;
            case "auth/weak-password":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The password not strong enough!'});
                break;
            default:
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
        }
      }).then(function(firebaseUser) {
        $ionicLoading.hide();
        firebase.auth().signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
          switch (error.code) {
              case "auth/user-disabled":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Sign in Failed', template: 'The email has been disable!'});
                  break;
              case "auth/invalid-email":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Sign in Failed', template: 'The specified email is not a valid email!'});
                  break;
              case "auth/user-not-found":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Sign in Failed', template: 'The email not found!'});
                  break;
              case "auth/wrong-password":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Sign in Failed', template: 'The password invalid!'});
                  break;
              default:
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Sign in Failed', template: 'Oops. Something went wrong!'});
          }
        }).then(function(firebaseUser) {
          /* PREPARE DATA FOR FIREBASE*/
          var photo = $scope.currentItem.photo;
          // Create the file metadata
          var metadata = {
            contentType: 'image/jpeg'
          };

          $scope.temp = {
              shopname: user.shopname,
              ownername: user.ownername,
              email: user.email,
              sandi: user.password,
              address: user.address,
              phone: user.phone,
              picture: photo,
              datecreated: Date.now(),
              dateupdated: Date.now()
          }

          /* SAVE MEMBER DATA */
          var membersref = MembersFactory.mRef();
          var newMemberRef = membersref.push($scope.temp);

          $scope.user = {
              shopname: user.shopname,
              username: user.ownername,
              email: user.email,
              sandi: user.password,
              address: user.address,
              phone: user.phone,
              picture: photo,
              shopid: newMemberRef.key,
              datecreated: Date.now(),
              dateupdated: Date.now()
          }

          var newShopUser = membersref.child(newMemberRef.key).child("users").child(firebaseUser.uid);
          newShopUser.update($scope.user);
          var userref = MembersFactory.ref();
          var storageref = MembersFactory.iRef();
          var newUser = userref.child(firebaseUser.uid);
          newUser.update($scope.user, function (ref) {
          var uploadTask = storageref.child(newMemberRef.key+'.jpg').put(photo, metadata);
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                console.log('unauthorized upload');
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                console.log('Upload is canceled');
                // User canceled the upload
                break;
              case 'storage/unknown':
                console.log('error');
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, function() {
            // Upload completed successfully, now we can get the download URL
            var downloadURL = uploadTask.snapshot.downloadURL;
          });
          });
          
          MembersFactory.getUser(firebaseUser).then(function (thisuser) {
            /* Save user data for later use */
            myCache.put('thisShopName', thisuser.shopname);
            myCache.put('thisUserName', thisuser.username);
            myCache.put('thisMemberId', newMemberRef.key);
            myCache.put('thisUserId', firebaseUser.uid);
            CurrentUserService.updateUser(thisuser);
          });

          $ionicLoading.hide();
          $state.go('app.menuDashboard');
          });
      });
    }
})

.controller('loginCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $cacheFactory, $ionicLoading, $ionicPopup, $state, MembersFactory, myCache, CurrentUserService) {
  
  $scope.user = {};
  $scope.doLogIn = function (user) {
      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Loggin In...'
      });

      /* Check user fields*/
      if (!user.email || !user.password) {
          $ionicLoading.hide();
          $ionicPopup.alert({title: 'Login Failed', template: 'Please check your Email or Password!'});
          return;
      }

      /* Authenticate User */
      firebase.auth().signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
        switch (error.code) {
            case "auth/user-disabled":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The email has been disable!'});
                break;
            case "auth/invalid-email":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The specified email is not a valid email!'});
                break;
            case "auth/user-not-found":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The email not found!'});
                break;
            case "auth/wrong-password":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The password invalid!'});
                break;
            default:
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'Oops. Something went wrong!'});
        }
      }).then(function(firebaseUser) {
        MembersFactory.getUser(firebaseUser).then(function (thisuser) {
                  
            /* Save user data for later use */
            myCache.put('thisShopName', thisuser.shopname);
            myCache.put('thisUserName', thisuser.username);
            myCache.put('thisMemberId', thisuser.shopid);
            myCache.put('thisUserId', firebaseUser.uid);
            CurrentUserService.updateUser(thisuser);
            MembersFactory.getMember(thisuser.shopid).then(function (shop) {
              $ionicLoading.hide();
              $state.go('app.menuDashboard');
            });
        });
      });
  }
})

.controller('menuDashboardCtrl', function ($scope, $mdToast) {
    //ShowToast for show toast when user press button.
    $scope.showToast = function (menuName) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: 'Going to ' + menuName + " !!"
                }
            }
        });
    }// End showToast.
})

.controller('dataProductCtrl', function ($scope, $timeout, $state, $http, MasterFactory) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.productList is the variable that store user product data.
        $scope.productList = MasterFactory.getProducts();

        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#product-list-loading-progress').show();
            }
            else {
                jQuery('#product-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {
            jQuery('#product-list-loading-progress').hide();
            jQuery('#product-list-content').fadeIn();
        }, 4000);// End loading progress.
    };// End initialForm.

    // navigateTo is for navigate to other page.
    // by using targetPage to be the destination page
    // and send object to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object data that sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            product: objectData
        });
    };// End navigateTo.

    // loadMore is for loadMore product list.
    $scope.loadMore = function () {
        $timeout(function () {
            //get product list from json  at paht: www/app-data/product-list.json
            var baru = MasterFactory.getProduct();
            baru.then(function (snap) {
                    // Success retrieve data.
                        // Store user data to $scope.productList.
                    for (var product = 0; product < snap.length; product++) {
                        $scope.productList.push(snap[product]);
                    }
                    // To stop loading progress.
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }, 2000);
    };// End loadMore.

    $scope.initialForm();
})

.controller('modifProductCtrl', function ($mdBottomSheet, $timeout, $mdToast, $scope, $ionicActionSheet, $stateParams, $filter, $ionicPopup, CurrentProductService, $mdDialog, $ionicHistory, MasterFactory, myCache, $cordovaCamera) {

        // This function is the first activity in the controller. 
        // It will initial all variable data and let the function works when page load.
        $scope.initialForm = function () {
            //$scope.disableSaveBtn is  the variable for setting disable or enable the save button.
            $scope.disableSaveBtn = false;

            //$scope.actionDelete is the variable for allow or not allow to delete data.
            // It will allow to delete data when have data in the mobile contract.
            // $stateParams.actionDelete(bool) = status that pass from contract list page.
            $scope.actionDelete = $stateParams.actionDelete;
            $scope.photo = '';

            //$scope.contract is the variable that store contract data.
            // $stateParams.contractDetail = contract data that pass from contract list page.
            $scope.contract = $stateParams.contractDetail;

            // For initial temp contract data in case of add new contract.
            if ($scope.actionDelete == false) {
                $scope.contract = {
                    id: null,
                    productCode: '',
                    productName: '',
                    productSize: '',
                    productColor: '',
                    productStock: '',
                    productPhoto: '',
                    warehouses: MasterFactory.getWarehouses(),
                    isEnable: true
                };
            }// End initial temp contract data.
        }; // End initialForm.

        $scope.doAction = function() {
          $mdBottomSheet.hide();
          $scope.hideSheet = $ionicActionSheet.show({

            buttons: [
                  { text: '<i class="icon ion-camera"></i> Take Picture' },
                  { text: '<i class="icon ion-images"></i> Choose Album' },
              ],
            buttonClicked: function(index) {
              switch (index) {
                      case 0:
                          var options = {
                            quality: 75,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            targetWidth: 800,
                            targetHeight: 800,
                            saveToPhotoAlbum: false
                          };
                          $cordovaCamera.getPicture(options).then(function (imageData) {
                              $scope.photo = imageData;
                              $ionicPopup.alert({title: 'Upload Success', template: 'Upload from camera success'});
                          }, function (error) {
                              $ionicPopup.alert({title: 'Upload Failed', template: error});
                              console.error(error);
                          })

                      break;
                      case 1:
                          var options = {
                            quality: 75,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            targetWidth: 800,
                            targetHeight: 800,
                            saveToPhotoAlbum: false
                          };
                          $cordovaCamera.getPicture(options).then(function (imageData) {
                              $scope.photo = imageData;
                              $ionicPopup.alert({title: 'Upload Success', template: 'Upload from album success'});
                          }, function (error) {
                            $ionicPopup.alert({title: 'Upload Failed', template: error});
                              console.error(error);
                          })
                    
                      break;
                    }
                    return true;
              },
            cancelText: 'Cancel',
              cancel: function() {
              console.log('CANCELLED');}
          }); 
        }

        // saveContract for saving contract
        // Parameter :  
        // contract(object) = contract object that presenting on the view.
        // $event(object) = position of control that user tap.
        $scope.saveContract = function (contract, $event) {
            // To hide $mdBottomSheet
            $mdBottomSheet.hide();
            // To packing array of temporary phone number to save to contract.
            

            //mdDialog.show use for show alert box for Confirm to save data.
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                targetEvent: $event,
                locals: {
                    displayOption: {
                        title: "Confirm to save product?",
                        content: "Data will save",
                        ok: "Confirm",
                        cancel: "Close"
                    }
                }
            }).then(function () {
                 // For confirm button to save data.
                try {
                    // Save contract to mobile contract by calling $cordovaContacts.save(contract)
                    var stock = parseFloat(contract.stockGudang) + parseFloat(contract.stockRumah) + parseFloat(contract.stockToko);
                    var stockGudang = contract.stockGudang;
                    var stockRumah = contract.stockRumah;
                    var stockToko = contract.stockToko;
                    if (contract.stockGudang == undefined || contract.stockGudang == "") {
                      stockGudang = 0;
                    }
                    if (contract.stockRumah == undefined || contract.stockRumah == "") {
                      stockRumah = 0;
                    }
                    if (contract.stockToko == undefined || contract.stockToko == "") {
                      stockToko = 0;
                    }
                    if ($scope.photo == undefined || $scope.photo == "") {
                      $scope.photo = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                    }
                    $scope.temp = {
                        productCode: contract.productCode,
                        productName: contract.productName,
                        productDesc: contract.productDesc,
                        productSize: contract.productSize,
                        productPhoto: $scope.photo,
                        productColor: contract.productColor,
                        productPrize: contract.productPrize,
                        productSellPrize: contract.productSellPrize,
                        stockGudang: stockGudang,
                        stockRumah: stockRumah,
                        stockToko: stockToko,
                        productStock: stock,
                        isEnable: true,
                        dateCreated: $filter('date')(new Date(), 'MMM dd yyyy'),
                        addedBy: myCache.get('thisUserId'),
                        dateUpdated: Date.now()
                    }
                    // To update data by calling ContractDB.update(contract) service.
                    if ($scope.actionDelete) {
                        var ref = MasterFactory.pRef();
                        var newData = ref.child(contract.$id);
                        newData.update($scope.temp);
                        CurrentProductService.updateProduct($scope.temp);
                    } // End update data. 

                    // To add new data by calling ContractDB.add(contract) service.
                    else {
                        var ref = MasterFactory.pRef();
                        ref.push($scope.temp);
                        $scope.actionDelete = true;
                        CurrentProductService.updateProduct($scope.temp);
                    }// End  add new  data.
                    // Showing toast for save data is success.
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 400,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: "Product Saved !"
                            }
                        }
                    });

                    // After save success it will navigate back to contract list page.
                    $timeout(function () {
                        $ionicHistory.goBack();
                    }, 800);
                }
                catch (e) {
                    // Showing toast for unable to save data.
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: window.globalVariable.message.errorMessage
                            }
                        }
                    });
                }

            }, function () {
                // For cancel button to save data.
            });// End alert box.
        };// End saveContract.

        // deleteContract for delete contract
        // Parameter :  
        // contract(object) = contract object that presenting on the view.
        // $event(object) = position of control that user tap.
        $scope.deleteContract = function (contract, $event) {
            //mdBottomSheet.hide() use for hide bottom sheet.
            $mdBottomSheet.hide();

            //mdDialog.show use for show alert box for Confirm to remove contract.
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                targetEvent: $event,
                locals: {
                    displayOption: {
                        title: "Confirm to remove product?",
                        content: "Data will remove.",
                        ok: "Confirm",
                        cancel: "Close"
                    }
                }
            }).then(function () {
                 // For confirm button to remove contract.
                try {
                    // Remove contract by calling ContractDB.remove(contract)service.
                    var ref = MasterFactory.pRef();
                    var newData = ref.child(contract.$id);
                    newData.remove();
                    $ionicHistory.goBack();
                } catch (e) {
                    //// Showing toast for unable to remove data.
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 800,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: window.globalVariable.message.errorMessage
                            }
                        }
                    });
                } //End showing toast.

            }, function () {
                // For cancel button to remove data.
            });

        };// End deleteContract.

        // validateRequiredField is for validate the required field.
        // Parameter :  
        // contractForm(object) = contract object that presenting on the view.
        $scope.validateRequiredField = function (contractForm) {

            return ((typeof contractForm.productCode) == "undefined" ) || (contractForm.productCode.length == 0)
            && ((typeof contractForm.productName) == "undefined" ) || (contractForm.productName.length == 0)
            && ((typeof contractForm.productDesc) == "undefined" ) || (contractForm.productDesc.length == 0)
            && ((typeof contractForm.productSize) == "undefined" ) || (contractForm.productSize.length == 0)
            && ((typeof contractForm.productColor) == "undefined" ) || (contractForm.productColor.length == 0)
            && ((typeof contractForm.productPrize) == "undefined" ) || (contractForm.productPrize.length == 0)
            && ((typeof contractForm.productSellPrize) == "undefined" ) || (contractForm.productSellPrize.length == 0);
        };// End validate the required field. 

        // showListBottomSheet is for showing the bottom sheet.
        // Parameter :  
        // $event(object) = position of control that user tap.
        // contractForm(object) = contract object that presenting on the view.
        $scope.showListBottomSheet = function ($event, contractForm) {
            $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
            $mdBottomSheet.show({
                templateUrl: 'mobile-contract-actions-template.html',
                targetEvent: $event,
                scope: $scope.$new(false),
            });
        };// End showing the bottom sheet.
        $scope.initialForm();
})  

.controller('productListCtrl', function ($scope, $timeout, $state, $http, MasterFactory, $mdDialog, $mdToast, AddProductService) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.productList is the variable that store user product data.
        $scope.productList = MasterFactory.getProducts();

        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#product-list-loading-progress').show();
            }
            else {
                jQuery('#product-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {
            jQuery('#product-list-loading-progress').hide();
            jQuery('#product-list-content').fadeIn();
        }, 4000);// End loading progress.
    };// End initialForm.

    // navigateTo is for navigate to other page.
    // by using targetPage to be the destination page
    // and send object to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object data that sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            product: objectData
        });
    };// End navigateTo.

    $scope.addProduct = function (product, $event) {

	    $mdDialog.show({
		    controller: 'ProductDialogController',
		    templateUrl: 'confirm-dialog.html',
		    targetEvent: $event,
		    locals: {
		        displayOption: {
		            title: "Add product?",
		            ok: "Add",
		            cancel: "Close"
		        }
		    }
		}).then(function () {
		     // For confirm button to save data.
		    try {
		    	$scope.amount = AddProductService.amount;
		        $mdToast.show({
		            controller: 'toastController',
		            templateUrl: 'toast.html',
		            hideDelay: 400,
		            position: 'top',
		            locals: {
		                displayOption: {
		                    title: $scope.amount + " Product Added !"
		                }
		            }
		        });

		        // After save success it will navigate back to contract list page.
		        $timeout(function () {
		        }, 800);
		    }
		    catch (e) {
		        // Showing toast for unable to save data.
		        $mdToast.show({
		            controller: 'toastController',
		            templateUrl: 'toast.html',
		            hideDelay: 800,
		            position: 'top',
		            locals: {
		                displayOption: {
		                    title: window.globalVariable.message.errorMessage
		                }
		            }
		        });
		    }

		}, function () {
		    // For cancel button to save data.
		});// End alert box.
	};

    // loadMore is for loadMore product list.
    $scope.loadMore = function () {
        $timeout(function () {
            //get product list from json  at paht: www/app-data/product-list.json
            var baru = MasterFactory.getProduct();
            baru.then(function (snap) {
                    // Success retrieve data.
                        // Store user data to $scope.productList.
                    for (var product = 0; product < snap.length; product++) {
                        $scope.productList.push(snap[product]);
                    }
                    // To stop loading progress.
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }, 2000);
    };// End loadMore.

    $scope.initialForm();
})

.controller('productDetailCtrl', function ($scope, $state, $mdToast, $mdBottomSheet, $timeout, $stateParams, $ionicModal, CurrentProductService) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "app.modifProduct") {
            $scope.product = {
              productCode: CurrentProductService.productCode,
              productName: CurrentProductService.productName,
              productDesc: CurrentProductService.productDesc,
              productSize: CurrentProductService.productSize,
              productPhoto: CurrentProductService.productPhoto,
              productColor: CurrentProductService.productColor,
              productPrize: CurrentProductService.productPrize,
              productSellPrize: CurrentProductService.productSellPrize,
              stockGudang: CurrentProductService.stockGudang,
              stockRumah: CurrentProductService.stockRumah,
              stockToko: CurrentProductService.stockToko,
              productStock: CurrentProductService.productStock,
              isEnable: CurrentProductService.isEnable,
              dateCreated: CurrentProductService.dateCreated,
              addedBy: CurrentProductService.addedBy,
              dateUpdated: CurrentProductService.dateUpdated
          }
        }
    });

    $scope.initialForm = function () {
        // $scope.product is product detail
        // $stateParams.product is the object that pass from product list page.
        $scope.product = $stateParams.product;
        if (!$scope.product) {
          $scope.isProduct = false;
        }
        else {
          $scope.isProduct = true;
        }
        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#product-detail-loading-progress').show();
            }
            else {
                jQuery('#product-detail-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {
            jQuery('#product-detail-loading-progress').hide();
            jQuery('#product-detail-content').fadeIn();
        }, 3000);// End loading progress.
    };// End initialForm.

    // addToCart for show Item Added ! toast.
    $scope.addToCart = function () {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: "Item Added !"
                }
            }
        });
    }; // End addToCart.

    // sharedProduct fro show shared social bottom sheet by calling sharedSocialBottomSheetCtrl controller.
    $scope.sharedProduct = function ($event, product) {
        $mdBottomSheet.show({
            templateUrl: 'bottom-sheet-shared.html',
            controller: 'sharedSocialBottomSheetCtrl',
            targetEvent: $event,
            locals: {
                product: product
            }
        });
    };// End sharedProduct.

    $scope.navigateTo = function (targetPage, objectData) {

        $state.go(targetPage, {
            contractDetail: objectData,
            actionDelete: (objectData == null ? false : true)
        });
    }; 
    $scope.initialForm();
})

.controller('productCheckoutCtrl', function ($scope, $mdToast, $mdDialog) {
    //You can do some thing hear when tap on a credit card button.
    $scope.doSomeThing = function () {

    }// End doSomeThing.

    // showConfirmDialog for show alert box.
    $scope.showConfirmDialog = function ($event) {
        //mdDialog.show use for show alert box for Confirm to complete order.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Complete Order",
                    content: "Confirm to complete Order.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to complete order.
            
            //Showing Order Completed. Thank You ! toast.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Order Completed. Thank You !"
                    }
                }
            });
        }, function () {
            // For cancel button to complete order.
        });
    }// End showConfirmDialog.
})

.controller('suratJalanCtrl', function ($scope,$stateParams, $timeout, TransactionFactory, $state) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;

        // $scope.noteList is the variable that store data from TransactionFactory service.
        $scope.noteList = [];

        // $scope.filterText is the variable that use for searching.
        $scope.filterText = "";

        // The function for loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#note-list-loading-progress').show();
            }
            else {
                jQuery('#note-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all notes from TransactionFactory service.
            $scope.noteList = TransactionFactory.getInventories();

            jQuery('#note-list-loading-progress').hide();
            jQuery('#note-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };//End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true)
        });
    };// End navigateTo.

    $scope.initialForm();
})

.controller('detailSuratCtrl', function ($scope, TransactionFactory, $timeout, MasterFactory, myCache, $ionicPopup, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.actionDelete = $stateParams.actionDelete;
        if ($scope.actionDelete) {
          if ($stateParams.noteDetail.fromId) {
            $scope.dataf = {
              isi:{
                $id: $stateParams.noteDetail.fromId,
                warehouseName: $stateParams.noteDetail.fromName
              },
              isfrom: true
            }
            $scope.froms.push($scope.dataf);
          }
          if ($stateParams.noteDetail.toId) {
            $scope.datat = {
              isi:{
                $id: $stateParams.noteDetail.toId,
                warehouseName: $stateParams.noteDetail.toName
              },
              isto: true
            }
            $scope.tos.push($scope.datat);
          }
          if ($stateParams.noteDetail.products) {
            $scope.bahans = $stateParams.noteDetail.products
            angular.forEach($scope.bahans, function (bahan) {
                if (bahan.productId !== "") {
                      bahan.isi = {
                        $id: bahan.productId,
                        productCode: bahan.productCode
                      };
                      bahan.value = bahan.amount;
                      bahan.istampil = true;
                }
            })
          }
        }

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :  
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);
        $scope.products = MasterFactory.getProducts();
        $scope.products.$loaded().then(function (x) {
        }).catch(function (error) {
            console.error("Error:", error);
        });
        $scope.warehouses = MasterFactory.getWarehouses();
        $scope.warehouses.$loaded().then(function (x) {
        }).catch(function (error) {
            console.error("Error:", error);
        });
        
        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
    };// End initialForm.

    $scope.bahans = [];
    $scope.addbahans = function () {
        $scope.bahans.push({istampil: false})
        $timeout(function () {
            // To hide $mdBottomSheet
            $mdBottomSheet.hide();
            // To hide $mdDialog
            $mdDialog.hide();

        }, 400);
    }
    $scope.froms = [];
    $scope.addfroms = function () {
        $scope.froms.push({isfrom: false})
        $scope.hideFrom = true;
        $scope.hideNew = true;
        $timeout(function () {
            // To hide $mdBottomSheet
            $mdBottomSheet.hide();
            // To hide $mdDialog
            $mdDialog.hide();

        }, 400);
    }
    $scope.tos = [];
    $scope.addtos = function () {
        $scope.tos.push({isto: false})
        $scope.hideTo = true;
        $scope.hideNew = true;
        $timeout(function () {
            // To hide $mdBottomSheet
            $mdBottomSheet.hide();
            // To hide $mdDialog
            $mdDialog.hide();

        }, 400);
    }
    $scope.addnew = function () {
        $scope.tos.push({isto: false})
        $scope.hideFrom = true;
        $scope.hideTo = true;
        $scope.hideNew = true;
        $timeout(function () {
            // To hide $mdBottomSheet
            $mdBottomSheet.hide();
            // To hide $mdDialog
            $mdDialog.hide();

        }, 400);
    }
    $scope.editfrom = function (id) {
      angular.forEach($scope.froms, function (data) {
          if (data.isi.$id === id) {
            data.isfrom = false;
          }
      })
    }
    $scope.editto = function (id) {
      angular.forEach($scope.tos, function (data) {
          if (data.isi.$id === id) {
            data.isto = false;
          }
      })
    }
    $scope.editbahan = function (id) {
      angular.forEach($scope.bahans, function (data) {
          if (data.isi.$id === id) {
            data.istampil = false;
          }
      })
    }

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            title: '',
            desc: '',
            dateCreated: $filter('date')(new Date(), 'MMM dd yyyy'),
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.

    // saveNote is for save note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data will save.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling  NoteDB.update($scope.note) service.
                $scope.temp = {
                    title: note.title,
                    desc: note.desc,
                    dateCreated: $filter('date')(new Date(), 'MMM dd yyyy'),
                    addedBy: myCache.get('thisUserId'),
                    dateUpdated: Date.now()
                }
                $scope.products = [];
                angular.forEach($scope.bahans, function (bahan) {
                    if (bahan.isi.$id !== "") {
                        $scope.data = {
                            productId: bahan.isi.$id,
                            productCode: bahan.isi.productCode,
                            amount: bahan.value
                        }
                        $scope.products.push($scope.data);
                    }
                })
                if ($scope.froms) {
                  angular.forEach($scope.froms, function (from) {
                      if (from.isi.$id !== "") {
                          $scope.dataf = {
                              fromId: from.isi.$id,
                              fromName: from.isi.warehouseName
                          }
                          if (from.isi.warehouseName === "Gudang") {
                            angular.forEach($scope.bahans, function (bahan) {
                                if (bahan.isi.$id !== "") {
                                  var stockGudang = parseFloat(bahan.isi.stockGudang) - parseFloat(bahan.value);
                                  if (stockGudang <= 0) {
                                      $scope.hideValidationMessage = false;
                                      $ionicPopup.alert({title: 'Save failed', template: 'Stock Not Enough!' + bahan.isi.productCode + bahan.isi.stockGudang});
                                      return;
                                  }
                                  var productStock = parseFloat(stockGudang) + parseFloat(bahan.isi.stockRumah) + parseFloat(bahan.isi.stockToko);
                                  $scope.data = {
                                      stockGudang: stockGudang,
                                      productStock: productStock,
                                      addedBy: myCache.get('thisUserId'),
                                      dateUpdated: Date.now()
                                  }
                                  var updateProduct = MasterFactory.pRef();
                                  var newUpdate = updateProduct.child(bahan.isi.$id);
                                  newUpdate.update($scope.data);
                                }
                            })
                          }
                          if (from.isi.warehouseName === "Rumah") {
                            angular.forEach($scope.bahans, function (bahan) {
                                if (bahan.isi.$id !== "") {
                                  var stockRumah = parseFloat(bahan.isi.stockRumah) - parseFloat(bahan.value);
                                  if (stockRumah <= 0) {
                                      $scope.hideValidationMessage = false;
                                      $ionicPopup.alert({title: 'Save failed', template: 'Stock Not Enough!' + bahan.isi.productCode + bahan.isi.stockRumah});
                                      return;
                                  }
                                  var productStock = parseFloat(stockRumah) + parseFloat(bahan.isi.stockGudang) + parseFloat(bahan.isi.stockToko);
                                  $scope.data = {
                                      stockRumah: stockRumah,
                                      productStock: productStock,
                                      addedBy: myCache.get('thisUserId'),
                                      dateUpdated: Date.now()
                                  }
                                  var updateProduct = MasterFactory.pRef();
                                  var newUpdate = updateProduct.child(bahan.isi.$id);
                                  newUpdate.update($scope.data);
                                }
                            })
                          }
                          if (from.isi.warehouseName === "Toko") {
                            angular.forEach($scope.bahans, function (bahan) {
                                if (bahan.isi.$id !== "") {
                                  var stockToko = parseFloat(bahan.isi.stockToko) - parseFloat(bahan.value);
                                  if (stockToko <= 0) {
                                      $scope.hideValidationMessage = false;
                                      $ionicPopup.alert({title: 'Save failed', template: 'Stock Not Enough!' + bahan.isi.productCode + bahan.isi.stockToko});
                                      return;
                                  }
                                  var productStock = parseFloat(stockToko) + parseFloat(bahan.isi.stockGudang) + parseFloat(bahan.isi.stockRumah);
                                  $scope.data = {
                                      stockToko: stockToko,
                                      productStock: productStock,
                                      addedBy: myCache.get('thisUserId'),
                                      dateUpdated: Date.now()
                                  }
                                  var updateProduct = MasterFactory.pRef();
                                  var newUpdate = updateProduct.child(bahan.isi.$id);
                                  newUpdate.update($scope.data);
                                }
                            })
                          }
                      }
                  })
                }
                angular.forEach($scope.tos, function (to) {
                    if (to.isi.$id !== "") {
                        $scope.datat = {
                            toId: to.isi.$id,
                            toName: to.isi.warehouseName
                        }
                          if (to.isi.warehouseName === "Gudang") {
                            angular.forEach($scope.bahans, function (bahan) {
                                if (bahan.isi.$id !== "") {
                                  var stockGudang = parseFloat(bahan.isi.stockGudang) + parseFloat(bahan.value);
                                  if (stockGudang <= 0) {
                                      $scope.hideValidationMessage = false;
                                      $ionicPopup.alert({title: 'Save failed', template: 'Stock Not Enough!' + bahan.isi.productCode + bahan.isi.stockGudang});
                                      return;
                                  }
                                  var productStock = parseFloat(stockGudang) + parseFloat(bahan.isi.stockRumah) + parseFloat(bahan.isi.stockToko);
                                  $scope.data = {
                                      stockGudang: stockGudang,
                                      productStock: productStock,
                                      addedBy: myCache.get('thisUserId'),
                                      dateUpdated: Date.now()
                                  }
                                  var updateProduct = MasterFactory.pRef();
                                  var newUpdate = updateProduct.child(bahan.isi.$id);
                                  newUpdate.update($scope.data);
                                }
                            })
                          }
                          if (to.isi.warehouseName === "Rumah") {
                            angular.forEach($scope.bahans, function (bahan) {
                                if (bahan.isi.$id !== "") {
                                  var stockRumah = parseFloat(bahan.isi.stockRumah) + parseFloat(bahan.value);
                                  if (stockRumah <= 0) {
                                      $scope.hideValidationMessage = false;
                                      $ionicPopup.alert({title: 'Save failed', template: 'Stock Not Enough!' + bahan.isi.productCode + bahan.isi.stockRumah});
                                      return;
                                  }
                                  var productStock = parseFloat(stockRumah) + parseFloat(bahan.isi.stockGudang) + parseFloat(bahan.isi.stockToko);
                                  $scope.data = {
                                      stockRumah: stockRumah,
                                      productStock: productStock,
                                      addedBy: myCache.get('thisUserId'),
                                      dateUpdated: Date.now()
                                  }
                                  var updateProduct = MasterFactory.pRef();
                                  var newUpdate = updateProduct.child(bahan.isi.$id);
                                  newUpdate.update($scope.data);
                                }
                            })
                          }
                          if (to.isi.warehouseName === "Toko") {
                            angular.forEach($scope.bahans, function (bahan) {
                                if (bahan.isi.$id !== "") {
                                  var stockToko = parseFloat(bahan.isi.stockToko) + parseFloat(bahan.value);
                                  if (stockToko <= 0) {
                                      $scope.hideValidationMessage = false;
                                      $ionicPopup.alert({title: 'Save failed', template: 'Stock Not Enough!' + bahan.isi.productCode + bahan.isi.stockToko});
                                      return;
                                  }
                                  var productStock = parseFloat(stockToko) + parseFloat(bahan.isi.stockGudang) + parseFloat(bahan.isi.stockRumah);
                                  $scope.data = {
                                      stockToko: stockToko,
                                      productStock: productStock,
                                      addedBy: myCache.get('thisUserId'),
                                      dateUpdated: Date.now()
                                  }
                                  var updateProduct = MasterFactory.pRef();
                                  var newUpdate = updateProduct.child(bahan.isi.$id);
                                  newUpdate.update($scope.data);
                                }
                            })
                          }
                    }
                })
                // To update data by calling ContractDB.update(contract) service.
                if ($scope.actionDelete) {
                    var ref = TransactionFactory.ref();
                    var newData = ref.child(note.$id);
                    newData.update($scope.temp);
                    if ($scope.dataf) {
                      newData.update($scope.dataf);
                    }
                    newData.update($scope.datat);
                    var transRef = newData.child("products");
                    transRef.set($scope.products);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    var ref = TransactionFactory.ref();
                    var newData = ref.push($scope.temp);
                    if ($scope.dataf) {
                      newData.update($scope.dataf);
                    }
                    newData.update($scope.datat);
                    var transRef = newData.child("products");
                    transRef.set($scope.products);
                    $scope.contractList = TransactionFactory.getInventories();
                    $scope.actionDelete = true;
                }// End  add new  data. 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
                $ionicHistory.goBack();
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }

        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                var ref = TransactionFactory.ref();
                var newData = ref.child(note.$id);
                newData.remove();
                $ionicHistory.goBack();
            }// End remove note.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

    $scope.initialForm();
})

.controller('customerListCtrl', function ($scope, $stateParams,$filter, $mdDialog, $timeout, $ionicModal, $state, $mdBottomSheet, MasterFactory) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;

        // $scope.contracts  is the variable that store data from ContractDB service.
        $scope.contracts = [];

        // $scope.filterText  is the variable that use for searching.
        $scope.filterText = "";
        
        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#contract-list-loading-progress').show();
            }
            else {
                jQuery('#contract-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all contracts.
            $scope.getContractList();

            jQuery('#contract-list-loading-progress').hide();
            jQuery('#contract-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };// End initialForm.

    // getContractList is for get all contracts. 
    // By calling ContractDB.all() service.
    $scope.getContractList = function () {
        $scope.contracts = MasterFactory.getCustomers();
    };//End getContractList.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function(){
            $state.go(targetPage, {
                contractdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        },400);
    };// End navigateTo.

    // callTo is for using mobile calling.
    // Parameter :
    // number = number that going to call.
    $scope.callTo = function (number) {
        window.open("tel:" + number);
    }// End callTo.


    $scope.initialForm();
})

.controller('customerDetailCtrl', function ($mdBottomSheet, $mdToast, $scope, $stateParams, $filter, $mdDialog, $ionicHistory, MasterFactory, myCache) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.disableSaveBtn is  the variable for setting disable or enable the save button.
        $scope.disableSaveBtn = false;

        // $scope.contract is the variable that store contract detail data that receive form contract list page.
        // Parameter :  
        // $stateParams.actionDelete(bool) = status that pass from contract list page.
        // $stateParams.contractdetail(object) = contract that user select from contract list page.
        $scope.contract = $scope.getContractData($stateParams.actionDelete, $stateParams.contractdetail);

        //$scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when have data in the database.
        $scope.actionDelete = $stateParams.actionDelete;
    }; //End initialForm.

    // getContractData is for get contract detail data.
    $scope.getContractData = function (actionDelete, contractDetail) {
        // tempContract is  temporary contract data detail.
        var tempContract = {
            id: null,
            customerName: '',
            address: '',
            telephone: '',
            email: '',
            createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
            isEnable: false
        }
        // If actionDelete is true Contract Detail Page will show contract detail that receive form contract list page.
        // else it will show tempContract for user to add new data.
        return (actionDelete ? angular.copy(contractDetail) : tempContract);
    };//End get contract detail data.

    // saveContract is for save contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveContract = function (contract, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data customer will save.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                $scope.temp = {
                    customerName: contract.customerName,
                    address: contract.address,
                    telephone: contract.telephone,
                    email: contract.email,
                    createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
                    isEnable: contract.isEnable,
                    addedby: myCache.get('thisUserId'),
                    dateupdated: Date.now()
                }
                // To update data by calling ContractDB.update(contract) service.
                if ($scope.actionDelete) {
                    var ref = MasterFactory.ref();
                    var newData = ref.child(contract.$id);
                    newData.update($scope.temp);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    var ref = MasterFactory.ref();
                    ref.push($scope.temp);
                    $scope.contractList = MasterFactory.getCustomers();
                    $scope.actionDelete = true;
                }// End  add new  data. 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
                $ionicHistory.goBack();
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save contract.

    // deleteContract is for remove contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteContract = function (contract, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove contract by calling ContractDB.remove(contract)service.
                var ref = MasterFactory.ref();
                var newData = ref.child(contract.$id);
                newData.remove();
                $ionicHistory.goBack();
            }// End remove contract.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove contract.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = contract object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(   (form.customerName.$error.required == undefined)
        && (form.address.$error.required == undefined)
        && (form.telephone.$error.required == undefined)
        && (form.email.$error.required == undefined));
    };// End validate the required field. 

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // contractForm(object) = contract object that presenting on the view.
    $scope.showListBottomSheet = function ($event, contractForm) {
        $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    $scope.initialForm();
})

.controller('dataWarehouseCtrl', function ($scope, $stateParams,$filter, $mdDialog, $timeout, $ionicModal, $state, $mdBottomSheet, MasterFactory) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;

        // $scope.contracts  is the variable that store data from ContractDB service.
        $scope.contracts = [];

        // $scope.filterText  is the variable that use for searching.
        $scope.filterText = "";
        
        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#contract-list-loading-progress').show();
            }
            else {
                jQuery('#contract-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all contracts.
            $scope.getContractList();

            jQuery('#contract-list-loading-progress').hide();
            jQuery('#contract-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };// End initialForm.

    // getContractList is for get all contracts. 
    // By calling ContractDB.all() service.
    $scope.getContractList = function () {
        $scope.contracts = MasterFactory.getWarehouses();
    };//End getContractList.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function(){
            $state.go(targetPage, {
                contractdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        },400);
    };// End navigateTo.

    // callTo is for using mobile calling.
    // Parameter :
    // number = number that going to call.
    $scope.callTo = function (number) {
        window.open("tel:" + number);
    }// End callTo.


    $scope.initialForm();
})

.controller('warehouseDetailCtrl', function ($mdBottomSheet, $mdToast, $scope, $stateParams, $filter, $mdDialog, $ionicHistory, MasterFactory, myCache) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.disableSaveBtn is  the variable for setting disable or enable the save button.
        $scope.disableSaveBtn = false;

        // $scope.contract is the variable that store contract detail data that receive form contract list page.
        // Parameter :  
        // $stateParams.actionDelete(bool) = status that pass from contract list page.
        // $stateParams.contractdetail(object) = contract that user select from contract list page.
        $scope.contract = $scope.getContractData($stateParams.actionDelete, $stateParams.contractdetail);

        //$scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when have data in the database.
        $scope.actionDelete = $stateParams.actionDelete;
    }; //End initialForm.

    // getContractData is for get contract detail data.
    $scope.getContractData = function (actionDelete, contractDetail) {
        // tempContract is  temporary contract data detail.
        var tempContract = {
            id: null,
            customerName: '',
            address: '',
            telephone: '',
            email: '',
            createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
            isEnable: false
        }
        // If actionDelete is true Contract Detail Page will show contract detail that receive form contract list page.
        // else it will show tempContract for user to add new data.
        return (actionDelete ? angular.copy(contractDetail) : tempContract);
    };//End get contract detail data.

    // saveContract is for save contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveContract = function (contract, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data warehouse will save.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                $scope.temp = {
                    warehouseName: contract.warehouseName,
                    address: contract.address,
                    telephone: contract.telephone,
                    createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
                    isEnable: contract.isEnable,
                    addedby: myCache.get('thisUserId'),
                    dateupdated: Date.now()
                }
                // To update data by calling ContractDB.update(contract) service.
                if ($scope.actionDelete) {
                    var ref = MasterFactory.wRef();
                    var newData = ref.child(contract.$id);
                    newData.update($scope.temp);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    var ref = MasterFactory.wRef();
                    ref.push($scope.temp);
                    $scope.contractList = MasterFactory.getWarehouses();
                    $scope.actionDelete = true;
                }// End  add new  data. 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
                $ionicHistory.goBack();
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save contract.

    // deleteContract is for remove contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteContract = function (contract, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove contract by calling ContractDB.remove(contract)service.
                var ref = MasterFactory.wRef();
                var newData = ref.child(contract.$id);
                newData.remove();
                $ionicHistory.goBack();
            }// End remove contract.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }
        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove contract.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = contract object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(   (form.warehouseName.$error.required == undefined)
        && (form.address.$error.required == undefined)
        && (form.telephone.$error.required == undefined));
    };// End validate the required field. 

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // contractForm(object) = contract object that presenting on the view.
    $scope.showListBottomSheet = function ($event, contractForm) {
        $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    $scope.initialForm();
})

;
