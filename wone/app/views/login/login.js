var connectivity = require("connectivity");
var connectionType;
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
    user.set('message', '');
    user.set('loginText', 'Acessar Conta');
};

exports.goBack = function(){
    frameModule.topmost().goBack();
    user.set('previousUsername', '');
    user.set('previousPassword', '');
};

exports.goToReset = function(){
    user.set('previousUsername', "");
    user.set('previousPassword', "");
    frameModule.topmost().navigate({
        moduleName: "views/login/reset-password"
    });
};

exports.login = function(){
    connectionType = connectivity.getConnectionType();
    switch (connectionType){
        case undefined:
        case connectivity.connectionType.none:
            user.set('message', 'Ops! Sem conexão :(');
        break;
        default:
            user.set('message', '');
            if (user.get('previousUsername').trim() !== "" && user.get('previousPassword').trim() !== "") {
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
                            clearHistory: true,
                            context: {
                                origin: 'login'
                            }
                        });            
                    },
                    function(error){
                        alert('Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                    });
                }, 
                function(error){
                    if (error.code == 205){
                        alert('Ops! Usuário ou senha incorretos.');
                    }else{
                        alert('Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                    };
                });
            }else{
                dialogsModule.alert({
                    message: "Existem informações não preenchidas.",
                    okButtonText: "OK"
                });            
            };
    };
};

exports.resetPassword = function(){

};
