var rfQuery = {
	resetMigration: {
		query: 'DROP TABLE rf_migration'
	},
	createMigration: [
		'CREATE TABLE IF NOT EXISTS rf_migration (' +
            'id INTEGER PRIMARY KEY,' +
            'property VARCHAR(100),' +
            'value INTEGER,' +
            'created_at DATETIME,' +
            'modified_at DATETIME' +
        ')',
		'INSERT INTO rf_migration (property, value, created_at, modified_at) ' +
			'VALUES ("migration", 0, "' + moment().format('YYYY-MM-DD hh:mm:ss') + '", "' + moment().format('YYYY-MM-DD hh:mm:ss') + '")'
	],
	getMigrationSettings: 'SELECT * FROM rf_migration',
	updateMigrationSettings: 'UPDATE rf_migration SET value = ? WHERE property = ?',
	insertUsers: {
		query: 'INSERT INTO users (username, fullname, password) VALUES (?, ?, ?)',
		values: ['mark', 'mark bandilla', 'pogiako']
	},
	insertContacts: {
		query: 'INSERT INTO contacts (user_id, email, number) VALUES (?, ?, ?)',
		values: [1, 'markbandilla.dpwm@yahoo.com', '(+63) 927-6995784']
	}
}