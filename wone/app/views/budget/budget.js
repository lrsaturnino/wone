var appsettings = require("../../utils/appsettings");
var dialogsModule = require("ui/dialogs");
var observable = require("data/observable");
var viewModule = require("ui/core/view");
var viewModel = require("./budget-view-model");
var budget = new viewModel([]);
var frameModule = require("ui/frame");
var page;
var subCategories;
var countCategories;
var categories;

var pageData = new observable.Observable({
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
    page = args.object;
    page.bindingContext = pageData;
    countCategories = appsettings.countcategory - 1;
    categories = JSON.parse(appsettings.categories);
    categories = categories.result;
    categories.sort(function(a,b){
    	return b['PresentationOrder'] - a['PresentationOrder'];
    });
    pageData.set('CategoryName', categories[countCategories]['CategoryName']);
    pageData.set('HintText', categories[countCategories]['HintText']);
    budget.load(categories[countCategories]['Id'])
    .then(function(data) {
        subCategories = data.result;
        pageData.set('TotalBudget', 0);
        if (subCategories.length){ 
            subCategories.forEach(function(data) {
                pageData.SubCategoryList.push({
                    "CategoryID" : data['CategoryID'],
                    "SubCategoryName" : data['SubCategoryName'],
                    "SubCategoryBudget" : data['SubCategoryBudget']
                });
                pageData.set('TotalBudget',  Number(pageData.get("TotalBudget")) + Number(data["SubCategoryBudget"]));
            });
    	}else{
            switch (countCategories){
                case 0:
                    pageData.SubCategoryList.push(
                        {"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Ações', "SubCategoryBudget" : 0},
                        //{"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Fundos de Investimento', "SubCategoryBudget" : 0},
                        //{"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Tesouro Direto', "SubCategoryBudget" : 0},
                        {"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Poupança', "SubCategoryBudget" : 0}
                    );
                    break;
                case 1:
                    pageData.SubCategoryList.push(
                        {"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Cinema', "SubCategoryBudget" : 0},
                        //{"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Lazer', "SubCategoryBudget" : 0},
                        //{"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Shopping', "SubCategoryBudget" : 0},
                        {"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Restaurantes', "SubCategoryBudget" : 0}
                    );
                    break;
                case 2:
                    pageData.SubCategoryList.push(
                        {"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Mercado', "SubCategoryBudget" : 0},
                        //{"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Transporte', "SubCategoryBudget" : 0},
                        //{"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Moradia', "SubCategoryBudget" : 0},
                        {"CategoryID" : categories[countCategories]['Id'], "SubCategoryName" : 'Escola', "SubCategoryBudget" : 0}
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
        viewModule.getViewById(page, "SubCategoryNameInput").dismissSoftInput();
        viewModule.getViewById(page, "SubCategoryBudgetInput").dismissSoftInput();
        pageData.SubCategoryList.push({
            "CategoryID" : categories[countCategories]['Id'],
            "SubCategoryName" : pageData.get("SubCategoryNameInput"),
            "SubCategoryBudget" : pageData.get("SubCategoryBudgetInput")            
        });
        subCategories = pageData.get('SubCategoryList')._array;
        pageData.set('TotalBudget',  Number(pageData.get("TotalBudget")) + Number(pageData.get("SubCategoryBudgetInput")));
        pageData.set("SubCategoryNameInput", "");
        pageData.set("SubCategoryBudgetInput", "");
    }else{
        dialogsModule.alert({
            message: "Especifique uma categoria de gasto e um orçamento para controle.",
            okButtonText: "OK"
        });
    }
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
                var budgetObj = {idcategory: categories[countCategories]['Id'],totalbudget: sumTotalBudget(), weeklybudget: {1: 0, 2: 0, 3: 0, 4: 0}};
                frameModule.topmost().navigate({
                    moduleName: "views/apportionment/apportionment", 
                    context: {
                        id_category: categories[countCategories]['Id'],
                        count_category: countCategories,
                        budget: budgetObj
                    },
                    clearHistory: false
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

exports.sumTotalBudget = sumTotalBudget;

