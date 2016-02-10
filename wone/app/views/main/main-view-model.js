var appsettings = require("../../utils/appsettings");
var observableArrayModule = require("data/observable-array");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var Everlive = require('../../lib/everlive/everlive.all.min');
var everliveOptions = {
	appId: APP_ID,
    scheme: BS_SCHEME,
    tokenType: 'bearer',
    offline: true,
    token: appsettings.token,
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
        email: data.email || appsettings.username,
		password: data.password || appsettings.password
	});	

	viewModel.register = function(){     
        var _this = this;
        return new Promise(function (resolve, reject) {
            EVERLIVE.Users.get()
            .then(function(data){
                if (data.count === 0){
                    _this.set('email', '1000');
                    _this.set('password','w0RlD_On&');
                    var attrs = {
                        Email: '',
                        DisplayName: ''
                    };
                }else{
                    var obj = data.result;
                    obj.sort(function(a,b){
                        if(a.Username == b.Username)
                            return 0;
                        if(a.Username < b.Username)
                            return -1;
                        if(a.Username > b.Username)
                            return 1;                	    
                    });
                    obj = obj[obj.length - 1];
                    _this.set('email',(Number(obj["Username"]) + 1).toString());
                    _this.set('password','w0RlD_On&');
                    var attrs = {
                        Email: '',
                        DisplayName: ''
                    };
                };
                EVERLIVE.Users.register(_this.get("email"),_this.get("password"),attrs,
                function(data){
                    appsettings.username = _this.get("email");
                    appsettings.password = _this.get("password");
                    
                    EVERLIVE.authentication.login(appsettings.username,appsettings.password)
                    .then(function (data) {
                        resolve(data);
                    },
                    function(error) { 
                        reject(error);
                    });
                },
                function(error){
                    reject(error);
                });
            },
            function(error){
                reject(error);
            });
       }); 
   };
    
   viewModel.login = function(){
        var _this = this;
   		return new Promise(function (resolve, reject) {
            EVERLIVE.authentication.login(_this.get("email"), _this.get("password"))
            .then(function (data) {
                resolve(data);
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