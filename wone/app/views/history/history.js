var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var viewModel = require("../main/main-view-model");
var history = new viewModel.ExpenseListViewModel();
var page;
var historyView;
var objBasicBudget;
var objExtraBudget;
var objInvestimentBudget;
var YearMonth;

var pageData = new observable({
    items : ''
});


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData
    
    pageData.set('items', '');
    historyView= [];
    
    objBasicBudget = JSON.parse(appsettings.basicCategoryBudget);
    objExtraBudget = JSON.parse(appsettings.extraCategoryBudget);
    objInvestimentBudget = JSON.parse(appsettings.investimentCategoryBudget);        
    
    history.yearmonths()
    .then(function(data){
        data.result.forEach(function(data){
            YearMonth = data.YearMonth;    
            history.resume_yearmonth(YearMonth)
            .then(function(data){
                historyView.push(
                    {
                        YearMonth: data.result[0]['YearMonth'], 
                        basicCategoryLabel: searchArray('CategoryID', objBasicBudget.idCategory, data.result, 'TotalExpense') + '/' + objBasicBudget.totalBudget,
                        extraCategoryLabel: searchArray('CategoryID', objExtraBudget.idCategory, data.result, 'TotalExpense') + '/' + objExtraBudget.totalBudget,
                        investimentCategoryLabel: searchArray('CategoryID', objInvestimentBudget.idCategory, data.result, 'TotalExpense') + '/' + objInvestimentBudget.totalBudget,
                        basicCategoryBar: searchArray('CategoryID', objBasicBudget.idCategory, data.result, 'TotalExpense') / objBasicBudget.totalBudget * 100 || 0,
                        extraCategoryBar: searchArray('CategoryID', objExtraBudget.idCategory, data.result, 'TotalExpense') / objExtraBudget.totalBudget * 100 || 0,
                        investimentCategoryBar: searchArray('CategoryID', objInvestimentBudget.idCategory, data.result, 'TotalExpense') / objInvestimentBudget.totalBudget * 100 || 0
                    }
                ); 
                pageData.set('items', historyView);
            },
            function(error){
                
            });
        });
    },
    function(error){
    
    });
};

exports.goBack = function(){
    frameModule.topmost().goBack();
};

function searchArray(searchkey, data, myArray, resultkey){
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][searchkey] === data) {
            return myArray[i][resultkey];
        };
    };
    return 0;
};