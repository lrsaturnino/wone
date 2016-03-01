var appsettings = require("../../utils/appsettings");
var dialogsModule = require("ui/dialogs");
var observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var frameModule = require("ui/frame");
var page;
var creditCards = [];

var pageData = new observable({
    creditCardList: new observableArrayModule.ObservableArray(),
    inputCreditCardName: "",
    inputCreditCardDueDay: ""
});

exports.loaded = function(args){
    page = args.object;
    page.bindingContext = pageData;
    
    pageData.set('inputCreditCardName', '');
    pageData.set('inputCreditCardDueDay', '');
    
    while (pageData.creditCardList.length) {
        pageData.creditCardList.pop();
    };
    
    if (appsettings.creditcards){
        pageData.creditCardList.push(JSON.parse(appsettings.creditcards));
        creditCards = pageData.get('creditCardList')._array;
    };
};

exports.addCreditCard = function(){
    if (pageData.get("inputCreditCardName").trim() !== "" && pageData.get("inputCreditCardDueDay").trim() !== "") {
        if (Number.isInteger(Number(pageData.get("inputCreditCardDueDay"))) && pageData.get("inputCreditCardDueDay") >= 1 && pageData.get("inputCreditCardDueDay") <= 31){
            viewModule.getViewById(page, "inputCreditCardName").dismissSoftInput();
            viewModule.getViewById(page, "inputCreditCardDueDay").dismissSoftInput();
            pageData.creditCardList.push({
                "creditCardName" : pageData.get("inputCreditCardName"),
                "creditCardDueDay" : pageData.get("inputCreditCardDueDay")            
            });
            creditCards = pageData.get('creditCardList')._array;
            pageData.set("inputCreditCardName", "");
            pageData.set("inputCreditCardDueDay", "");        
        }else{
            dialogsModule.alert({
                message: "Verifique o dia do vencimento de seu cartão de crédito. Digite apenas números inteiros (0 - 31).",
                okButtonText: "OK"
            });
            pageData.set('inputCreditCardDueDay', '');
        };
    }else{
        dialogsModule.alert({
            message: "Especifique um cartão de crédito.",
            okButtonText: "OK"
        });
    };
};

exports.delCreditCard = function(args){ 
    var item = args.view.bindingContext;
    var index = pageData.creditCardList.indexOf(item);
    pageData.creditCardList.splice(index,1);
    creditCards = pageData.get('creditCardList')._array;
};

exports.save = function(){
    if (creditCards.length){
        appsettings.creditcards = JSON.stringify(creditCards);
    }else{
        appsettings.creditcards = "";
    };
    frameModule.topmost().navigate({
        moduleName: "views/cockpit/cockpit"
    });
};

exports.goBack = function(){
    frameModule.topmost().navigate({
        moduleName: "views/cockpit/cockpit"
    });
};