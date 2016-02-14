var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var viewModel = require("./main-view-model");
var user = new viewModel.UserViewModel({});
var categories = new viewModel.CategoryViewModel();

exports.loaded = function(){
    appsettings.keyselect = 'accesscounter';
    if (appsettings.haskey){
        if(appsettings.token){
            user.login()
                .then(function(data){
                    var i = appsettings.accesscounter;
                    i++;
                    appsettings.accesscounter = i;
                    appsettings.token = data.result.access_token;
                    appsettings.userid = data.result.principal_id;

                    //alert('appset_user: ' + appsettings.username + '\nappset_pass: ' + appsettings.password + '\n\ntoken: ' 
                    //+ appsettings.token + '\n\nuserid: ' + appsettings.userid + '\n\ncounter: ' + appsettings.accesscounter);

                	frameModule.topmost().navigate({
                        moduleName: "views/cockpit/cockpit", 
						clearHistory: true   
                    });
                }, 
                function(error){
                    alert(JSON.stringify(error));
                });
        }else{
            frameModule.topmost().navigate({
                moduleName: "views/login/login", 
            	clearHistory: true   
            });
        };
    }else{
    	user.register()
        .then(function(data){
			appsettings.accesscounter = 1;
            appsettings.registered = true;
            appsettings.token = data.result.access_token;
            appsettings.userid = data.result.principal_id;
			categories.fetch()
            .then(function(data){
                appsettings.categories = JSON.stringify(data);
                appsettings.countcategory = Number(data.count);
                
                //alert('appset_user: ' + appsettings.username + '\nappset_pass: ' + appsettings.password + '\n\ntoken: ' 
                //+ appsettings.token + '\nuserid: ' + appsettings.userid + '\n\ncounter: ' + appsettings.accesscounter);
                
                frameModule.topmost().navigate({
                    moduleName: "views/budget/budget", 
                    clearHistory: true   
                });
            },     
            function(error){
                alert(JSON.stringify(error));	    
            });
        }, 
       	function(error){
			alert(JSON.stringify(error));
        });
    }; 	
};

