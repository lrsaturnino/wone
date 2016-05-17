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
    user.set('resetEmail', '');
};

exports.goBack = function(){
    frameModule.topmost().goBack();
    user.set('resetEmail', '');
};

exports.resetPassword = function(){
    connectionType = connectivity.getConnectionType();
    switch (connectionType){
        case undefined:
        case connectivity.connectionType.none:
            user.set('message', 'Ops! Sem conexão :(');
        break;
        default:
            user.set('message', '');
            if (user.get('resetEmail').trim() !== "") {
                user.reset()
                .then(function(data){
                    user.set('resetEmail', '');
                    dialogsModule.alert({
                        message: "Enviamos um e-mail para recuperação de sua senha.",
                        okButtonText: "OK"
                    });                                
                    frameModule.topmost().navigate({
                        moduleName: "views/cockpit/cockpit",
                        clearHistory: true
                    });                    
                }, 
                function(error){
                    if (error.code === 206){
                        dialogsModule.alert({
                            message: "Usuário não localizado. Por favor, verifique o e-mail fornecido.",
                            okButtonText: "OK"
                        });                        
                    }else{
                        user.set('message', 'Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                    };
                });
            }else{
                dialogsModule.alert({
                    message: "Informe o e-mail para recuperação de sua senha.",
                    okButtonText: "OK"
                });            
            };
    };
};
