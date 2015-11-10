var rfFunction = {
	dev: true,

	log: function(message) {
		if(rfFunction.dev) {
			console.log(message);
		}
	},
	urlvars: function () {
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	},
	getMigration: function (params) {
		rfFunction.log('Get Migration Settings..');
		var params = $.extend({
			success: function (data) { rfFunction.log (data); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		rfSQL.exec({ 
			query: rfQuery.getMigrationSettings,
			success: function(t, r) {
				rfFunction.log('Migration Settings found!');
				rfFunction.setMigration(t, r);
			},
			error: function() {
				rfFunction.log('No Migration Settings found!');
				rfFunction.initMigration();
			}
		});	
	},
	initMigration: function() {
		rfFunction.log('Building Initial Migration Settup..');

		var m = rfQuery.createMigration;
		var ml = m.length;

		for(i = 0; i < ml; i++) {
			rfSQL.exec({ 
				query: m[i]
			});

			if(ml == i + 1) rfFunction.getMigration();
		};	
	},
	setMigration: function (t, r) {
		rfFunction.log('Setting up Migration Settings..');
		$.each(r.rows, function(index, row){
			switch(row.property) {
				case 'migration':
					rfSQL.lm = parseInt(row.value);
				break;
			}		
		});

		rfSQL.migratesqlschema();
	},
	updateMigration: function (property, value) {
		rfFunction.log('Updating Migration Settings..');

		switch(property) {
			case 'migration':
				rfSQL.exec({ 
					query: rfQuery.updateMigrationSettings,
					values: [value, moment().format('YYYY-MM-DD hh:mm:ss'), property],
					success: function(t, r) {
						rfFunction.log('Migration updated!');
						location.reload();
					},
					error: function(t, e) {
						rfFunction.log('Migration update failed!');
						rfFunction.log(e.message);
					}
				});	
			break;
		}
	},
	migrate2Schema: function (params) {
		rfFunction.log('Running migrate2Schema..');
		var params = $.extend({
			table: '',
			method: '',
			column: [],
			success: function (data) { rfFunction.log (data, 'migrate2Schema:: ' + params.table); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		switch(params.method) {
			case 'resetDataBase':
				$.each(rfSchema, function(i, value){ 
					rfSQL.exec({query: 'DROP TABLE ' + i}); 
				});
			break;
			case 'createTable':
				rfSchema[params.table] = { column: params.column };
			break;
			case 'createColumn':
				var oldColumns = rfSchema[params.table].column;
				var newColumns = params.column;

				rfSchema[params.table].column = $.merge(newColumns, oldColumns);
			break;
		}

		listTables();
	},
	migrate2SQL: function (params) {
		rfFunction.log('Running migrate2SQL..');
		var params = $.extend({
			name: '',
			table: '',
			method: '',
			up: [],
			down: [],
			success: function (data) { rfFunction.log (data, 'migrate2SQL:: ' + params.table); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		if (rfMigration == "[]") rfMigration = [];

		rfMigration.push({
			id: rfMigration.length,
			name: params.name,
			table: params.table,
			method: params.method,
			up: params.up,
			down: params.down
		});
	},
	schema: function (params) {
		var params = $.extend({
			table: 'users'
		}, params);

		var schema = rfSchema[params.table];
		// rfFunction.log('Schema:: ' + params.table, schema);

		if(schema) {
			return schema;
		} else {
			return 'error';
		}
	},
	faker: function (params) {
		var params = $.extend({
			type: 'string',
			params: null
		}, params);

		switch(params.type) {
			case 'string':
				return faker.hacker.phrase();
			break;
			case 'fullname':
				return faker.name.findName();
			break;
			case 'email':
				return faker.internet.email();
			break;
			case 'password':
				return 'password';
			break;
			case 'number':
				var min = params.params.validation.min || 0;
				var max = params.params.validation.max || 0;
				if(min < max)
					return Math.floor(Math.random() * (max - min + 1)) + min;
				else
					return faker.random.number();
			break;
			case 'float':
				return faker.finance.amount();
			break;
			case 'avatar':
				return faker.image.avatar();
			break;
			case 'url':
				return faker.internet.url();
			break;
			case 'text':
				return faker.lorem.paragraphs();
			break;
			case 'date':
				return moment(faker.date.past()).format('YYYY-MM-DD');
			break;
			case 'date_now':
				return moment().format('YYYY-MM-DD');
			break;
			case 'time':
				return moment(faker.date.past()).format('hh:mm:ss');
			break;
			case 'time_now':
				return moment().format('hh:mm:ss');
			break;
			case 'datetime':
				return moment(faker.date.past()).format('YYYY-MM-DD hh:mm:ss');
			break;
			case 'datetime_now':
				return moment().format('YYYY-MM-DD hh:mm:ss');
			break;
			case 'image':
				return faker.internet.avatar();
			break;
			case 'select':
				var values = [];
				if(params.params.values) values = params.params.values;
				else if(params.params.options) values = params.params.options;
				else return null;

				return values[Math.floor(Math.random()*values.length)];
			break;
		}
	},
	sort: function (params) {
		var params = $.extend({
			array: [],
			key: null
		}, params);

	    return params.array.sort(function(a, b) {
	        var x = a[params.key]; var y = b[params.key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
}