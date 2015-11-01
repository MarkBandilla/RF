var rfSQL = {
	db: null,
	lm: 0,

	connect: function (params) {
		var params = $.extend({
			dbname: 'db',
			version: '1.0',
			description: 'description'
		}, params);

		var odb = window.openDatabase;
	    
	    if(!odb) {
	        return 'Web SQL Not Supported';
	    } else {
	        this.db = odb( params.dbname, params.version, params.description, 10 * 1024 * 1024 );
	        return 'DB::' + params.dbname + ' was created!';
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
	migrate: function (params) {
		var params = $.extend({
			migration: rfMigration,
			success: function (data) { console.log (data, 'Migrated:: ' + rfSQL.lm); },
			error: function (data) { console.log (data); }
		}, params);

		var m = params.migration;
		var result = {};
		var s = [];
		var e = [];

		$.each(m, function(i) {
			rfSQL.exec({ 
				query: m[i].up, 
				values: m[i].values, 
				success: function(data){
					result = { status: 'Success::', name: m[i].name, query: m[i].up, data: data };
					rfSQL.lm = m[i].id;

					params.success(result);
				}, 
				error: function(data){ 
					result = { status: 'Error::', name: m[i].name, query: m[i].up, data: data };
					
					params.error(result); 
				} 
			});
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

		var schema = rfFunc.schema({ table: params.table });

		if(schema) {
			var column_names = [];
			var column_types = [];

			$.each(schema, function (c, v) {
				column_names.push( v.name );
				column_types.push( v.seed );
			});
			for( var i = 0; i < params.rows; i ++ ) {
				// console.log('Seed:: ' + i);

				var column_count = [];
				var column_values = [];

				for( var j = 0; j < column_names.length; j ++ ) {
					var faker = rfFunc.faker({ type: column_types[j] });

					column_values.push(faker);
					column_count.push('?');
					// console.log(i + ' ' + column_names[j] + ' : ' + column_types[j] + ' - ' + column_values[j]);
				}

				var query = "INSERT INTO " + params.table + " ( " + column_names.join() + " ) VALUES ( " + column_count.join() + " )";
				var values = column_values;
				//console.log(query, values);

				rfSQL.exec({ query: query, values: values, 
					success: function(data) {
						params.success({ table: params.table, query: this.query, values: this.values });
					},
					error: function(data) {
						params.error(data);
					}
				});
			}

			params.success('Seed:: ' + params.rows + 'rows into ' + params.table);
		} else {
			params.error('Error:: Could not read schema from ' + params.table);
		}

	}
};