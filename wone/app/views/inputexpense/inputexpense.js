var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var appsettings = require("../../utils/appsettings");
var expense = [];
var page;
var expenseActNper;
var paymentType;
var CreditCardDueDay;

var pageData = new Observable({
    expenseValue: "",
    expenseDate: "",
    expenseLgDesc: "",
    expenseSmDesc: "",
    expenseSubCategory: "",
    expenseInstallment: "",
    expenseCreditCard: ""
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;
    
    if (page.navigationContext.new){
        page.navigationContext.new = false;
        pageData.set('expenseSubCategory', 'Categoria: ' +  page.navigationContext.subCategoryName);
        pageData.set('expenseValue', "");
        pageData.set('expenseDate', new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
        pageData.set('expenseLgDesc', "");
        pageData.set('expenseSmDesc', "");
        pageData.set('expenseInstallment', 1);
        pageData.set('expenseCreditCard', "");

        //viewModule.getViewById(page, 'expenseCreditCardLabel').visibility = "collapsed";
        //viewModule.getViewById(page, 'expenseCreditCard').visibility = "collapsed";
        //viewModule.getViewById(page, 'expenseInstallmentLabel').visibility = "collapsed";
        //viewModule.getViewById(page, 'expenseInstallment').visibility = "collapsed";
        
        paymentType = viewModule.getViewById(page, 'expenseOrigin');
    };
    
    paymentType.on(Observable.propertyChangeEvent, function(data){
        if (paymentType.selectedIndex){
            viewModule.getViewById(page, 'expenseCreditCardLabel').visibility = "visible";
            viewModule.getViewById(page, 'expenseCreditCard').visibility = "visible";
            viewModule.getViewById(page, 'expenseInstallmentLabel').visibility = "visible";
            viewModule.getViewById(page, 'expenseInstallment').visibility = "visible";
            goCreditCard();
        }else{
            viewModule.getViewById(page, 'expenseCreditCardLabel').visibility = "collapsed";
            viewModule.getViewById(page, 'expenseCreditCard').visibility = "collapsed";
            viewModule.getViewById(page, 'expenseInstallmentLabel').visibility = "collapsed";
            viewModule.getViewById(page, 'expenseInstallment').visibility = "collapsed";
            pageData.set('expenseInstallment', 1);
            pageData.set('expenseCreditCard', "");
        }
    });
    
    /*while (pageData.creditCardList.length) {
        pageData.creditCardList.pop();
    };
    
    if (appsettings.creditcards){
        creditCards = JSON.parse(appsettings.creditcards);
        creditCards.forEach(function(data){
            pageData.creditCardList.push(data.creditCardName);        
        });
    };*/
};

exports.add = function() {
    if (pageData.get("expenseValue").trim() !== "" && pageData.get("expenseSmDesc").trim() !== "") {
        viewModule.getViewById(page, "expenseValue").dismissSoftInput();
        expense = appsettings.expenses;
        expense ? expense = JSON.parse(expense) : expense = [];
        
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
        for (var i = 1; i <= pageData.get("expenseInstallment"); i++){ 
            expense.push({
                'CategoryID' : page.navigationContext.categoryID,
                'SubCategoryID' : page.navigationContext.subCategoryID,
                'ExpenseValue' : pageData.get("expenseValue") / pageData.get("expenseInstallment"),
                'ExpenseOrigin' : paymentType.selectedIndex ? pageData.get("expenseCreditCard") : "Pagto. à Vista" ,
                'ActualNPer' : i,
                'TotalNPer' : pageData.get("expenseInstallment"),
                'EventDate' : new Date(firstPaymentDate().getFullYear(), firstPaymentDate().getMonth() - 1 + i, firstPaymentDate().getDate()),
                'LongDescription' : pageData.get("expenseLgDesc"),
                'SmallDescription' : pageData.get("expenseSmDesc")
            });
        };
        appsettings.expenses = JSON.stringify(expense);
        var x = appsettings.expensecounter;
        x += pageData.get("expenseInstallment");
        appsettings.expensecounter = x;
        frameModule.topmost().navigate({
            moduleName: "views/cockpit/cockpit",
            clearHistory: true
        });
    }else{
        dialogsModule.alert({
            message: "Informe no mínimo qual foi o gasto e o valor.",
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
    frameModule.topmost().navigate({
        moduleName: "views/inputexpense/credit-card-pop-up",
        context: {
            data: new CreditCardViewModel(JSON.parse(appsettings.creditcards), function (selectedData) {
                pageData.set('expenseCreditCard', selectedData);
                CreditCardDueDay = searchArray('creditCardName', selectedData, JSON.parse(appsettings.creditcards), 'creditCardDueDay');
            })
        }
    });
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
 
