var appModule = require("application");
var appsettings = require("../../utils/appsettings");
var dialogsModule = require("ui/dialogs");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var viewModel = require("./budget-view-model");
var budget = new viewModel([]);
var expensesViewModel = require("../main/main-view-model");
var expenses = new expensesViewModel.ExpenseListViewModel();
var frameModule = require("ui/frame");
var page;
var subCategories;
var countCategories;
var categories;
var objBudget;

var valueConverter = {
    toView: function (value) {
        var n = value, c = 2, d = ",", t = ".", s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        return 'R$ ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");        
    },
    toModel: function (value) {
        var n = value;
        n = n.replace(' ','');
        n = n.replace('R$', '');
        n = n.replace(',','');
        n = n.replace('.','');
        n = Number(Number(n) / 100);
        return n;
    }
};

var pageData = new observable({
    SubCategoryList: budget,
    SubCategoryNameInput: "",
    SubCategoryBudgetInput: "",
    TotalBudget: "",
    CategoryName: "",
    HintText: ""
});

var sumTotalBudget = function(){
    pageData.set('TotalBudget', 0);
    subCategories.forEach(function(data) {
        pageData.set('TotalBudget',  Number(pageData.get("TotalBudget")) + Number(data["SubCategoryBudget"]));
    });
    return pageData.get("TotalBudget");
};

exports.loaded = function(args) {
    appModule.resources["valueConverter"] = valueConverter;     

    page = args.object;
    page.bindingContext = pageData;
    
    pageData.set('isLoading', true);
    
    countCategories = appsettings.countcategory - 1;
    
    categories = JSON.parse(appsettings.categories);
    categories = categories.result;
    categories.sort(function(a,b){
    	return b['PresentationOrder'] - a['PresentationOrder'];
    });
    
    pageData.set("SubCategoryNameInput", "");
    pageData.set("SubCategoryBudgetInput", "");    
    pageData.set('CategoryName', categories[countCategories]['CategoryName']);
    pageData.set('HintText', categories[countCategories]['HintText']);
    
    switch (countCategories){
        case 0:
            dialogsModule.alert({
              title: "Investimentos",
              message: "Quanto mais melhor :) \n\nOs investimentos é onde o dinheiro começa a trabalhar por você!",
              okButtonText: "OK, Entendi"
            }).then(function () {
            
            });    
        break;
        case 1:
            dialogsModule.alert({
              title: "Gastos Extras",
              message: "Esses são os gastos dispensáveis, ou seja, você pode reduzí-los para melhorar seu orçamento e se aproximar ainda mais de seus objetivos.",
              okButtonText: "OK, Entendi"
            }).then(function () {
            
            });    
        break;
        case 2:
            if (appsettings.messagetoken === 1){
                appsettings.messagetoken = 0;
                dialogsModule.alert({
                  title: "Seja bem-vindo!",
                  message: "Este é o mais novo produto da W1 Finance - O Expense Manager. \n\nEste aplicativo foi criado no intuito de auxiliá-lo no controle dos gastos do dia-a-dia e ajudá-lo a domar as suas finanças pessoais. \n\nNOSSO objetivo é aproximá-lo cada vez mais dos SEUS objetivos de vida.",
                  okButtonText: "Vamos começar"
                }).then(function () {
                    dialogsModule.alert({
                      title: "Cadastre seu orçamento mensal",
                      message: "Este passo é fundamental para a gestão de suas finanças pessoais. \n\nComece cadastrando as categorias e o valor do orçamento que você disponhe mensalmente para suprir suas despesas.",
                      okButtonText: "OK, Entendi"
                    }).then(function () {
                        dialogsModule.alert({
                          title: "Gastos Básicos",
                          message: "Esta é a categoria de gastos indispensáveis em seu orçamento mensal. \n\nSão os gastos essenciais, por exemplo: mercado, moradia, transporte, energia, telefone, internet, etc.",
                          okButtonText: "OK, Entendi"
                        }).then(function () {

                        });                
                    });    
                });
            }else{
                dialogsModule.alert({
                  title: "Gastos Básicos",
                  message: "Esta é a categoria de gastos indispensáveis em seu orçamento mensal. \n\nSão os gastos essenciais, por exemplo: mercado, moradia, transporte, energia, telefone, internet, etc.",
                  okButtonText: "OK, Entendi"
                }).then(function () {

                });                
            };
    };
    
    
    budget.load(categories[countCategories]['Id'])
    .then(function(data) {
        pageData.set('isLoading', false);
        subCategories = data.result;
        pageData.set('TotalBudget', 0);
        if (subCategories.length){ 
            subCategories.forEach(function(data) {
                pageData.SubCategoryList.push({
                    "CategoryID" : data['CategoryID'],
                    "SubCategoryName" : data['SubCategoryName'],
                    "SubCategoryBudget" : data['SubCategoryBudget'],
                    "CategoryName" : data['CategoryName']
                });
                pageData.set('TotalBudget',  Number(pageData.get("TotalBudget")) + Number(data["SubCategoryBudget"]));
            });
    	}else{
            switch (countCategories){
                case 0:
                    pageData.SubCategoryList.push(
                        {
                            "CategoryID" : categories[countCategories]['Id'], 
                            "SubCategoryName" : 'Ações', 
                            "SubCategoryBudget" : 0, 
                            "CategoryName" : categories[countCategories]['CategoryName']
                        },
                        {
                            "CategoryID" : categories[countCategories]['Id'], 
                            "SubCategoryName" : 'Poupança', 
                            "SubCategoryBudget" : 0, 
                            "CategoryName" : categories[countCategories]['CategoryName']
                        }
                    );
                    break;
                case 1:
                    pageData.SubCategoryList.push(
                        {
                            "CategoryID" : categories[countCategories]['Id'], 
                            "SubCategoryName" : 'Cinema', 
                            "SubCategoryBudget" : 0, 
                            "CategoryName" : categories[countCategories]['CategoryName']
                        },
                        {
                            "CategoryID" : categories[countCategories]['Id'], 
                            "SubCategoryName" : 'Restaurantes', 
                            "SubCategoryBudget" : 0, 
                            "CategoryName" : categories[countCategories]['CategoryName']
                        }
                    );
                    break;
                case 2:
                    pageData.SubCategoryList.push(
                        {
                            "CategoryID" : categories[countCategories]['Id'], 
                            "SubCategoryName" : 'Mercado', 
                            "SubCategoryBudget" : 0, 
                            "CategoryName" : categories[countCategories]['CategoryName']
                        },
                        {
                            "CategoryID" : categories[countCategories]['Id'], 
                            "SubCategoryName" : 'Escola', 
                            "SubCategoryBudget" : 0, 
                            "CategoryName" : categories[countCategories]['CategoryName']
                        }
                    );
                    break;
            };
            subCategories = pageData.get('SubCategoryList')._array;
        };
    }, 
    function(error) {
        dialogsModule.alert({
            message: JSON.stringify(error),
            okButtonText: "OK"
        });             
    });
};

exports.addSubCat = function(){
    if (pageData.get("SubCategoryNameInput").trim() !== "" && pageData.get("SubCategoryBudgetInput").trim() !== "") {
        if (pageData.get("SubCategoryBudgetInput") > 0){
            viewModule.getViewById(page, "SubCategoryNameInput").dismissSoftInput();
            viewModule.getViewById(page, "SubCategoryBudgetInput").dismissSoftInput();
            pageData.SubCategoryList.push({
                "CategoryID" : categories[countCategories]['Id'],
                "SubCategoryName" : pageData.get("SubCategoryNameInput"),
                "SubCategoryBudget" : pageData.get("SubCategoryBudgetInput"),
                "CategoryName" : categories[countCategories]['CategoryName']
            });
            subCategories = pageData.get('SubCategoryList')._array;
            pageData.set('TotalBudget',  Number(pageData.get("TotalBudget")) + Number(pageData.get("SubCategoryBudgetInput")));
            pageData.set("SubCategoryNameInput", "");
            pageData.set("SubCategoryBudgetInput", "");        
        }else{
            dialogsModule.alert({
                message: "Informe um valor de orçamento maior que 0.",
                okButtonText: "OK"
            });            
        };
    }else{
        dialogsModule.alert({
            message: "Especifique uma categoria de gasto e um orçamento para controle.",
            okButtonText: "OK"
        });
    };
};

exports.delSubCat = function(args) { 
    var item = args.view.bindingContext;
    var index = pageData.SubCategoryList.indexOf(item);
    pageData.set('TotalBudget',  Number(pageData.get("TotalBudget")) - Number(item["SubCategoryBudget"]));
    pageData.SubCategoryList.splice(index,1);
    subCategories = pageData.get('SubCategoryList')._array;
};

exports.save = function() {
    var check = true; 
    subCategories.forEach(function(data) {
        if (data['SubCategoryBudget'] == 0){
            check = false;		    
        };
    });
    if (check){
        budget.deleteAll(categories[countCategories]['Id'])
        .then(function(data){
            budget.addAll(subCategories)
            .then(function(data){
                expenses.resume_yearmonth(new Date())
                .then(function(data) {
                    objBudget = {
                        idCategory: categories[countCategories]['Id'], 
                        categoryName: categories[countCategories]['CategoryName'],
                        totalBudget: sumTotalBudget(), 
                        totalExpense: searchArray('CategoryID', categories[countCategories]['Id'], data.result, 'TotalExpense'), 
                        weeklyBudget: {
                            1: 0, 
                            2: 0, 
                            3: 0, 
                            4: 0
                        }, 
                        subCategories: subCategories
                    };
                    if (subCategories.length){
                        frameModule.topmost().navigate({
                            moduleName: "views/apportionment/apportionment", 
                            context: {
                                count_category: countCategories,
                                budget: objBudget
                            },
                            clearHistory: false
                        });
                    }else{
                        switch (countCategories){
                            case 0:
                                appsettings.investimentCategoryBudget = JSON.stringify(objBudget);
                                break;
                            case 1:
                                appsettings.extraCategoryBudget = JSON.stringify(objBudget);
                                break; 
                            case 2:
                                appsettings.basicCategoryBudget = JSON.stringify(objBudget);
                                break;
                        };
                        if (countCategories !== 0){
                            appsettings.countcategory = countCategories;
                            frameModule.topmost().navigate({
                                moduleName: "views/budget/budget", 
                            });
                        }else{
                            appsettings.countcategory = categories.length;                  

                            if (appsettings.registered === false){
                                dialogsModule.confirm({
                                  title: "Pronto!",
                                  message: "Seu orçamento está concluído :) \n\nSugerimos que neste momento efetue o cadastro para evitar perder suas informações no futuro.",
                                  okButtonText: "Cadastrar",
                                  cancelButtonText: "Mais tarde",
                                }).then(function (result) {
                                    if (result){
                                        frameModule.topmost().navigate({
                                        moduleName: "views/register/register", 
                                        clearHistory: true
                                        });                                        
                                    }else{
                                        frameModule.topmost().navigate({
                                        moduleName: "views/cockpit/cockpit", 
                                        clearHistory: true
                                        });                                                              
                                    };
                                });                           
                            }else{
                                frameModule.topmost().navigate({
                                    moduleName: "views/cockpit/cockpit", 
                                    clearHistory: true
                                });                            
                            };
                         };                    
                    };
                }, 
                function(error) {
                    dialogsModule.alert({
                        message: JSON.stringify(error),
                        okButtonText: "OK"
                    });             
                });
            }, 
            function(error){
                dialogsModule.alert({
                    message: JSON.stringify(error),
                    okButtonText: "OK"
                });             
            });
        }, 
        function(error){
            dialogsModule.alert({
                message: JSON.stringify(error),
                okButtonText: "OK"
            });             
        });
    }else{
        dialogsModule.alert({
            message: 'Existe categoria com orçamento R$ 0,00. Por favor, adicione um valor ou exclua a categoria.',
            okButtonText: "OK"
        });			            
    };
};

function searchArray(searchkey, data, myArray, resultkey){
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][searchkey] === data) {
            return myArray[i][resultkey];
        };
    };
    return 0;
};
