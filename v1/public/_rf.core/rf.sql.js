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
			success: function (data) { console.log (data); },
			error: function (data) { console.log (data); }
		}, params);

		if(!this.db) return;

		this.db.transaction(function (t) {
	        t.executeSql(params.query, params.values, 
	        	function (t, r) {
		            params.success(r.rows);
		        }, function (t, e) {
		        	params.error("Error : '" + params.query + "' : " + e.message);
		        }
	        );
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

	}
};