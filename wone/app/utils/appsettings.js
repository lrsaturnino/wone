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

Object.defineProperty(appSettings, "token", {
	get: function() {
		return appSettingsModule.getString("token");
	},
	set: function(data) {
		return appSettingsModule.setString("token", data);
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

Object.defineProperty(appSettings, "inputexpensecounter", {
	get: function() {
		return appSettingsModule.getString("inputexpensecounter");
	},
	set: function(data) {
		return appSettingsModule.setString("inputexpensecounter", data);
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

Object.defineProperty(appSettings, "firstbudget", {
	get: function() {
		return appSettingsModule.getString("firstbudget");
	},
	set: function(data) {
		return appSettingsModule.setString("firstbudget", data);
	}
});

Object.defineProperty(appSettings, "secondbudget", {
	get: function() {
		return appSettingsModule.getString("secondbudget");
	},
	set: function(data) {
		return appSettingsModule.setString("secondbudget", data);
	}
});

Object.defineProperty(appSettings, "thirdbudget", {
	get: function() {
		return appSettingsModule.getString("thirdbudget");
	},
	set: function(data) {
		return appSettingsModule.setString("thirdbudget", data);
	}
});


module.exports = appSettings;
