var appModule = require("application");
var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var appsettings = require("../../utils/appsettings");
var expense = [];
var page;
var expenseActNper;
var paymentType;
var expenseField;
var CreditCardDueDay;
var objBasicBudget;
var objExtraBudget;
var objInvestimentBudget;
var expensePayDay;

var pageData = new Observable({
    expenseValue: "",
    expenseDate: "",
    expenseLgDesc: "",
    expenseSmDesc: "",
    expenseSubCategory: "",
    expenseInstallment: "",
    expenseCreditCard: ""
});

var firstPaymentDate = function(){
    if (paymentType.selectedIndex){
        if (parseInt((nextCreditCardPayDay() - pageData.get("expenseDate"))/1000/60/60/24) > 10){
            return new Date(nextCreditCardPayDay().getFullYear(), nextCreditCardPayDay().getMonth(), CreditCardDueDay)
        }else{
            return new Date(nextCreditCardPayDay().getFullYear(), nextCreditCardPayDay().getMonth() + 1, CreditCardDueDay)
        }
    }else{
        return pageData.get('expenseDate');
    };
};

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
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");        
    },
    toModel: function (value) {
        var n = value;
        n = n.replace(' ','');
        n = n.replace('R$', '');
        n = n.replace(',','');
        n = n.replace('.','');
        n = parseInt(n) / 100;
        return n;
    }
};

exports.loaded = function(args) {
    appModule.resources["dateConverter"] = dateConverter;     
    appModule.resources["valueConverter"] = valueConverter;     

    page = args.object;
    page.bindingContext = pageData;
    
    objBasicBudget = JSON.parse(appsettings.basicCategoryBudget);
    objExtraBudget = JSON.parse(appsettings.extraCategoryBudget);
    objInvestimentBudget = JSON.parse(appsettings.investimentCategoryBudget);
    
    if (page.navigationContext.new){
        page.navigationContext.new = false;
        pageData.set('expenseSubCategory', 'Subcategoria: ' +  page.navigationContext.subCategoryName);
        pageData.set('expenseValue', "");
        pageData.set('expenseDate', new Date());
        pageData.set('expenseLgDesc', "");
        pageData.set('expenseSmDesc', "");
        pageData.set('expenseInstallment', 1);
        pageData.set('expenseCreditCard', "");
        paymentType = viewModule.getViewById(page, 'expenseOrigin');
        expenseField = viewModule.getViewById(page, 'expenseValue');
    };
    
    paymentType.on(Observable.propertyChangeEvent, function(data){
        if (paymentType.selectedIndex){
            viewModule.getViewById(page, 'expenseCreditCardLabel').visibility = "visible";
            viewModule.getViewById(page, 'expenseCreditCard').visibility = "visible";
            viewModule.getViewById(page, 'editCreditCard').visibility = "visible";
            viewModule.getViewById(page, 'expenseInstallmentLabel').visibility = "visible";
            viewModule.getViewById(page, 'expenseInstallment').visibility = "visible";
            viewModule.getViewById(page, 'editInstallment').visibility = "visible";
            goCreditCard();
        }else{
            viewModule.getViewById(page, 'expenseCreditCardLabel').visibility = "collapsed";
            viewModule.getViewById(page, 'expenseCreditCard').visibility = "collapsed";
            viewModule.getViewById(page, 'editCreditCard').visibility = "collapsed";
            viewModule.getViewById(page, 'expenseInstallmentLabel').visibility = "collapsed";
            viewModule.getViewById(page, 'expenseInstallment').visibility = "collapsed";
            viewModule.getViewById(page, 'editInstallment').visibility = "collapsed";
            pageData.set('expenseInstallment', 1);
            pageData.set('expenseCreditCard', "");
        }
    });
    
//    expenseField.on(Observable.propertyChangeEvent, function(data){
//
//    });
};

exports.add = function() {
    if (pageData.get("expenseValue").trim() !== "" && pageData.get("expenseValue") > 0) {
        viewModule.getViewById(page, "expenseValue").dismissSoftInput();
        expense = appsettings.expenses;
        expense ? expense = JSON.parse(expense) : expense = [];
        
        for (var i = 1; i <= pageData.get("expenseInstallment"); i++){ 
            expensePayDay = new Date(firstPaymentDate().getFullYear(), firstPaymentDate().getMonth() - 1 + i, firstPaymentDate().getDate(),0,0,0,0);
            
            expense.push({
                'CategoryID' : page.navigationContext.categoryID,
                'SubCategoryID' : page.navigationContext.subCategoryID,
                'ExpenseValue' : pageData.get("expenseValue") / pageData.get("expenseInstallment"),
                'ExpenseOrigin' : paymentType.selectedIndex ? pageData.get("expenseCreditCard") : "Pagto. à Vista" ,
                'ActualNPer' : i,
                'TotalNPer' : pageData.get("expenseInstallment"),
                'EventDate' : expensePayDay,
                'LongDescription' : pageData.get("expenseLgDesc"),
                'SmallDescription' : pageData.get("expenseSmDesc").trim() == "" ? page.navigationContext.subCategoryName : pageData.get("expenseSmDesc"),
                'YearMonth' : new Date(firstPaymentDate().getFullYear(), firstPaymentDate().getMonth() - 1 + i, 1,0,0,0,0),
                'CategoryName' : page.navigationContext.categoryName,
                'SubCategoryName' : page.navigationContext.subCategoryName
            });
            if (expensePayDay <= new Date() && expensePayDay.getFullYear() >= new Date().getFullYear() && expensePayDay.getMonth() >= new Date().getMonth()){
                switch(page.navigationContext.categoryID) {
                    case objBasicBudget.idCategory:
                        objBasicBudget.totalExpense += pageData.get("expenseValue") / pageData.get("expenseInstallment");       
                        appsettings.basicCategoryBudget = JSON.stringify(objBasicBudget);
                        break;
                    case objExtraBudget.idCategory:
                        objExtraBudget.totalExpense += pageData.get("expenseValue") / pageData.get("expenseInstallment");
                        appsettings.extraCategoryBudget = JSON.stringify(objExtraBudget);
                        break;
                    case objInvestimentBudget.idCategory:
                        objInvestimentBudget.totalExpense += pageData.get("expenseValue") / pageData.get("expenseInstallment");
                        appsettings.investimentCategoryBudget = JSON.stringify(objInvestimentBudget);    
                };
            };
        };
        appsettings.expenses = JSON.stringify(expense);
        
        var x = appsettings.expensecounter;
        x += pageData.get("expenseInstallment");
        appsettings.expensecounter = x;
        dialogsModule.alert({
            message: "Gasto incluído com sucesso. Obrigado :)",
            okButtonText: "OK"
        });        
        frameModule.topmost().navigate({
            moduleName: "views/cockpit/cockpit",
            clearHistory: true
        });
    }else{
        dialogsModule.alert({
            message: "Informe o valor do gasto, maior que 0,00.",
            okButtonText: "OK"
        });
    };
};

exports.goBack = function(){
    frameModule.topmost().navigate({
        moduleName: "views/cockpit/cockpit", 
        clearHistory: true
    });
};

exports.goDatePicker = function(){
    frameModule.topmost().navigate({
        moduleName: "views/inputexpense/date-picker-pop-up",
        context: {
            data: new DatePickerViewModel(new Date(pageData.get('expenseDate')), function (selectedData) {
                pageData.set('expenseDate', selectedData);
            })
        }
    });
};

function goCreditCard(){
    if (appsettings.creditcards){
        frameModule.topmost().navigate({
            moduleName: "views/inputexpense/credit-card-pop-up",
            context: {
                data: new CreditCardViewModel(JSON.parse(appsettings.creditcards), function (selectedData) {
                    pageData.set('expenseCreditCard', selectedData);
                    CreditCardDueDay = searchArray('creditCardName', selectedData, JSON.parse(appsettings.creditcards), 'creditCardDueDay');
                })
            }
        });
    }else{
        dialogsModule.confirm({
          title: "Aviso",
          message: "Não existem cartões de crédito cadastrados. \n\nDeseja cadastrar agora?",
          okButtonText: "Cadastrar",
          cancelButtonText: "Mais tarde",
        }).then(function (result) {
            if (result){
                frameModule.topmost().navigate({
                moduleName: "views/creditcards/creditcards", 
                clearHistory: true
                });                                        
            }else{
                viewModule.getViewById(page, 'expenseCreditCardLabel').visibility = "collapsed";
                viewModule.getViewById(page, 'expenseCreditCard').visibility = "collapsed";
                viewModule.getViewById(page, 'expenseInstallmentLabel').visibility = "collapsed";
                viewModule.getViewById(page, 'expenseInstallment').visibility = "collapsed";
                pageData.set('expenseInstallment', 1);
                pageData.set('expenseCreditCard', "");
                paymentType.selectedIndex = 0;
            };
        });     
    };
};

exports.goCreditCard = goCreditCard;

function goInstallment(){
    frameModule.topmost().navigate({
        moduleName: "views/inputexpense/installment-pop-up",
        context: {
            data: new InstallmentViewModel([1,2,3,4,5,6,7,8,9,10,11,12], function (selectedData) {
                pageData.set('expenseInstallment', selectedData);
            })
        }
    });
};

exports.goInstallment = goInstallment;

function DatePickerViewModel(data, callback){
    this.day = data.getDate();
    this.month = data.getMonth() + 1;
    this.year = data.getFullYear();
    this._callback = callback;
};

DatePickerViewModel.prototype.done = function () {
    this._callback(new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0));
    paymentType.off(Observable.propertyChangeEvent);            
    frameModule.topmost().goBack();
};

function CreditCardViewModel(data, callback){
    this.creditCardList = function() {
        var list = [];
        data.forEach(function(args){
            list.push(args.creditCardName);
        });
        return list;
    };
    this._callback = callback;
};

CreditCardViewModel.prototype.done = function (data) {
    this._callback(data);
    paymentType.off(Observable.propertyChangeEvent);            
    frameModule.topmost().goBack();
};

function InstallmentViewModel(data, callback){
    this.installmentList = data;
    this._callback = callback;
};

InstallmentViewModel.prototype.done = function (data) {
    this._callback(data);
    paymentType.off(Observable.propertyChangeEvent);            
    frameModule.topmost().goBack();
};

function searchArray(searchkey, data, myArray, resultkey){
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][searchkey] === data) {
            return myArray[i][resultkey];
        };
    };
};

function nextCreditCardPayDay(){
    var currentMonthPayDay = new Date(pageData.get("expenseDate").getFullYear(), pageData.get("expenseDate").getMonth(), CreditCardDueDay);
    if (pageData.get("expenseDate") > currentMonthPayDay){
        return new Date(pageData.get("expenseDate").getFullYear(), pageData.get("expenseDate").getMonth() + 1, CreditCardDueDay);
    }else{
        return currentMonthPayDay;
    };
};