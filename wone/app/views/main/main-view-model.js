var appsettings = require("../../utils/appsettings");
var observableArrayModule = require("data/observable-array");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var Everlive = require('../../lib/everlive/everlive.all.min');
var everliveOptions = {
	appId: APP_ID,
    scheme: BS_SCHEME,
    tokenType: 'bearer',
    authentication: {
        persist: true,
        onAuthenticationRequired: function() {
            alert('Seu acesso expirou. Por favor, acesse novamente.');
            	frameModule.topmost().navigate("views/login/login");
        }
    }
};

EVERLIVE = new Everlive(everliveOptions);

var UserViewModel = function(data){
    data = data || {};

    var viewModel = new Observable({
        id: appsettings.userid,
        username: appsettings.username,
        email: appsettings.registered ? appsettings.username : data.email,
		password: data.password || appsettings.password,
        oldPassword: "",
        previousPassword: "",
        previousUsername: "",
        newPassword: data.newPassword,
        buttonText: "",
        newPasswordHint: "",
        confirmNewPasswordHint: ""
	});	

	viewModel.register = function(){     
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.set('username', (parseInt(Math.random() * 1000) + "" + new Date().getTime()).toString());
            _this.set('password',' w0RlD_On&');
            var attrs = {
                Email: '',
                DisplayName: ''
            };
            EVERLIVE.Users.register(_this.get("username"), _this.get("password"), attrs)
            .then(function(data) {
                resolve(data);
            },
            function(error){
                reject(error);
            });
        }); 
   };
    
   viewModel.login = function(){
        var _this = this;
   		return new Promise(function (resolve, reject) {
            EVERLIVE.authentication.login(_this.get("previousUsername") !== "" ? _this.get("previousUsername") : _this.get("username"), _this.get('previousPassword') !== "" ? _this.get('previousPassword') : _this.get("password"))
            .then(function (data) {
                appsettings.username = _this.get("previousUsername") !== "" ? _this.get("previousUsername") : _this.get("username");
                appsettings.password = _this.get('previousPassword') !== "" ? _this.get('previousPassword') : _this.get("password");
                var i = appsettings.accesscounter;
                i++;
                appsettings.accesscounter = i;
                resolve(data);
            },
            function(error) { 
                reject(error);
            });
        });
   };
    
   viewModel.current = function(){
        var _this = this;
   		return new Promise(function (resolve, reject) {
            EVERLIVE.Users.currentUser()
            .then(function (data) {
                resolve(data);
            },
            function(error) { 
                reject(error);
            });
        });
   };

   viewModel.update = function(){
        var _this = this;
        var _email = _this.get('email').toLowerCase();
        return new Promise(function (resolve, reject) {
            EVERLIVE.Users.updateSingle({'Id' : _this.get('id'), 'Email' : _email, 'Username' : _email})
            .then(function (data) {
                appsettings.username = _email;
                EVERLIVE.Users.changePassword(_email, appsettings.registered ? _this.get('oldPassword') : _this.get('password'), _this.get('newPassword'), true)
                .then(function (data){
                    appsettings.password = _this.get('newPassword');
                    appsettings.registered = true;
                    resolve(data);
                },
                function(error){
                    reject(error);
                });
            },
            function(error) { 
                reject(error);
            });
        });
   };    
    
   return viewModel;
};

var CategoryViewModel = function(){
	var viewModel = new observableArrayModule.ObservableArray();	    
    
    viewModel.fetch = function() {
        var model = EVERLIVE.data('category');
        return new Promise(function (resolve, reject) {
            model.get()
            .then(function(data){
                resolve(data);
            },
            function(error){
                reject(error);
            });
        });
    };
    
   return viewModel;
};

exports.UserViewModel = UserViewModel;
exports.CategoryViewModel = CategoryViewModel;