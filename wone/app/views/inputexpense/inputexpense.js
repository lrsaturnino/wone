var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var observableArrayModule = require("data/observable-array");
var viewModule = require("ui/core/view");
var appsettings = require("../../utils/appsettings");
var viewmodel = require("./input-expense-view-model");
var expense = new viewmodel([]);
var page;

var pageData = new Observable({
    expenseValue: "",
    expenseOrigin: "Pagto. à vista",
    expenseActNper: 1,
    expenseTotNPer: 1,
    expenseDate: new Date(),
    expenseLgDesc: "",
    expenseSmDesc: "",
    expenseSubCat: '',
    expenseCat: ''
});

exports.loaded = function(args) {
    page = args.object;
    pageData.set('expenseSubCat',page.navigationContext)
    page.bindingContext = pageData;
};

exports.add = function() {
    if (pageData.get("expenseValue").trim() !== "") {
        viewModule.getViewById(page, "expenseValue").dismissSoftInput();
        expense.add([{
            'ExpenseValue' : pageData.get("expenseValue"),
            'ExpenseOrigin' : pageData.get("expenseOrigin"),
            'ActualNPer' : pageData.get("expenseActNper"),
            'TotalNPer' : pageData.get("expenseTotNPer"),
            'EventDate' : pageData.get("expenseDate"),
            'LongDescription' : pageData.get("expenseLgDesc"),
            'SmallDescription' : pageData.get("expenseSmDesc")
        }])
        .then(function(data) {
        	dialogsModule.alert({
            	message: JSON.stringify(data),
                okButtonText: "OK"
            });
            frameModule.topmost().navigate("views/cockpit/cockpit");
        }, 
       	function(error) {
        	dialogsModule.alert({
            	message: JSON.stringify(error),
                okButtonText: "OK"
            });             
        });
        pageData.set("expenseValue", "");
        pageData.set("expenseSmDesc", "");
        pageData.set("expenseLgDesc", "");
    }else{
        dialogsModule.alert({
            message: "Informe o valor do gasto.",
            okButtonText: "OK"
        });
    };
};

