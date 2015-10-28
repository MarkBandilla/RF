var rfQuery = {
	insertUsers: {
		query: 'INSERT INTO users (username, fullname, password) VALUES (?, ?, ?)',
		values: ['mark', 'mark bandilla', 'pogiako']
	},
	insertContacts: {
		query: 'INSERT INTO contacts (user_id, email, number) VALUES (?, ?, ?)',
		values: [1, 'markbandilla.dpwm@yahoo.com', '(+63) 927-6995784']
	}
}