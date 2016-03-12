var appModule = require("application");
var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var viewModel = require("../main/main-view-model");
var history = new viewModel.ExpenseListViewModel();
var page;
var objBasicBudget;
var objExtraBudget;
var objInvestimentBudget;
var basicExpenseValue;
var extraExpenseValue;
var investimentExpenseValue;

var dateConverter = {
    toView: function (value, format) {
        var monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];        
        var result = format;
        var day = value.getDate();
        result = result.replace("DD", day < 10 ? "0" + day : day);
        var month = monthNames[value.getMonth()];
        result = result.replace("MMM", month);
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

var pageData = new observable({
    resumeExpensesList : history,
    message: ''
});


exports.loaded = function(args) {

    appModule.resources["dateConverter"] = dateConverter;     
    
    page = args.object;
    page.bindingContext = pageData;
    
    pageData.set('message', '');
    viewModule.getViewById(page, 'message').visibility = "collapsed";    
    
    pageData.set('isLoading', true);
    
    objBasicBudget = JSON.parse(appsettings.basicCategoryBudget);
    objExtraBudget = JSON.parse(appsettings.extraCategoryBudget);
    objInvestimentBudget = JSON.parse(appsettings.investimentCategoryBudget);        

    history.resume_each_yearmonth()
    .then(function(data){
        if (data.result.length) {
            data.result.DateToNumber();
            data.result.unique().forEach(function(yearmonth){
                basicExpenseValue = searchArray('CategoryID', objBasicBudget.idCategory, 'YearMonth', yearmonth, data.result, 'TotalExpense');
                extraExpenseValue = searchArray('CategoryID', objExtraBudget.idCategory, 'YearMonth', yearmonth, data.result, 'TotalExpense');
                investimentExpenseValue = searchArray('CategoryID', objInvestimentBudget.idCategory, 'YearMonth', yearmonth, data.result, 'TotalExpense');

                pageData.resumeExpensesList.push({
                        YearMonth: new Date(yearmonth),
                        basicCategoryLabel: valueConverter.toView(basicExpenseValue) + ' / ' + valueConverter.toView(objBasicBudget.totalBudget),
                        extraCategoryLabel: valueConverter.toView(extraExpenseValue) + ' / ' + valueConverter.toView(objExtraBudget.totalBudget),
                        investimentCategoryLabel: valueConverter.toView(investimentExpenseValue) + ' / ' + valueConverter.toView(objInvestimentBudget.totalBudget),
                        basicCategoryBar: basicExpenseValue / objBasicBudget.totalBudget * 100 || 0,
                        extraCategoryBar: extraExpenseValue / objExtraBudget.totalBudget * 100 || 0,
                        investimentCategoryBar: investimentExpenseValue / objInvestimentBudget.totalBudget * 100 || 0,
                        classBasicBar: (basicExpenseValue / objBasicBudget.totalBudget * 100 || 0) > 100 ? 'progress-categories-red' : 'progress-categories-blue',
                        classExtraBar: (extraExpenseValue / objExtraBudget.totalBudget * 100 || 0) > 100 ? 'progress-categories-red' : 'progress-categories-blue',
                        classInvestimentBar: (investimentExpenseValue / objInvestimentBudget.totalBudget * 100 || 0) > 100 ? 'progress-categories-green' : 'progress-categories-blue'
                });
            });
            pageData.resumeExpensesList.sort(function(a,b){
    	       return b['YearMonth'] - a['YearMonth'];
            });
        }else{
            pageData.set('message', 'Não existem dados históricos para consulta, continue efetuando o registro de seus gastos.');
            viewModule.getViewById(page, 'message').visibility = "visible";            
        };
        pageData.set('isLoading', false);
    },
    function(error){
        pageData.set('isLoading', false);
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

exports.basicExpenseList = function(args){
    var item = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-list",
        context: {
            yearmonth: item.YearMonth,
            category_id: objBasicBudget.idCategory,
            category: objBasicBudget.categoryName
        }
    });       
};

exports.extraExpenseList = function(args){
    var item = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-list",
        context: {
            yearmonth: item.YearMonth,
            category_id: objExtraBudget.idCategory,
            category: objExtraBudget.categoryName
        }
    });       
};

exports.investimentExpenseList = function(args){
    var item = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-list",
        context: {
            yearmonth: item.YearMonth,
            category_id: objInvestimentBudget.idCategory,
            category: objInvestimentBudget.categoryName
        }
    }); 
};

function searchArray(searchkey1, data1, searchkey2, data2, myArray, resultkey){
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][searchkey1] === data1 && myArray[i][searchkey2] === data2) {
            return myArray[i][resultkey];
        };
    };
    return 0;
};

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    };
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i]['YearMonth'])) {
            arr.push(this[i]['YearMonth']);
        };
    };
    return arr; 
};

Array.prototype.DateToNumber = function(){
    for(var i = 0; i < this.length; i++) {
        this[i]['YearMonth'] = Number(this[i]['YearMonth']);
    };
};
