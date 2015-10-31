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

		var schema = rfSQL.schema({ table: params.table });

		if(schema) {
			var column_names = [];
			var column_types = [];

			$.each(schema, function (c, v) {
				column_names.push( v.name );
				column_types.push( v.seed );
			});
			for( var i = 0; i < 10; i ++ ) {
				// console.log('Seed:: ' + i);

				var column_count = [];
				var column_values = [];

				for( var j = 0; j < column_names.length; j ++ ) {
					var faker = rfSQL.faker({ type: column_types[j] });

					column_values.push(faker);
					column_count.push('?');
					// console.log(i + ' ' + column_names[j] + ' : ' + column_types[j] + ' - ' + column_values[j]);
				}

				var query = "INSERT INTO " + params.table + " ( " + column_names.join() + " ) VALUES ( " + column_count.join() + " )";
				var values = column_values;
				//console.log(query, values);

				rfSQL.exec({ query: query, values: values });
			}

			params.success('Seed:: ' + params.rows + 'rows into ' + params.table);
		} else {
			params.error('Error:: Could not read schema from ' + params.table);
		}

	},
	schema: function (params) {
		var params = $.extend({
			table: 'users'
		}, params);

		var schema = rfSchema[params.table];
		// console.log('Schema:: ' + params.table, schema);

		if(schema) {
			console.log(params.table + ' : ');

			var column = sortByKey(schema.column, 'order');

			return column;
		} else {
			return 'error';
		}
	},
	faker: function (params) {
		var params = $.extend({
			type: 'string'
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
		}
	}
};