var appModule = require("application");
var appsettings = require("../../utils/appsettings");
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

var pageData = new observable({
    expensesList : history,
    category: '',
    message: ''
});


exports.loaded = function(args) {

    appModule.resources["dateConverter"] = dateConverter;     
    appModule.resources["valueConverter"] = valueConverter;     
    
    page = args.object;
    page.bindingContext = pageData;
    
    pageData.set('isLoading', true);
    pageData.set('category', page.navigationContext.category);
    pageData.set('message', '');
    viewModule.getViewById(page, 'message').visibility = "collapsed";

    history.all_by_yearmonth_category(page.navigationContext.yearmonth, page.navigationContext.category_id)
    .then(function(data){
        if (data.result.length){
            pageData.expensesList.push(data.result);
        }else{
            pageData.set('message', 'Não existem gastos para essa categoria neste mês.');
            viewModule.getViewById(page, 'message').visibility = "visible";
        };
        pageData.set('isLoading', false);
    },
    function(error){
        pageData.set('isLoading', false);
        console.log(JSON.stringify(error));
    });
};

exports.goBack = function(){
    frameModule.topmost().goBack();
};

exports.expenseDetail = function(args){
    var item = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-detail",
        context: {
            expense: item
        }
    }); 
};