var rfFunction = {
	schema: function (params) {
		var params = $.extend({
			table: 'users'
		}, params);

		var schema = rfSchema[params.table];
		// console.log('Schema:: ' + params.table, schema);

		if(schema) {
			console.log(params.table + ' : ');

			var column = rfFunction.sort({ array: schema.column, key: 'order' });

			return column;
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