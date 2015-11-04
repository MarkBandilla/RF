var rfFunction = {
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
	migrate2Schema: function (params) {
		var params = $.extend({
			table: '',
			method: '',
			column: [],
			success: function (data) { console.log (data, 'migrateSchema:: ' + params.table); },
			error: function (data) { console.log (data); }
		}, params);

		switch(params.method) {
			case 'createTable':
				rfSchema[params.table] = { column: params.column };
			break;
			case 'createColumn':
				var oldColumns = rfSchema[params.table].column;
				var newColumns = params.column;

				rfSchema[params.table].column = $.merge(newColumns, oldColumns);
			break;
		}
	},
	migrate2SQL: function (params) {
		var params = $.extend({
			table: '',
			method: '',
			column: [],
			success: function (data) { console.log (data, 'migrateSchema:: ' + params.table); },
			error: function (data) { console.log (data); }
		}, params);

		console.log('migrateSQL:: ', params);
	},
	schema: function (params) {
		var params = $.extend({
			table: 'users'
		}, params);

		var schema = rfSchema[params.table];
		// console.log('Schema:: ' + params.table, schema);

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