var dialogsModule = require("ui/dialogs");
var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var viewModel = require("../main/main-view-model");
var user = new viewModel.UserViewModel();
var page;


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = user;
}

exports.goBack = function(){
    frameModule.topmost().goBack();
};

exports.login = function(){
    user.login()
    .then(function(data){
        user.current()
        .then(function(data){
            appsettings.registerdate = Number(new Date(data.result.CreatedAt));
            appsettings.userid = data.result.Id;
            appsettings.registered = true;
            appsettings.favsubcat1 = "";
            appsettings.favsubcat2 = "";
            appsettings.favsubcat3 = "";
            appsettings.basicCategoryBudget = "";
            appsettings.extraCategoryBudget = "";
            appsettings.investimentCategoryBudget = "";
            appsettings.expenses = "";
            appsettings.creditcards = "";            
            user.set('previousUsername', "");
            user.set('previousPassword', "");
            frameModule.topmost().navigate({
                moduleName: "views/budget/budget", 
                clearHistory: true
            });            
        },
        function(erroe){
            alert(JSON.stringify(error));
        });
    }, 
    function(error){
        alert(JSON.stringify(error));
    });
};
