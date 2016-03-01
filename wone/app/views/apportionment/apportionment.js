var observable = require("data/observable");
var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var appsettings = require("../../utils/appsettings");
var categories = JSON.parse(appsettings.categories);
var viewModule = require("ui/core/view");
var categoryCount;
var page;
var budget;
var firstWeekSliderProp;
var secondWeekSliderProp;
var thirdWeekSliderProp;
var fourthWeekSliderProp;
var firstWeekSliderMaxValue;

var firstWeekSlider = function(data){
    secondWeekSliderProp.maxValue = Math.floor(100 - data.value - thirdWeekSliderProp.value - fourthWeekSliderProp.value);
    thirdWeekSliderProp.maxValue = Math.floor(100 - data.value - secondWeekSliderProp.value - fourthWeekSliderProp.value);
    fourthWeekSliderProp.maxValue = Math.floor(100 - data.value - secondWeekSliderProp.value - thirdWeekSliderProp.value);
    pageData.set('firstWeekLabel', firstWeekSliderProp.value / 100 * budget.totalBudget);
    pageData.set('budgetLeft', budget.totalBudget - (pageData.get('firstWeekLabel') + pageData.get('secondWeekLabel') 
                                              + pageData.get('thirdWeekLabel') + pageData.get('fourthWeekLabel')));        
 
};

var secondWeekSlider = function(data){
    firstWeekSliderProp.maxValue = Math.floor(100 - data.value - thirdWeekSliderProp.value - fourthWeekSliderProp.value);
    fourthWeekSliderProp.maxValue = Math.floor(100 - data.value - firstWeekSliderProp.value - thirdWeekSliderProp.value);
    thirdWeekSliderProp.maxValue = Math.floor(100 - data.value - firstWeekSliderProp.value - fourthWeekSliderProp.value);
   	pageData.set('secondWeekLabel', secondWeekSliderProp.value / 100 * budget.totalBudget);
    pageData.set('budgetLeft', budget.totalBudget - (pageData.get('firstWeekLabel') + pageData.get('secondWeekLabel') 
                                              + pageData.get('thirdWeekLabel') + pageData.get('fourthWeekLabel')));  
};

var thirdWeekSlider = function(data){
    fourthWeekSliderProp.maxValue = Math.floor(100 - data.value - secondWeekSliderProp.value - firstWeekSliderProp.value);
    secondWeekSliderProp.maxValue = Math.floor(100 - data.value - firstWeekSliderProp.value - fourthWeekSliderProp.value);
    firstWeekSliderProp.maxValue = Math.floor(100 - data.value - secondWeekSliderProp.value - fourthWeekSliderProp.value);
   	pageData.set('thirdWeekLabel', thirdWeekSliderProp.value / 100 * budget.totalBudget);
    pageData.set('budgetLeft', budget.totalBudget - (pageData.get('firstWeekLabel') + pageData.get('secondWeekLabel') 
                                              + pageData.get('thirdWeekLabel') + pageData.get('fourthWeekLabel')));  
};

var fourthWeekSlider = function(data){
    thirdWeekSliderProp.maxValue = Math.floor(100 - data.value - secondWeekSliderProp.value - firstWeekSliderProp.value);
    firstWeekSliderProp.maxValue = Math.floor(100 - data.value - thirdWeekSliderProp.value - secondWeekSliderProp.value);
    secondWeekSliderProp.maxValue = Math.floor(100 - data.value - thirdWeekSliderProp.value - firstWeekSliderProp.value);
   	pageData.set('fourthWeekLabel', fourthWeekSliderProp.value / 100 * budget.totalBudget);
    pageData.set('budgetLeft', budget.totalBudget - (pageData.get('firstWeekLabel') + pageData.get('secondWeekLabel') 
                                              + pageData.get('thirdWeekLabel') + pageData.get('fourthWeekLabel')));  
};

function resetApportionment() {
    firstWeekSliderProp.maxValue = 25;
    secondWeekSliderProp.maxValue = 25;
    thirdWeekSliderProp.maxValue = 25;
    fourthWeekSliderProp.maxValue = 25;
    
    firstWeekSliderProp.value = 25;
    secondWeekSliderProp.value = 25;
    thirdWeekSliderProp.value = 25;
    fourthWeekSliderProp.value = 25;

    pageData.set('firstWeekLabel', 0.25 * budget.totalBudget);
   	pageData.set('secondWeekLabel', 0.25 * budget.totalBudget);
   	pageData.set('thirdWeekLabel', 0.25 * budget.totalBudget);
   	pageData.set('fourthWeekLabel', 0.25 * budget.totalBudget);	    
};

var pageData = new observable.Observable({
    firstWeekLabel: 0,
    secondWeekLabel: 0,
    thirdWeekLabel: 0,
    fourthWeekLabel: 0,
	buttontext: "",
    budgetLeft: 0
});

exports.loaded = function(args) {   	
    page = args.object;
   	page.bindingContext = pageData;
    categoryCount = page.navigationContext.count_category;
   	budget = page.navigationContext.budget;
    firstWeekSliderProp = viewModule.getViewById(page, 'firstWeekSlider');
    secondWeekSliderProp = viewModule.getViewById(page, 'secondWeekSlider');
    thirdWeekSliderProp = viewModule.getViewById(page, 'thirdWeekSlider');
    fourthWeekSliderProp = viewModule.getViewById(page, 'fourthWeekSlider');
	
    resetApportionment();
    
    pageData.set('budgetLeft', 0);  

    firstWeekSliderProp.on(observable.Observable.propertyChangeEvent, function(data){
		if (data.propertyName != 'maxValue'){
        	firstWeekSlider(data);
        };    
    });
    secondWeekSliderProp.on(observable.Observable.propertyChangeEvent, function(data){
		if (data.propertyName != 'maxValue'){
        	secondWeekSlider(data);
        };
    });
    thirdWeekSliderProp.on(observable.Observable.propertyChangeEvent, function(data){
		if (data.propertyName != 'maxValue'){
			thirdWeekSlider(data);
        };
    });
    fourthWeekSliderProp.on(observable.Observable.propertyChangeEvent, function(data){
        if (data.propertyName != 'maxValue'){
			fourthWeekSlider(data);        
        };
    });
 
};

exports.next = function() {
	if (!pageData.get('budgetLeft')){    
        budget.weeklyBudget['1'] = pageData.get('firstWeekLabel');
        budget.weeklyBudget['2'] = pageData.get('secondWeekLabel');
        budget.weeklyBudget['3'] = pageData.get('thirdWeekLabel');
        budget.weeklyBudget['4'] = pageData.get('fourthWeekLabel');
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
        if (categoryCount != 0){
            appsettings.countcategory = categoryCount;
            frameModule.topmost().navigate({
                moduleName: "views/budget/budget", 
            });
        }else{
            appsettings.countcategory = categories.count;                      
            appsettings.favsubcat1 = "";
            appsettings.favsubcat2 = "";
            appsettings.favsubcat3 = "";
            
            if (appsettings.registered === false){
                dialogsModule.confirm({
                  title: "Pronto!",
                  message: "Seu orçamento está concluído :) \n\nSugerimos que neste momento efetue o cadastro de seu e-mail para evitar perder suas informações no futuro.",
                  okButtonText: "Cadastrar",
                  cancelButtonText: "Mais tarde",
                }).then(function (result) {
                    if (result){
                        frameModule.topmost().navigate({
                        moduleName: "views/register/register", 
                        clearHistory: true
                        });                                        
                    }else{
                        frameModule.topmost().navigate({
                        moduleName: "views/cockpit/cockpit", 
                        clearHistory: true
                        });                                                              
                    };
                });                           
            }else{
                frameModule.topmost().navigate({
                    moduleName: "views/cockpit/cockpit", 
                    clearHistory: true
                });                            
            };
        };
    }else{
        dialogsModule.alert({
            message: 'Ainda existe orçamento disponível para proporcionalização nas semanas do mês.',
            okButtonText: "OK"
        });             		        
    };
};

exports.goBack = function(){
    frameModule.topmost().goBack();
};



