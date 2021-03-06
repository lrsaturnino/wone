var appsettings = require("../../utils/appsettings");
var observableArrayModule = require("data/observable-array");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var Everlive = require('../../lib/everlive/everlive.all.min');
var everliveOptions = {
	appId: APP_ID,
    scheme: BS_SCHEME,
    tokenType: 'bearer',
    authentication: {
        persist: true,
        onAuthenticationRequired: function() {
            alert('Seu acesso expirou. Por favor, acesse novamente.');
            	frameModule.topmost().navigate("views/login/login");
        }
    }
};

EVERLIVE = new Everlive(everliveOptions);

var UserViewModel = function(data){
    data = data || {};

    var viewModel = new Observable({
        id: appsettings.userid,
        username: appsettings.username,
        resetEmail: data.resetEmail,
        email: appsettings.registered ? appsettings.username : data.email || "",
		password: data.password || appsettings.password,
        oldPassword: "",
        previousPassword: "",
        previousUsername: "",
        newPassword: "",
        buttonText: "",
        newPasswordHint: "",
        confirmNewPasswordHint: "",
        message: ""
	});

	viewModel.register = function(){
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.set('username', (parseInt(Math.random() * 1000) + "" + new Date().getTime()).toString());
            _this.set('password',' w0RlD_On&');
            var attrs = {
                Email: '',
                DisplayName: ''
            };
            EVERLIVE.Users.register(_this.get("username"), _this.get("password"), attrs)
            .then(function(data) {
                resolve(data);
            },
            function(error){
                reject(error);
            });
        });
   };

   viewModel.login = function(){
        var _this = this;
   		return new Promise(function (resolve, reject) {
            EVERLIVE.authentication.login(_this.get("previousUsername") !== "" ? _this.get("previousUsername") : _this.get("username"), _this.get('previousPassword') !== "" ? _this.get('previousPassword') : _this.get("password"))
            .then(function (data) {
                    appsettings.username = _this.get("previousUsername") !== "" ? _this.get("previousUsername") : _this.get("username");
                    appsettings.password = _this.get('previousPassword') !== "" ? _this.get('previousPassword') : _this.get("password");
                    appsettings.accesscounter = appsettings.accesscounter + 1;
                    resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
   };

   viewModel.current = function(){
        var _this = this;
   		return new Promise(function (resolve, reject) {
            EVERLIVE.Users.currentUser()
            .then(function (data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
   };

   viewModel.reset = function(){
        var _this = this;
        var _rEmail = _this.get('resetEmail').toLowerCase();
   		return new Promise(function (resolve, reject) {
            EVERLIVE.users.resetPassword({'Email' : _rEmail})
            .then(function (data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
   };

   viewModel.update = function(){
        var _this = this;
        var _email = _this.get('email').toLowerCase();
        return new Promise(function (resolve, reject) {
            EVERLIVE.Users.updateSingle({'Id' : _this.get('id'), 'Email' : _email, 'Username' : _email})
            .then(function (data) {
                appsettings.username = _email;
                EVERLIVE.Users.changePassword(_email, appsettings.registered ? _this.get('oldPassword') : _this.get('password'), _this.get('newPassword'), true)
                .then(function (data){
                    appsettings.password = _this.get('newPassword');
                    appsettings.registered = true;
                    resolve(data);
                },
                function(error){
                    reject(error);
                });
            },
            function(error) {
                reject(error);
            });
        });
   };

   return viewModel;
};

var CategoryViewModel = function(){
	var viewModel = new observableArrayModule.ObservableArray();

    viewModel.fetch = function() {
        var model = EVERLIVE.data('category');
        return new Promise(function (resolve, reject) {
            model.get()
            .then(function(data){
                resolve(data);
            },
            function(error){
                reject(error);
            });
        });
    };

   return viewModel;
};

var ExpenseListViewModel = function(){
    var viewModel = new observableArrayModule.ObservableArray();

    viewModel.add = function(expense) {
        var model = EVERLIVE.data('expenses')
        return new Promise(function (resolve, reject) {
            model.create(expense,
            function(data) {
                appsettings.expenses = "";
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.all = function() {
        var model = EVERLIVE.data('expenses')
        return new Promise(function (resolve, reject) {
            model.get()
            .then(function(data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.all_by_yearmonth_category = function(yearmonth, category_id) {
        viewModel.empty();
        var filter = {
            'YearMonth' : new Date(yearmonth.getFullYear(), yearmonth.getMonth(), 1),
            'CategoryID' : category_id
        };
        var model = EVERLIVE.data('expenses')
        return new Promise(function (resolve, reject) {
            model.get(filter)
            .then(function(data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.resume_all = function() {
        var model = EVERLIVE.data('expenses')
        var query = new Everlive.AggregateQuery();
        query.groupBy(['YearMonth', 'CategoryName', 'CategoryID']);
        query.sum('ExpenseValue', 'TotalExpense');

        return new Promise(function (resolve, reject) {
            model.aggregate(query)
            .then(function(data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.yearmonths = function() {
        var model = EVERLIVE.data('expenses')
        var query = new Everlive.AggregateQuery();
        query.groupBy(['YearMonth']);
        query.sum('ExpenseValue', 'TotalExpense');
        query.where().lte('YearMonth', new Date(new Date().getFullYear(), new Date().getMonth(), 1));

        return new Promise(function (resolve, reject) {
            model.aggregate(query)
            .then(function(data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.resume_yearmonth = function(yearmonth) {
        var model = EVERLIVE.data('expenses')
        var query = new Everlive.AggregateQuery();
        query.groupBy(['YearMonth', 'CategoryName', 'CategoryID']);
        query.sum('ExpenseValue', 'TotalExpense');
        query.where().eq('YearMonth', new Date(yearmonth.getFullYear(), yearmonth.getMonth(), 1));

        return new Promise(function (resolve, reject) {
            model.aggregate(query)
            .then(function(data) {
                if (appsettings.basicCategoryBudget && appsettings.extraCategoryBudget && appsettings.investimentCategoryBudget){
                    var objBasicBudget = JSON.parse(appsettings.basicCategoryBudget);
                    var objExtraBudget = JSON.parse(appsettings.extraCategoryBudget);
                    var objInvestimentBudget = JSON.parse(appsettings.investimentCategoryBudget);

                    var basicExpenseValue = searchArray('CategoryID', objBasicBudget.idCategory, data.result, 'TotalExpense');
                    var extraExpenseValue = searchArray('CategoryID', objExtraBudget.idCategory, data.result, 'TotalExpense');
                    var investimentExpenseValue = searchArray('CategoryID', objInvestimentBudget.idCategory, data.result, 'TotalExpense');

                    objBasicBudget.totalExpense = basicExpenseValue;
                    objExtraBudget.totalExpense = extraExpenseValue;
                    objInvestimentBudget.totalExpense = investimentExpenseValue;

                    appsettings.basicCategoryBudget = JSON.stringify(objBasicBudget);
                    appsettings.extraCategoryBudget = JSON.stringify(objExtraBudget);
                    appsettings.investimentCategoryBudget = JSON.stringify(objInvestimentBudget);
                };
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.resume_each_yearmonth = function() {
        viewModel.empty();
        var model = EVERLIVE.data('expenses')
        var query = new Everlive.AggregateQuery();
        query.groupBy(['YearMonth', 'CategoryName', 'CategoryID']);
        query.sum('ExpenseValue', 'TotalExpense');
        query.where().lte('YearMonth', new Date(new Date().getFullYear(), new Date().getMonth(), 1));

        return new Promise(function (resolve, reject) {
            model.aggregate(query)
            .then(function(data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

    viewModel.delete_expense = function(expense_id) {
        var model = EVERLIVE.data('expenses')

        return new Promise(function (resolve, reject) {
            model.destroySingle ({Id : expense_id})
            .then(function(data) {
                resolve(data);
            },
            function(error) {
                reject(error);
            });
        });
    };

	viewModel.empty = function() {
		while (viewModel.length) {
			viewModel.pop();
		}
	};

    viewModel.empty();

    return viewModel;
};

exports.ExpenseListViewModel = ExpenseListViewModel;
exports.UserViewModel = UserViewModel;
exports.CategoryViewModel = CategoryViewModel;

function searchArray(searchkey, data, myArray, resultkey){
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][searchkey] === data) {
            return myArray[i][resultkey];
        };
    };
    return 0;
};
