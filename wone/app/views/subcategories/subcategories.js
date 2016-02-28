var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var page;
var basicSubCategoryList; 
var extraSubCategoryList; 
var investimentSubCategoryList;

var pageData = new observable({
    basicSubCategoryList: '',
    extraSubCategoryList: '',
    investimentSubCategoryList: ''    
});


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    basicSubCategoryList = JSON.parse(appsettings.basicCategoryBudget);
    extraSubCategoryList = JSON.parse(appsettings.extraCategoryBudget);
    investimentSubCategoryList = JSON.parse(appsettings.investimentCategoryBudget);
    
    pageData.set('basicSubCategoryList', basicSubCategoryList.subCategories);
    pageData.set('extraSubCategoryList', extraSubCategoryList.subCategories);
    pageData.set('investimentSubCategoryList', investimentSubCategoryList.subCategories);    
};

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
                subCategoryID: item.Id,
                subCategoryName: item.SubCategoryName,
                new: true
            }
        });
    };
};