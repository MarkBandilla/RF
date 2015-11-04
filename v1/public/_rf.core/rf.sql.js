var rfSQL = {
	db: null,
	lm: 0,

	init: function () {
		rfSQL.connect();
		rfSQL.migratesqlschema();
		rfSQL.migrate();
		rfSQL.seed();
		rfSQL.seed({table: 'rf_input_types'});
	},
	connect: function (params) {
		var params = $.extend({
			dbname: rfFunction.urlvars()['rfproject'] || null,
			version: '1.0',
			description: 'no description',
			success: function (message) {
				console.log('Connected:: ' + message);
			},
			error: function (message) {
				console.log('SQL Connect Error:: ' + message);
			}
		}, params);

		var odb = window.openDatabase;
	    
	    if(!odb) {
	        params.error('Web SQL Not Supported');
	    } else {

	    	if(params.dbname === null) return params.error('Project Undefined');

	        this.db = odb( params.dbname, params.version, params.description, 10 * 1024 * 1024 );
	        params.success(params.dbname + ', ' + params.version + ', ' + params.description);
	    }
	},
	exec: function (params) {
		var params = $.extend({
			query: '',
			values: [],
			success: function (data) { console.log (JSON.stringify(data)); },
			error: function (data) { console.log (data); }
		}, params);

		if(!this.db) {
			params.error("Error:: DB does not exists");
			return;
		} 

		this.db.transaction(function (t) {
	        t.executeSql(params.query, params.values, 
	        	function (t, r) {
		            params.success(r.rows);
		        }, function (t, e) {
		        	params.error("Error:: '" + params.query + "', [" + params.values.join() + "] : " + e.message);
		        }
	        );
	    }, function (t, e){ 
			params.success('Insert row: ' + e.message); 
		}, function() {
            
        });
	},
	migratesqlschema: function (params) {
		var params = $.extend({
			migratesqlschema: rfMigrateSQLSchema,
			success: function (data) { console.log (data); },
			error: function (data) { console.log (data); }
		}, params);

		var m = params.migratesqlschema;

		$.each(m, function(i) {
			rfFunction.migrate2Schema({ table: m[i].table, method: m[i].method, column: m[i].column });
			rfFunction.migrate2SQL({ name: m[i].name, table: m[i].table, method: m[i].method, up: m[i].up, down: m[i].down });
		});
	},
	migrate: function (params) {
		var params = $.extend({
			migration: rfMigration,
			success: function (data) { console.log ('Migrated:: ' + data + ' / ' + rfSQL.lm); },
			error: function (data) { console.log (data); }
		}, params);

		var m = params.migration;
		var result = {};
		var counter = 0;

		$.each(m, function(i) {
			if(rfSQL.lm <= i) {
				$.each(m[i].up, function(j){
					rfSQL.exec({ 
						query: m[i].up[j], 
						values: m[i].values, 
						success: function(data){
							result = { status: 'Success::', name: m[i].name, query: m[i].up[j], data: data };
							rfSQL.lm = m[i].id;

							// params.success(result);
						}, 
						error: function(data){ 
							result = { status: 'Error::', name: m[i].name, query: m[i].up, data: data };
							
							params.error(result); 
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
			success: function (data) { console.log (data); },
			error: function (data) { console.log (data); }
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
				// console.log('Seed:: ' + i);

				var column_count = [];
				var column_values = [];

				for( var j = 0; j < column_names.length; j ++ ) {
					var faker = rfFunction.faker({ type: column_types[j], params: column_params[j] });

					column_values.push(faker);
					column_count.push('?');
					// console.log(i + ' ' + column_names[j] + ' : ' + column_types[j] + ' - ' + column_values[j]);
				}

				var query = "INSERT INTO " + params.table + " ( " + column_names.join() + " ) VALUES ( " + column_count.join() + " )";
				var values = column_values;
				// console.log(query, values);

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