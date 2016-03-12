var appModule = require("application");
var appsettings = require("../../utils/appsettings");
var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var viewModel = require("../main/main-view-model");
var history = new viewModel.ExpenseListViewModel();
var page;

var dateConverter = {
    toView: function (value, format) {
        var result = format;
        var day = value.getDate();
        result = result.replace("DD", day < 10 ? "0" + day : day);
        var month = value.getMonth() + 1;
        result = result.replace("MM", month < 10 ? "0" + month : month);
        result = result.replace("YYYY", value.getFullYear());
        return result;
    },
    toModel: function (value, format) {
        var ddIndex = format.indexOf("DD");
        var day = parseInt(value.substr(ddIndex, 2));
        var mmIndex = format.indexOf("MM");
        var month = parseInt(value.substr(mmIndex, 2));
        var yyyyIndex = format.indexOf("YYYY");
        var year = parseInt(value.substr(yyyyIndex, 4));
        var result = new Date(year, month - 1, day);
        return result;
    }
};

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

var pageData = new observable({});


exports.loaded = function(args) {

    appModule.resources["dateConverter"] = dateConverter;     
    appModule.resources["valueConverter"] = valueConverter;     
    
    page = args.object;
    page.bindingContext = pageData;
    
    objBasicBudget = JSON.parse(appsettings.basicCategoryBudget);
    objExtraBudget = JSON.parse(appsettings.extraCategoryBudget);
    objInvestimentBudget = JSON.parse(appsettings.investimentCategoryBudget);            
    
    console.log(JSON.stringify(objBasicBudget));
    
    pageData.set('SmallDescription', page.navigationContext.expense.SmallDescription)
    pageData.set('ExpenseValue', page.navigationContext.expense.ExpenseValue)
    pageData.set('ExpenseOrigin', page.navigationContext.expense.ExpenseOrigin)
    pageData.set('ActualNPer', page.navigationContext.expense.ActualNPer)
    pageData.set('TotalNPer', page.navigationContext.expense.TotalNPer)
    pageData.set('EventDate', page.navigationContext.expense.EventDate)
    pageData.set('LongDescription', page.navigationContext.expense.LongDescription)
};

exports.delete = function(){
    history.delete_expense(page.navigationContext.expense.Id)
    .then(function(data){
        
        if (Number(page.navigationContext.expense.YearMonth) === Number(new Date(new Date().getFullYear(), new Date().getMonth(), 1))){
            switch (page.navigationContext.expense.CategoryID) {
                case objBasicBudget.idCategory:
                    objBasicBudget.totalExpense -= page.navigationContext.expense.ExpenseValue;
                    break;
                case objExtraBudget.idCategory:
                    objExtraBudget.totalExpense -= page.navigationContext.expense.ExpenseValue;
                    break;
                case objInvestimentBudget.idCategory:
                    objInvestimentBudget.totalExpense -= page.navigationContext.expense.ExpenseValue;
                    break;
            };
            appsettings.basicCategoryBudget = JSON.stringify(objBasicBudget);
            appsettings.extraCategoryBudget = JSON.stringify(objExtraBudget);
            appsettings.investimentCategoryBudget = JSON.stringify(objInvestimentBudget);
        };
        
        dialogsModule.alert({
            message: "Gasto excluído com sucesso!",
            okButtonText: "OK"
        });        
        frameModule.topmost().goBack();    
    },
    function(error){
        dialogsModule.alert({
            message: "Ops! Tivemos uma falha. Erro: (" + JSON.stringify(error) + ")",
            okButtonText: "OK"
        }); 
        frameModule.topmost().goBack();    
    });
};

exports.goBack = function(){
    frameModule.topmost().goBack();
};