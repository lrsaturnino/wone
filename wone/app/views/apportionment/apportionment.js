var appModule = require("application");
var observable = require("data/observable");
var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var appsettings = require("../../utils/appsettings");
var categories = JSON.parse(appsettings.categories);
var viewModule = require("ui/core/view");
var categoryCount;
var page;
var budget;
var firstWeekBudgetField;
var secondWeekBudgetField;
var thirdWeekBudgetField;
var fourthWeekBudgetField;
var budgetLeftField;

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

var pageData = new observable.Observable({
    firstWeekBudget: "",
    secondWeekBudget: "",
    thirdWeekBudget: "",
    fourthWeekBudget: "",
	buttontext: "",
    budgetLeft: ""
});

exports.loaded = function(args) { 
    appModule.resources["valueConverter"] = valueConverter;
    
    page = args.object;
   	page.bindingContext = pageData;
    
    categoryCount = page.navigationContext.count_category;
   	budget = page.navigationContext.budget;
    
    if (!page.navigationContext.reset){
        pageData.set('firstWeekBudget', 0.25 * budget.totalBudget);
        pageData.set('secondWeekBudget', 0.25 * budget.totalBudget);
        pageData.set('thirdWeekBudget', 0.25 * budget.totalBudget);
        pageData.set('fourthWeekBudget', 0.25 * budget.totalBudget); 
    }else{
        pageData.set('firstWeekBudget', 0.25 * budget.totalBudget);
        pageData.set('secondWeekBudget', 0.25 * budget.totalBudget);
        pageData.set('thirdWeekBudget', 0.25 * budget.totalBudget);
        pageData.set('fourthWeekBudget', 0.25 * budget.totalBudget);           
    };
    
    pageData.set('budgetLeft', 0);  
    
    firstWeekBudgetField = viewModule.getViewById(page, 'firstWeekBudget');
    secondWeekBudgetField = viewModule.getViewById(page, 'secondWeekBudget');
    thirdWeekBudgetField = viewModule.getViewById(page, 'thirdWeekBudget');
    fourthWeekBudgetField = viewModule.getViewById(page, 'fourthWeekBudget');
    
    budgetLeftField = viewModule.getViewById(page, 'budgetLeft');
    
    viewModule.getViewById(page, 'changeFirstWeek').visibility = "visible"; 
    viewModule.getViewById(page, 'confirmFirstWeek').visibility = "collapsed";
    
    viewModule.getViewById(page, 'changeSecondWeek').visibility = "visible"; 
    viewModule.getViewById(page, 'confirmSecondWeek').visibility = "collapsed";
    
    viewModule.getViewById(page, 'changeThirdWeek').visibility = "visible"; 
    viewModule.getViewById(page, 'confirmThirdWeek').visibility = "collapsed";
    
    viewModule.getViewById(page, 'changeFourthWeek').visibility = "visible"; 
    viewModule.getViewById(page, 'confirmFourthWeek').visibility = "collapsed";
    
    viewModule.getViewById(page, 'firstWeekBudget').isEnabled = false;
    viewModule.getViewById(page, 'secondWeekBudget').isEnabled = false;
    viewModule.getViewById(page, 'thirdWeekBudget').isEnabled = false;
    viewModule.getViewById(page, 'fourthWeekBudget').isEnabled = false;
    
    
};

exports.changeFirstWeek = function(){
    firstWeekBudgetField.on(observable.Observable.propertyChangeEvent, function(data){
        pageData.set('budgetLeft', budget.totalBudget - 
                                (secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));
        
        //budgetLeftField.text = valueConverter.toView(budget.totalBudget - (Number(firstWeekBudgetField.text) +
                               // secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                            //    thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                            //    fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));
    });          
    
    firstWeekBudgetField.text = '';
    firstWeekBudgetField.focus();
    viewModule.getViewById(page, 'changeFirstWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'confirmFirstWeek').visibility = "visible";
    viewModule.getViewById(page, 'firstWeekBudget').isEnabled = true;

};

exports.confirmFirstWeek = function(){
    firstWeekBudgetField.off(observable.Observable.propertyChangeEvent);
    pageData.set('firstWeekBudget', firstWeekBudgetField.text);
    
    //firstWeekBudgetField.text = valueConverter.toView(firstWeekBudgetField.text);
    
    pageData.set('budgetLeft', budget.totalBudget - 
                                    (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));    
    
    
    viewModule.getViewById(page, 'changeFirstWeek').visibility = "visible";
    viewModule.getViewById(page, 'confirmFirstWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'firstWeekBudget').isEnabled = false;
};

exports.changeSecondWeek = function(){
    secondWeekBudgetField.on(observable.Observable.propertyChangeEvent, function(data){
        pageData.set('budgetLeft', budget.totalBudget - 
                                (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));
    });          
    
    secondWeekBudgetField.text = '';
    secondWeekBudgetField.focus();
    viewModule.getViewById(page, 'changeSecondWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'confirmSecondWeek').visibility = "visible";
    viewModule.getViewById(page, 'secondWeekBudget').isEnabled = true;

};

exports.confirmSecondWeek = function(){
    secondWeekBudgetField.off(observable.Observable.propertyChangeEvent);
    
    pageData.set('secondWeekBudget', secondWeekBudgetField.text);
    
    pageData.set('budgetLeft', budget.totalBudget - 
                                    (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));    
    
    viewModule.getViewById(page, 'changeSecondWeek').visibility = "visible";
    viewModule.getViewById(page, 'confirmSecondWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'secondWeekBudget').isEnabled = false;
};

exports.changeThirdWeek = function(){
    thirdWeekBudgetField.on(observable.Observable.propertyChangeEvent, function(data){
        pageData.set('budgetLeft', budget.totalBudget - 
                                (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));
    });          
    
    thirdWeekBudgetField.text = '';
    thirdWeekBudgetField.focus();
    viewModule.getViewById(page, 'changeThirdWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'confirmThirdWeek').visibility = "visible";
    viewModule.getViewById(page, 'thirdWeekBudget').isEnabled = true;

};

exports.confirmThirdWeek = function(){
    thirdWeekBudgetField.off(observable.Observable.propertyChangeEvent);
    
    pageData.set('thirdWeekBudget', thirdWeekBudgetField.text);
    
    pageData.set('budgetLeft', budget.totalBudget - 
                                    (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));        
    
    viewModule.getViewById(page, 'changeThirdWeek').visibility = "visible";
    viewModule.getViewById(page, 'confirmThirdWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'thirdWeekBudget').isEnabled = false;
};

exports.changeFourthWeek = function(){
    fourthWeekBudgetField.on(observable.Observable.propertyChangeEvent, function(data){
        pageData.set('budgetLeft', budget.totalBudget - 
                                (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));
    });          
    
    fourthWeekBudgetField.text = '';
    fourthWeekBudgetField.focus();
    viewModule.getViewById(page, 'changeFourthWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'confirmFourthWeek').visibility = "visible";
    viewModule.getViewById(page, 'fourthWeekBudget').isEnabled = true;

};

exports.confirmFourthWeek = function(){
    fourthWeekBudgetField.off(observable.Observable.propertyChangeEvent);
    
    pageData.set('fourthWeekBudget', fourthWeekBudgetField.text);
    
    pageData.set('budgetLeft', budget.totalBudget - 
                                    (firstWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    secondWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    thirdWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100 +
                                    fourthWeekBudgetField.text.replace('.','').replace(',','').replace('R$ ','') / 100));        
    
    viewModule.getViewById(page, 'changeFourthWeek').visibility = "visible";
    viewModule.getViewById(page, 'confirmFourthWeek').visibility = "collapsed";
    viewModule.getViewById(page, 'fourthWeekBudget').isEnabled = false;
};

exports.next = function() {
    if (pageData.get('budgetLeft') == 0){
        
        budget.weeklyBudget['1'] = pageData.get('firstWeekBudget');
        budget.weeklyBudget['2'] = pageData.get('secondWeekBudget');
        budget.weeklyBudget['3'] = pageData.get('thirdWeekBudget');
        budget.weeklyBudget['4'] = pageData.get('fourthWeekBudget');
        
        switch (categoryCount){
            case 0:
                appsettings.investimentCategoryBudget = JSON.stringify(budget);
                break;
            case 1:
                appsettings.extraCategoryBudget = JSON.stringify(budget);
                break; 
            case 2:
                appsettings.basicCategoryBudget = JSON.stringify(budget);
                break;
        };
        
        if (categoryCount !== 0){
            if (page.navigationContext.origin == 'quickadd'){
                appsettings.countcategory = categories.count;
                frameModule.topmost().navigate({
                    moduleName: "views/cockpit/cockpit", 
                    clearHistory: true
                });
            }else{            
                appsettings.countcategory = categoryCount;
                frameModule.topmost().navigate({
                    moduleName: "views/budget/budget",
                    clearHistory: true,
                    context: {
                        origin: 'apportionment'
                    }
                });
            };
        }else{
            appsettings.countcategory = categories.count;                      
            frameModule.topmost().navigate({
                moduleName: "views/cockpit/cockpit", 
                clearHistory: true
            });                            
        };
    }else{
        dialogsModule.alert({
            message: 'Distrua os valores pelas semanas do mês de modo que zere o orçamento disponível.',
            okButtonText: "OK"
        });             		        
    };
};

exports.goBack = function(){
    frameModule.topmost().goBack();
};



