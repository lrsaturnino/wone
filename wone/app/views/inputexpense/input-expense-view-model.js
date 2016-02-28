var observableArrayModule = require("data/observable-array");
var appsettings = require("../../utils/appsettings");

function ExpenseListViewModel() {
    var viewModel = new observableArrayModule.ObservableArray();

    viewModel.add = function(expense) {
        var model = EVERLIVE.data('expenses')
        return new Promise(function (resolve, reject) {
            model.create(expense,
            function (data) {
                resolve(data);
            },
            function (error) {
                reject(error);
            });
        });
    };
    return viewModel;
}

module.exports = ExpenseListViewModel;