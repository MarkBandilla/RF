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