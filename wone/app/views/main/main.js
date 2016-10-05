var connectivity = require("connectivity");
var connectionType = connectivity.getConnectionType();
var observable = require("data/observable").Observable;
var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var viewModel = require("./main-view-model");
var user = new viewModel.UserViewModel();
var categories = new viewModel.CategoryViewModel();
var expenses = new viewModel.ExpenseListViewModel();
var page;

var pageData = new observable({});

exports.loaded = function(args){
    page = args.object;
    page.bindingContext = pageData;

    pageData.set('isLoading', true);

    appsettings.keyselect = 'accesscounter';
    if (appsettings.haskey){
        switch (connectionType){
            case undefined:
            case connectivity.connectionType.none:
                if (appsettings.basicCategoryBudget !== undefined && appsettings.extraCategoryBudget !== undefined && appsettings.investimentCategoryBudget !== undefined && appsettings.basicCategoryBudget !== "" && appsettings.extraCategoryBudget !== "" && appsettings.investimentCategoryBudget !== ""){
                    frameModule.topmost().navigate({
                            moduleName: "views/cockpit/cockpit",
                            clearHistory: true
                    });
                }else{
                    pageData.set('isLoading', false);
                    pageData.set('splashMessage', 'Ops! Sem conexão :(');
                };
                break;
            default:
                user.login()
                .then(function(data){
                    if (appsettings.expenses){
                        expenses.add(JSON.parse(appsettings.expenses))
                        .then(function(data) {
                            expenses.resume_yearmonth(new Date())
                            .then(function(data) {
                                frameModule.topmost().navigate({
                                        moduleName: "views/cockpit/cockpit",
                                        clearHistory: true
                                });
                            },
                            function(error) {
                                console.log(JSON.stringify(error));
                                frameModule.topmost().navigate({
                                        moduleName: "views/cockpit/cockpit",
                                        clearHistory: true
                                });
                            });
                        },
                        function(error) {
                            console.log(JSON.stringify(error));
                            expenses.resume_yearmonth(new Date())
                            .then(function(data) {
                                frameModule.topmost().navigate({
                                        moduleName: "views/cockpit/cockpit",
                                        clearHistory: true
                                });
                            },
                            function(error) {
                                console.log(JSON.stringify(error));
                                frameModule.topmost().navigate({
                                        moduleName: "views/cockpit/cockpit",
                                        clearHistory: true
                                });
                            });
                        });
                    }else{
                        if (appsettings.basicCategoryBudget !== "" && appsettings.extraCategoryBudget !== "" && appsettings.investimentCategoryBudget !== "" && appsettings.basicCategoryBudget !== undefined && appsettings.extraCategoryBudget !== undefined && appsettings.investimentCategoryBudget !== undefined){
                            frameModule.topmost().navigate({
                                    moduleName: "views/cockpit/cockpit",
                                    clearHistory: true
                            });
                        }else{
                            frameModule.topmost().navigate({
                                    moduleName: "views/budget/budget",
                                    clearHistory: true,
                                    context: {
                                        origin: 'main'
                                    }
                            });
                        };
                    };
                },
                function(error){
                    pageData.set('isLoading', false);
                    pageData.set('splashMessage', 'Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                });
        };
    }else{
        switch (connectionType){
            case undefined:
            case connectivity.connectionType.none:
                pageData.set('isLoading', false);
                pageData.set('splashMessage', 'Ops! Sem conexão :(');
            break;
            default:
                user.register()
                .then(function(data) {
                    appsettings.accesscounter = 0;
                    appsettings.messagetoken = false;
                    appsettings.expensecounter = 0;
                    appsettings.registered = false;
                    appsettings.registerdate = Number(new Date());
                    appsettings.userid = data.result.Id;
                    user.login()
                    .then(function(data){
                        categories.fetch()
                        .then(function(data){
                            appsettings.categories = JSON.stringify(data);
                            appsettings.countcategory = Number(data.count);
                            frameModule.topmost().navigate({
                                moduleName: "views/budget/budget",
                                clearHistory: true,
                                context: {
                                    origin: 'main'
                                }
                            });
                        },
                        function(error){
                            pageData.set('isLoading', false);
                            pageData.set('splashMessage', 'Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                        });
                    },
                    function(error){
                        pageData.set('isLoading', false);
                        pageData.set('splashMessage', 'Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                    });
                },
                function(error){
                    pageData.set('isLoading', false);
                    pageData.set('splashMessage', 'Ops! Tivemos um problema. (Cod.: ' + JSON.stringify(error) + ')');
                });
        };
    };
};
