var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var page;
var basicSubCategoryList = JSON.parse(appsettings.basicCategoryBudget);
var extraSubCategoryList = JSON.parse(appsettings.extraCategoryBudget);
var investimentSubCategoryList = JSON.parse(appsettings.investimentCategoryBudget);

var pageData = new observable({
    basicSubCategoryList: basicSubCategoryList.subCategories,
    extraSubCategoryList: extraSubCategoryList.subCategories,
    investimentSubCategoryList: investimentSubCategoryList.subCategories    
});


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;
    
}

exports.goBack = function(){
    frameModule.topmost().goBack();
};

exports.selectSubCategory = function(args) { 
    var item = args.view.bindingContext;
    
    if (page.navigationContext.define_category){
        switch (page.navigationContext.from){
            case 1:
                appsettings.favsubcat1 = JSON.stringify(item);
                break;
            case 2:
                appsettings.favsubcat2 = JSON.stringify(item);
                break; 
            case 3:
                appsettings.favsubcat3 = JSON.stringify(item);
                break;
        };
        frameModule.topmost().navigate({
            moduleName: "views/cockpit/cockpit",
            clearHistory: true
        });
    }else{
        frameModule.topmost().navigate({
            moduleName: "views/inputexpense/inputexpense",
            context: {
                categoryID: item.CategoryID,
                subCategoryID: item.Id
            }
        });
    };
};