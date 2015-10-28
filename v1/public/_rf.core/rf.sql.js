var rfSQL = {
	db: null,
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
	read: function (params) {
		var params = $.extend({
			query: '',
			values: []
		}, params);

		if(!this.db) return;
		
		this.db.readTransaction(function (t) {
            t.executeSql(params.query, params.values, function (t, r) {
                return r.rows;
            });
        });
	},
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
	        return params.dbname + '::DB was created!';
	    }
	}
};