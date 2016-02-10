var appsettings = require("../../utils/appsettings");
var observable = require("data/observable").Observable;

var categoryBarData = (function () {
    function categoryBarData(){
    }
    Object.defineProperty(categoryBarData.prototype,"categoryExpenseBudget", {
        get: function () {
            return [
                { Categoria: "Básicos", Amount: Math.random() * 1000 },
                { Categoria: "Extras", Amount: Math.random() * 1000 },
                { Categoria: "Investimentos", Amount: Math.random() * 1000 },
            ];
        },
        enumerable: true,
        configurable: true
    });
    return categoryBarData;
})();

exports.categoryBarData = categoryBarData;



