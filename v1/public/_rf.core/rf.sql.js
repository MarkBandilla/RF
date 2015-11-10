var rfSQL = {
	db: null,
	lm: 0,

	init: function () {
		rfFunction.log('Running SQL Init');

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

		rfFunction.log('Connecting:: ' + params.dbname);

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

		rfFunction.log('Running ExecuteSQL');

		if(!this.db) {
			params.error("Error:: DB does not exists");
			return;
		} 

		this.db.transaction(function (t) {
	        t.executeSql(params.query, params.values, params.success, params.error);
	    });
	},
	migratesqlschema: function (params) {
		rfFunction.log('Running migratesqlschema..' + rfSQL.lm);
		var params = $.extend({
			migratesqlschema: rfMigrateSQLSchema,
			migrate: false,
			limit: 0,
			success: function () { rfSQL.goMigrate(); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		var m = params.migratesqlschema;

		if(params.limit != 0) var ml = params.limit;
		else var ml = m.length;
		var lm = rfSQL.lm;

		$.each(m, function(i) {
			rfFunction.migrate2Schema({ table: m[i].table, method: m[i].method, column: m[i].column });
			rfFunction.migrate2SQL({ name: m[i].name, table: m[i].table, method: m[i].method, up: m[i].up, down: m[i].down });

			if((i == lm && !params.migrate) || (ml == i+1 && params.migrate)) {
				params.success();
				return false;
			}
		});
	},
	migrate: function (limit) {
		rfSQL.migratesqlschema({migrate: true, limit: limit});
	},
	goMigrate: function (params) {
		rfFunction.log('Running goMigrate..');

		var params = $.extend({
			migration: rfMigration,
			success: function (data) { 
				if(rfSQL.lm != parseInt(data)) {
					rfSQL.lm = data;
					rfFunction.updateMigration('migration', rfSQL.lm);
					rfFunction.log ('Migrated:: ' + data + ' / ' + rfSQL.lm); 
				}
			},
			error: function (data) { rfFunction.log (data); }
		}, params);

		var m = params.migration;
		var ml = m.length;
		var counter = 0;

		$.each(m, function(i) {
			rfFunction.log('Migrate:: ' + m[i].name);

			if (m[i].name == "database_reset") {
				$.each(rfSchema, function(i, value){ 
					rfFunction.log(i + ' reset..');
					var query = 'DROP TABLE ' + i;
					rfSQL.exec({ 
						query: query, 
						success: function(t, r){
							rfFunction.log(r);
						}, 
						error: function(t, e){
							rfFunction.log(e.message);
						} 
					});
				});
			} else {
				$.each(m[i].up, function(j){
					rfFunction.log(m[i].up[j]);
					rfSQL.exec({ 
						query: m[i].up[j], 
						values: m[i].values, 
						success: function(t, r){
							rfFunction.log(r);
						}, 
						error: function(t, e){
							rfFunction.log(e.message);
						} 
					});
				});
			}			
			if(ml == i+1) {
				params.success(i);
			}
		});
	},
	rollback: function (migration) {
		
		var m = rfMigration.reverse();
		var ml = m.length;
		var counter = 0;

		$.each(m, function(i) {
			rfFunction.log('Rollback:: ' + m[i].name + m[i].id);
			if(m[i].id > migration) {
				if (m[i].name == "database_reset") {
					$.each(rfSchema, function(i, value){ 
						rfFunction.log(i + ' reset..');
						var query = 'DROP TABLE ' + i;
						rfSQL.exec({ 
							query: query, 
							success: function(t, r){
								rfFunction.log(r);
							}, 
							error: function(t, e){
								rfFunction.log(e.message);
							} 
						});
					});
				} else {
					$.each(m[i].up, function(j){
						rfFunction.log(m[i].down[j]);
						rfSQL.exec({ 
							query: m[i].down[j], 
							values: m[i].values, 
							success: function(t, r){
								rfFunction.log(r);
							}, 
							error: function(t, e){
								rfFunction.log(e.message);
							} 
						});
					});
				}			
			} else {			
				rfFunction.updateMigration('migration', migration);
			}
		});
	},
	seed: function (params) {
		var params = $.extend({
			table: 'all',
			rows: 10,
			success: function (data) { rfFunction.log (data); },
			error: function (data) { rfFunction.log (data); }
		}, params);

		if(params.table == 'all') {
			$.each(rfSchema, function(i, value){ 
				rfSQL.goSeed({table: i, rows: params.rows}); 
			});
		} else {
			rfSQL.goSeed({table: params.table, rows: params.rows});
		}
	},
	goSeed: function (params) {
		var params = $.extend({
			table: '',
			rows: 10,
			success: function (t, r) { rfFunction.log ('Seeded:: ' + params.table + ', ' + params.rows + ' rows'); },
			error: function (t, e) { rfFunction.log (e.message); }
		}, params);

		var schema = rfFunction.schema({ table: params.table }).column;
		rfFunction.log('Seeding:: ' + params.table);
		rfFunction.log(schema);

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
					success: function(t, r) {
						params.success(t, r);
					},
					error: function(t, e) {
						params.error(t, e);
					}
				});

				if(i + 1 == params.rows) params.success('Seeded:: ' + params.rows + 'rows into ' + params.table);
			}
		} else {
			params.error('Error:: Could not read schema from ' + params.table);
		}
	}
};