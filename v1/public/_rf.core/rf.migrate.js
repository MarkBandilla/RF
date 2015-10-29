var rfMigration = [
	{ 
		id: 1, 
		name: 'create_table_user', 
		up: 'CREATE TABLE IF NOT EXISTS users (' +
            'id INTEGER PRIMARY KEY,' +
            'username TEXT,' +
            'password TEXT,' +
            'fullname TEXT' +
        ')',
		down: 'DROP TABLE users',
		value: []
	}, { 
		id: 2, 
		name: 'create_table_contact', 
		up: 'CREATE TABLE IF NOT EXISTS contacts (' +
            'id INTEGER PRIMARY KEY,' +
            'user_id INTEGER,' +
            'email TEXT,' +
            'number TEXT' +
        ')',
		down: 'DROP TABLE contacts',
		values: []
	},
];

var rfMig = [
	{
		id: 1,
		name: 'create_table_users',
		table: 'users',
		up: {
			method: 'createTable'
		},
		down: {
			method: 'dropTable'
		}
	}, {
		id: 2,
		name: 'create_column_into_users',
		table: 'users',
		up: {
			method: 'createColumn',
			column: [
				{ name: 'username', label: 'UserName', type: 'text', required: 'required', info: 'Fullname'  },
				{ name: 'password', label: 'PassWord', type: 'password', required: '', info: 'email@hostname.com' },
				{ name: 'fullname', label: 'FullName', type: 'text', required: '', info: '0000-000-0000' }
			]
		},
		down: {
			method: 'dropColumn',
			column: [
				{ name: 'username' },
				{ name: 'password' },
				{ name: 'fullname' }
			]
		}
	}
]

var rfInput = [
	{
		id: 1,
		name: 'create_table_datatypes',
		table: 'datatypes',
		method: 'createTable'
	}, {
		id: 2,
		name: 'create_column_into_datatypes',
		table: 'datatypes',
		method: 'createColumn',
		column: [
			{ type: 'string', name: 'string', 
				params: {
					label: 'String',
					placeholder: 'put a string',
					default: 'string',
					validation: {
						required: true,
						min: 3,
						max: 10
					}
				}
			},
			{ type: 'number' },
			{ type: 'float' },
			{ type: 'email' },
			{ type: 'url' },
			{ type: 'password' },
			{ type: 'text' },
			{ type: 'blob' },

			{ type: 'date' },
			{ type: 'time' },
			{ type: 'datetime' },
			{ type: 'daterange' },
			{ type: 'datetimerange' },

			{ type: 'file' },
			{ type: 'image' },
			{ type: 'avatar' },

			{ type: 'radio', 
				params: {
					options: ['on', 'off']
				}
			},
			{ type: 'checkbox', 
				params: {
					options: ['value1', 'value2']
				} 
			},
			{ type: 'select', 
				params: { 
					multiple: false, 
					values: [1, 0], 
					options: ['active', 'inactive']
				} 
			},
			{ type: 'query', 
				params: { 
					query: rfQuery.function, 
					multiple: false, 
					values: "id", 
					options: "column" 
				} 
			},
			{ type: 'country', 
				params: { 
					query: rfQuery.country, 
					multiple: false, 
					values: "id", 
					options: "country" 
				} 
			},
			{ type: 'language', 
				params: { 
					query: rfQuery.language, 
					multiple: false, 
					values: "id", 
					options: "language" 
				} 
			},
			{ type: 'icon', 
				params: { 
					query: rfQuery.icons, 
					multiple: false, 
					values: "id", 
					options: "icon" 
				} 
			},
			{ type: 'session', 
				params: { 
					query: rfQuery.icons, 
					multiple: false, 
					values: "id", 
					options: "icon" 
				} 
			}
		]
	}
]