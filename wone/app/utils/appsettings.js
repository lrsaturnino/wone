var appSettingsModule = require("application-settings");

var appSettings = {};

Object.defineProperty(appSettings, "haskey", {
	get: function() {
		return appSettingsModule.hasKey(this.key);
	}
});

Object.defineProperty(appSettings, "remove", {
	get: function() {
		return appSettingsModule.remove(this.key);
	}
});

Object.defineProperty(appSettings, "keyselect", {
	set: function(data) {
		return appSettings.key = data;
	}
});

Object.defineProperty(appSettings, "userid", {
	get: function() {
		return appSettingsModule.getString("userid");
	},
	set: function(data) {
		return appSettingsModule.setString("userid", data);
	}
});

Object.defineProperty(appSettings, "username", {
	get: function() {
		return appSettingsModule.getString("username");
	},
	set: function(data) {
		return appSettingsModule.setString("username", data);
	}
});

Object.defineProperty(appSettings, "password", {
	get: function() {
		return appSettingsModule.getString("password");
	},
	set: function(data) {
		return appSettingsModule.setString("password", data);
	}
});

Object.defineProperty(appSettings, "accesscounter", {
	get: function() {
		return appSettingsModule.getNumber("accesscounter");
	},
	set: function(data) {
		return appSettingsModule.setNumber("accesscounter", data);
	}
});

Object.defineProperty(appSettings, "messagetoken", {
	get: function() {
		return appSettingsModule.getNumber("messagetoken");
	},
	set: function(data) {
		return appSettingsModule.setNumber("messagetoken", data);
	}
});

Object.defineProperty(appSettings, "token", {
	get: function() {
		return appSettingsModule.getString("token");
	},
	set: function(data) {
		return appSettingsModule.setString("token", data);
	}
});

Object.defineProperty(appSettings, "expensecounter", {
	get: function() {
		return appSettingsModule.getNumber("expensecounter");
	},
	set: function(data) {
		return appSettingsModule.setNumber("expensecounter", data);
	}
});

Object.defineProperty(appSettings, "favsubcat1", {
	get: function() {
		return appSettingsModule.getString("favsubcat1");
	},
	set: function(data) {
		return appSettingsModule.setString("favsubcat1", data);
	}
});

Object.defineProperty(appSettings, "favsubcat2", {
	get: function() {
		return appSettingsModule.getString("favsubcat2");
	},
	set: function(data) {
		return appSettingsModule.setString("favsubcat2", data);
	}
});

Object.defineProperty(appSettings, "favsubcat3", {
	get: function() {
		return appSettingsModule.getString("favsubcat3");
	},
	set: function(data) {
		return appSettingsModule.setString("favsubcat3", data);
	}
});

Object.defineProperty(appSettings, "registered", {
	get: function() {
		return appSettingsModule.getBoolean("registered");
	},
	set: function(data) {
		return appSettingsModule.setBoolean("registered", data);
	}
});

Object.defineProperty(appSettings, "registerdate", {
	get: function() {
		return appSettingsModule.getNumber("registerdate");
	},
	set: function(data) {
		return appSettingsModule.setNumber("registerdate", data);
	}
});

Object.defineProperty(appSettings, "countcategory", {
	get: function() {
		return appSettingsModule.getNumber("countcategory");
	},
	set: function(data) {
		return appSettingsModule.setNumber("countcategory", data);
	}
});

Object.defineProperty(appSettings, "categories", {
	get: function() {
		return appSettingsModule.getString("categories");
	},
	set: function(data) {
		return appSettingsModule.setString("categories", data);
	}
});

Object.defineProperty(appSettings, "basicCategoryBudget", {
	get: function() {
		return appSettingsModule.getString("basicCategoryBudget");
	},
	set: function(data) {
		return appSettingsModule.setString("basicCategoryBudget", data);
	}
});

Object.defineProperty(appSettings, "extraCategoryBudget", {
	get: function() {
		return appSettingsModule.getString("extraCategoryBudget");
	},
	set: function(data) {
		return appSettingsModule.setString("extraCategoryBudget", data);
	}
});

Object.defineProperty(appSettings, "investimentCategoryBudget", {
	get: function() {
		return appSettingsModule.getString("investimentCategoryBudget");
	},
	set: function(data) {
		return appSettingsModule.setString("investimentCategoryBudget", data);
	}
});

Object.defineProperty(appSettings, "expenses", {
	get: function() {
		return appSettingsModule.getString("expenses");
	},
	set: function(data) {
		return appSettingsModule.setString("expenses", data);
	}
});

Object.defineProperty(appSettings, "creditcards", {
	get: function() {
		return appSettingsModule.getString("creditcards");
	},
	set: function(data) {
		return appSettingsModule.setString("creditcards", data);
	}
});


module.exports = appSettings;
