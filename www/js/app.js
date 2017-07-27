// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
window.globalVariable = {
    //custom color style variable
    color: {
        appPrimaryColor: "",
        dropboxColor: "#017EE6",
        facebookColor: "#3C5C99",
        foursquareColor: "#F94777",
        googlePlusColor: "#D73D32",
        instagramColor: "#517FA4",
        wordpressColor: "#0087BE"
    },// End custom color style variable
    startPage: {
        url: "/welcome",//Url of start page.
        state: "welcome"//State name of start page.
    },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    },
    oAuth: {
      dropbox: "your_api_key",//Use for Dropbox API clientID.
      facebook: "your_api_key",//Use for Facebook API appID.
      foursquare: "your_api_key", //Use for Foursquare API clientID.
      instagram: "your_api_key",//Use for Instagram API clientID.
      googlePlus: "your_api_key",//Use for Google API clientID.
    },
    adMob: "your_api_key" //Use for AdMob API clientID.
};// End Global variable

angular.module('starter', ['ionic', 'ngIOS9UIWebViewPatch', 'ngMaterial', 'ngMessages', 'ngCordova', 'starter.controllers', 'starter.services', 'firebase', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet, $localStorage) {
  // Create custom defaultStyle.
  function getDefaultStyle() {
      return "" +
          ".material-background-nav-bar { " +
          "   background-color        : " + appPrimaryColor + " !important; " +
          "   border-style            : none;" +
          "}" +
          ".md-primary-color {" +
          "   color                     : " + appPrimaryColor + " !important;" +
          "}";
  }// End create custom defaultStyle

  // Create custom style for product view.
  function getProductStyle() {
      return "" +
          ".material-background-nav-bar { " +
          "   background-color        : " + appPrimaryColor + " !important;" +
          "   border-style            : none;" +
          "   background-image        : url('img/background_cover_pixels.png') !important;" +
          "   background-size         : initial !important;" +
          "}" +
          ".md-primary-color {" +
          "   color                     : " + appPrimaryColor + " !important;" +
          "}";
  }// End create custom style for product view.

  // Create custom style for contract us view.
  function getContractUsStyle() {
      return "" +
          ".material-background-nav-bar { " +
          "   background-color        : transparent !important;" +
          "   border-style            : none;" +
          "   background-image        : none !important;" +
          "   background-position-y   : 4px !important;" +
          "   background-size         : initial !important;" +
          "}" +
          ".md-primary-color {" +
          "   color                     : " + appPrimaryColor + " !important;" +
          "}";
  } // End create custom style for contract us view.

  function initialRootScope() {
      $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
      $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
      $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
  };

  function hideActionControl() {
      //For android if user tap hardware back button, Action and Dialog should be hide.
      $mdBottomSheet.cancel();
      $mdDialog.cancel();
  };

  function createCustomStyle(stateName) {
      var customStyle =
          ".material-background {" +
          "   background-color          : " + appPrimaryColor + " !important;" +
          "   border-style              : none;" +
          "}" +
          ".spinner-android {" +
          "   stroke                    : " + appPrimaryColor + " !important;" +
          "}";

      switch (stateName) {
          case "app.productList" :
          case "app.productDetail":
          case "app.productCheckout":
          case "app.clothShop" :
          case "app.catalog" :
              customStyle += getProductStyle();
              break;
          case "app.dropboxLogin" :
          case "app.dropboxProfile":
          case "app.dropboxFeed" :
              customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
              break;
          case "app.facebookLogin" :
          case "app.facebookProfile":
          case "app.facebookFeed" :
          case "app.facebookFriendList":
              customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
              break;
          case "app.foursquareLogin" :
          case "app.foursquareProfile":
          case "app.foursquareFeed" :
              customStyle += getSocialNetworkStyle(window.globalVariable.color.foursquareColor);
              break;
          case "app.googlePlusLogin" :
          case "app.googlePlusProfile":
          case "app.googlePlusFeed" :
              customStyle += getSocialNetworkStyle(window.globalVariable.color.googlePlusColor);
              break;
          case "app.instagramLogin" :
          case "app.instagramProfile":
          case "app.instagramFeed" :
              customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
              break;
          case "app.wordpressLogin" :
          case "app.wordpressFeed":
          case "app.wordpressPost" :
              customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
              break;
          case "app.contractUs":
              customStyle += getContractUsStyle();
              break;
          default:
              customStyle += getDefaultStyle();
              break;
      }
      return customStyle;
  }// End createCustomStyle

  // Add custom style while initial application.
  $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);
  $ionicPlatform.ready(function () {
      setTimeout(function () {
          ionic.Platform.isFullScreen = true;
          if (window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);
          }
          if (window.StatusBar) {
              StatusBar.styleDefault();
          }
      }, 300);

      setTimeout(function () {
              if (typeof $localStorage.enableTouchID === 'undefined' || $localStorage.enableTouchID === '' || $localStorage.enableTouchID === false) {
                  //should already be on login page
                  $state.reload();
                  $state.go("welcome");
              } else {
                  $state.reload();
                  $cordovaTouchID.checkSupport().then(function () {
                      $cordovaTouchID.authenticate("All users with a Touch ID profile on the device will have access to this app").then(function () {
                          $state.go("loginauto");
                      }, function (error) {
                          console.log(JSON.stringify(error));
                          $state.go("welcome");
                      });
                  }, function (error) {
                      console.log(JSON.stringify(error));
                      $state.go("welcome");
                  });
              }
      }, 750);

      initialRootScope();

      //Checking if view is changing it will go to this function.
      $rootScope.$on("$stateChangeError", function (event, $window, toState, toParams, fromState, fromParams, error) {
              if (error === "AUTH_REQUIRED") {
                  $ionicHistory.clearCache();
                  $state.reload();
                  fb.unauth();
                  $state.go("welcome");
              }
              hideActionControl();
              // Add custom style ti view.
              $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
      });
  });
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdGestureProvider, $mdIconProvider, $mdColorPalette, $mdIconProvider) {

  // Use for change ionic spinner to android pattern.
  var config = {
      apiKey: "AIzaSyCXhhO-vr0VAoU3INIVMDdNxb4jg25nTQI",
      authDomain: "groseer-d6f13.firebaseapp.com",
      databaseURL: "https://groseer-d6f13.firebaseio.com",
      projectId: "groseer-d6f13",
      storageBucket: "groseer-d6f13.appspot.com",
      messagingSenderId: "286891420228"
  };
  var fb = firebase.initializeApp(config);
  $mdGestureProvider.skipClickHijack();
  $ionicConfigProvider.spinner.icon("android");
  $ionicConfigProvider.views.swipeBackEnabled(false);

  // mdIconProvider is function of Angular Material.
  // It use for reference .SVG file and improve performance loading.
  $mdIconProvider
      .icon('facebook', 'img/icons/facebook.svg')
      .icon('twitter', 'img/icons/twitter.svg')
      .icon('mail', 'img/icons/mail.svg')
      .icon('message', 'img/icons/message.svg')
      .icon('share-arrow', 'img/icons/share-arrow.svg')
      .icon('more', 'img/icons/more_vert.svg');

  $mdThemingProvider
      .theme('default')
      .primaryPalette('pink')
      .accentPalette('red');

  appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"];
  
  $stateProvider

  .state('welcome', {
      url: "/welcome",
      cache: false,
      templateUrl: "templates/welcome.html"
  })

  .state('welcomeLogin', {
      url: "/welcomeLogin",
      cache: false,
      templateUrl: "templates/welcome-login.html",
      controller: 'loginCtrl'
  })
  .state('welcomeSignUp', {
      url: "/welcomeSignUp",
      cache: false,
      templateUrl: "templates/welcome-sign-up.html",
      controller: 'registerCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.menuDashboard', {
      url: "/menuDashboard",
      views: {
          'menuContent': {
              templateUrl: "templates/menu-dashboard.html",
              controller: "menuDashboardCtrl"
          }
      }
  })

  .state('app.report', {
      url: "/report",
      params: {
          status: null,
      },
      views: {
          'menuContent': {
              templateUrl: "templates/report.html",
              controller: "reportCtrl"
          }
      }
  })

  .state('app.productList', {
      url: "/productList",
      views: {
          'menuContent': {
              templateUrl: "templates/product-list.html",
              controller: 'productListCtrl'
          }
      }
  })

  .state('app.productDetail', {
      url: "/productDetail",
      params: {
          product: null,
      },
      views: {
          'menuContent': {
              templateUrl: "templates/product-detail.html",
              controller: 'productDetailCtrl'
          }
      }
  })

  .state('app.productCheckout', {
      url: "/productCheckout",
      params: {
          product: null,
      },
      views: {
          'menuContent': {
              templateUrl: "templates/product-checkout.html",
              controller: 'productCheckoutCtrl'
          }
      }
  })

  .state('app.suratJalan', {
      url: "/suratJalan",
      params:{
          isAnimated:false
      },
      cache: false,
      views: {
          'menuContent': {
              templateUrl: "templates/surat-jalan.html",
              controller: 'suratJalanCtrl'
          }
      }
  })

  .state('app.detailsurat', {
      url: "/detailsurat",
      params: {
          noteDetail: null,
          actionDelete: false
      },
      views: {
          'menuContent': {
              templateUrl: "templates/detail-surat.html",
              controller: 'detailSuratCtrl'
          }
      }
  })

  .state('app.customerList', {
      url: "/customerList",
      cache: false,
      params:{
          isAnimated:(ionic.Platform.isAndroid()==false)
      },
      views: {
          'menuContent': {
              templateUrl: "templates/customer-list.html",
              controller: 'customerListCtrl'
          }
      }
  })

  .state('app.customerdetail', {
      url: "/customerdetail",
      params: {
          contractdetail: null,
          actionDelete: false
      },
      views: {
          'menuContent': {
              templateUrl: "templates/customer-detail.html",
              controller: 'customerDetailCtrl'
          }
      }
  })

  .state('app.dataWarehouse', {
      url: "/dataWarehouse",
      cache: false,
      params:{
          isAnimated:(ionic.Platform.isAndroid()==false)
      },
      views: {
          'menuContent': {
              templateUrl: "templates/data-warehouse.html",
              controller: 'dataWarehouseCtrl'
          }
      }
  })

  .state('app.warehousedetail', {
      url: "/warehousedetail",
      params: {
          contractdetail: null,
          actionDelete: false
      },
      views: {
          'menuContent': {
              templateUrl: "templates/warehouse-detail.html",
              controller: 'warehouseDetailCtrl'
          }
      }
  })

  .state('app.dataProduct', {
      url: "/dataProduct",
      cache: false,
      views: {
          'menuContent': {
              templateUrl: "templates/data-product.html",
              controller: 'dataProductCtrl'
          }
      }
  })

  .state('app.modifProduct', {
      url: "/modifProduct",
      params: {
          contractDetail: null,
          actionDelete: false
      },
      views: {
          'menuContent': {
              templateUrl: "templates/modif-product.html",
              controller: 'modifProductCtrl'
          }

      }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(window.globalVariable.startPage.url);
});
