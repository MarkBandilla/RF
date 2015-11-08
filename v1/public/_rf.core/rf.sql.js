var rfSQL = {
	db: null,
	lm: 0,

	init: function () {
		rfSQL.connect();
		// rfSQL.migratesqlschema();
		// rfSQL.migrate();
		// rfSQL.seed();
		// rfSQL.seed({table: 'rf_input_types'});
	},
	connect: function (params) {
		var params = $.extend({
			dbname: rfFunction.urlvars()['rfproject'] || null,
			version: '1.0',
			description: 'no description',
			success: function (message) {
				rfFunction.log('Connected:: ' + message);
			},
			error: function (message) {
				rfFunction.log('SQL Connect Error:: ' + message);
			}
		}, params);

		var odb = window.openDatabase;
	    
	    if(!odb) {
	        params.error('Web SQL Not Supported');
	    } else {

	    	if(params.dbname === null) return params.error('Project Undefined');

	        this.db = odb( params.dbname, params.version, params.description, 10 * 1024 * 1024 );
	        
	        rfFunction.getMigration();

	        params.success(params.dbname + ', ' + params.version + ', ' + params.description);

	    }
	},
	exec: function (params) {
		var params = $.extend({
			query: '',
			values: [],
			success: function (t, r) { rfFunction.log('ExecuteSQL:: ' + params.query + ' []'); },
			error: function (t, e) { rfFunction.log('Error:: ' + params.query + ' []'); }
		}, params);

		if(!this.db) {
			params.error("Error:: DB does not exists");
			return;
		} 

		this.db.transaction(function (t) {
	        t.executeSql(params.query, params.values, params.success, params.error);
	    });
	},
	migratesqlschema: function (params) {
		rfFunction.log('Running migratesqlschema..');
		var params = $.extend({
			migratesqlschema: rfMigrateSQLSchema,
			success: function (data) { rfFunction.log (data); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		var m = params.migratesqlschema;
		var ml = m.length;

		$.each(m, function(i) {
			rfFunction.migrate2Schema({ table: m[i].table, method: m[i].method, column: m[i].column });
			rfFunction.migrate2SQL({ name: m[i].name, table: m[i].table, method: m[i].method, up: m[i].up, down: m[i].down });
		});
	},
	migrate: function (params) {
		var params = $.extend({
			migration: rfMigration,
			success: function (data) { 
				rfSQL.lm = data;
				rfFunction.updateMigration('migration', rfSQL.lm);
				rfFunction.log ('Migrated:: ' + data + ' / ' + rfSQL.lm); 
			},
			error: function (data) { rfFunction.log (data); }
		}, params);

		var m = params.migration;
		var result = {};
		var counter = 0;

		$.each(m, function(i) {
			if(rfSQL.lm <= i) {
				rfFunction.log('Migrate:: ' + m[i].name);

				$.each(m[i].up, function(j){
					rfSQL.exec({ 
						query: m[i].up[j], 
						values: m[i].values, 
						success: function(t, r){
							
						}, 
						error: function(t, e){
							rfFunction.log(e.message);
						} 
					});
				});
			}

			counter ++;
			if(counter == m.length) {
				params.success(counter);
			}
		});
	},
	rollback: function (params) {

	},
	seed: function (params) {
		var params = $.extend({
			table: 'users',
			rows: 10,
			success: function (data) { rfFunction.log (data); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		var schema = rfFunction.schema({ table: params.table }).column;

		if(schema) {
			var column_names = [];
			var column_types = [];
			var column_params = [];

			$.each(schema, function (c, v) {
				if(v.name != 'id') {
					column_names.push( v.name );
					column_types.push( v.seed );
					column_params.push( v.params );
				}
			});

			for( var i = 0; i < params.rows; i ++ ) {
				// rfFunction.log('Seed:: ' + i);

				var column_count = [];
				var column_values = [];

				for( var j = 0; j < column_names.length; j ++ ) {
					var faker = rfFunction.faker({ type: column_types[j], params: column_params[j] });

					column_values.push(faker);
					column_count.push('?');
					// rfFunction.log(i + ' ' + column_names[j] + ' : ' + column_types[j] + ' - ' + column_values[j]);
				}

				var query = "INSERT INTO " + params.table + " ( " + column_names.join() + " ) VALUES ( " + column_count.join() + " )";
				var values = column_values;
				// rfFunction.log(query, values);

				rfSQL.exec({ query: query, values: values, 
					success: function(data) {
						// params.success({ table: params.table, query: this.query, values: this.values });
					},
					error: function(data) {
						params.error(data);
					}
				});

				if(i + 1 == params.rows) params.success('Seeded:: ' + params.rows + 'rows into ' + params.table);
			}
		} else {
			params.error('Error:: Could not read schema from ' + params.table);
		}
	},
};