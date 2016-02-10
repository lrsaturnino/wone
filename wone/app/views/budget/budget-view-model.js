var appsettings = require("../../utils/appsettings");
var observableArrayModule = require("data/observable-array");

function BudgetViewModel(){
    var viewModel = new observableArrayModule.ObservableArray();

    viewModel.addAll = function(data) {
        var model = EVERLIVE.data('sub_category');
        return new Promise(function (resolve, reject) {
        	if (data){
                model.create(data,
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                });
            }else{
                reject('Erro de inclusão do gasto: dados vazios');             
            }
        });
    };
    
    viewModel.load = function(data) {
        viewModel.empty();
        var filter = { 
    		'CategoryID' : data
		};
        var model = EVERLIVE.data('sub_category');
        return new Promise(function (resolve, reject) {
            model.get(filter)
            .then(function(data){
                resolve(data);
            },
            function(error){
                reject(error);
            });
        });
    };
    
	viewModel.empty = function() {
		while (viewModel.length) {
			viewModel.pop();
		}
	};

    viewModel.deleteAll = function(data) {
        var model = EVERLIVE.data('sub_category');
        return new Promise(function (resolve, reject) {
            model.destroy({'CategoryID' : data},
            function(data){
                resolve(data);
            },
            function(error){
                reject(error);
            });
        });
    };
    
    return viewModel;
}

module.exports = BudgetViewModel;



