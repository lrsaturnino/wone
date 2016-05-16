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

    if (appsettings.registered){
        viewModule.getViewById(page, 'oldPassword').visibility = 'visible';
        user.set('email', appsettings.username);
        user.set('newPasswordHint', 'Nova senha');
        user.set('confirmNewPasswordHint', 'Confirmar nova senha');
        user.set('regBtnText', 'Atualizar conta');
    }else{
        viewModule.getViewById(page, 'oldPassword').visibility = 'collapsed';
        user.set('newPasswordHint', 'Senha');
        user.set('confirmNewPasswordHint', 'Confirmar senha');
        user.set('regBtnText', 'Registrar');
    };
    user.set('loginBtnText', 'Acessar com uma conta diferente');

};

exports.updateUser = function(){
    connectionType = connectivity.getConnectionType();
    switch (connectionType){
        case undefined:
        case connectivity.connectionType.none:
            user.set('message', 'Ops! Sem conexão :(');
        break;
        default:
            user.set('message', '');
            if (user.get('email').trim() !== "" && user.get('newPassword').trim() !== "" && (appsettings.registered ? user.get("oldPassword").trim() !== "" : true)) {    
                if (user.get("newPassword") === user.get("confirmNewPassword")) {   
                    user.update()
                    .then(function(data){
                        dialogsModule.alert({
                            message: "Sua conta foi atualizada com sucesso!",
                            okButtonText: "OK"
                        });
                        user.set('oldPassword', "");
                        user.set('newPassword', "");
                        user.set('confirmNewPassword', "");
                        frameModule.topmost().navigate({
                            moduleName: "views/cockpit/cockpit", 
                            clearHistory: true
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
                        message: "As senhas não são iguais.",
                        okButtonText: "OK"
                    });            
                }
            }else{
                dialogsModule.alert({
                    message: "Existem informações não preenchidas.",
                    okButtonText: "OK"
                });    
            };        
    };
};

exports.goBack = function(){
    user.set('oldPassword', "");
    user.set('newPassword', "");
    user.set('confirmNewPassword', "");
    frameModule.topmost().navigate({
        moduleName: "views/cockpit/cockpit"
    });
};

exports.goToLogin = function(){
    user.set('oldPassword', "");
    user.set('newPassword', "");
    user.set('confirmNewPassword', "");
    frameModule.topmost().navigate({
        moduleName: "views/login/login"
    });
};
