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
					placeholder: 'put a string here..',
					default: 'string',
					validation: {
						required: true,
						before: '$',
						after: false,
						mask: '',
						min: 3,
						max: 10
					}
				}
			},
			{ type: 'number', name: 'number', 
				params: {
					label: 'Number',
					placeholder: '(+63) 000-000-0000',
					default: '',
					validation: {
						mask: '(+99) 999-999-9999',
						min: 100,
						max: 200
					}
				}
			},
			{ type: 'float', name: 'float',
				params: {
					label: 'Float',
					placeholder: '000.00',
					default: '',
					validation: {
						mask: '999.99',
						min: 0.00,
						max: 0.00
					}
				}
			},
			{ type: 'email', name: 'email',
				params: {
					label: 'E-Mail',
					placeholder: 'mail@host.com',
					default: '',
					validation: {
						blacklist: ['@yopmail.com', '@host.com'],
						unique: true;
					}
				}
			},
			{ type: 'url', name: 'url',
				params: {
					label: 'URL',
					placeholder: 'http://www.yourwebsite.com',
					default: '',
					validation: {
						mask: 'http://www.???.com'
					}
				} 
			},
			{ type: 'password', name: 'password',
				params: {
					label: 'Password',
					placeholder: '*****',
					default: '',
					validation: {
						retype: true,
						strength: 'Very Strong'
					}
				}
			},
			{ type: 'text', name: 'text',
				params: {
					label: 'Text',
					placeholder: 'Short Bio',
					default: '',
					validation: {
						minphar: 0,
						maxphar: 3
					}
				}
			},
			{ type: 'date' },
			{ type: 'time' },
			{ type: 'file' name: 'file', 
				params: {
					label: 'File',
					default: '',
					validation: {
						minsize: 0,
						maxsize: 10000,
						ext: ['.psd','.doc'],
						loc: 'uploads/files'
					}
				}
			},

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
			{ type: 'session', 
				params: { 
					query: rfQuery.icons, 
					multiple: false, 
					values: "id", 
					options: "icon" 
				} 
			}
		]
	}, {
		id: 3,
		name: 'add_column_into_datatypes',
		table: 'datatypes',
		method: 'createColumn',
		column: [
			{ type: 'currency', name: 'currency',
				params: {
					label: 'Currency',
					placeholder: '0,000,000.00',
					default: '',
					validation: {
						currency: 'PHP',
						mask: '9,999,999.99',
						min: 0.00,
						max: 0.00
					}
				}
			},
			{ type: 'ip', name: 'ip',
				params: {
					label: 'IP',
					placeholder: '192.168.1.100',
					default: '',
					validation: {
						mask: '999.999.999.999'
					}
				} 
			},
			{ type: 'datetime' },
			{ type: 'daterange' },
			{ type: 'datetimerange' },

			{ type: 'blob', name: 'blob', 
				params: {
					label: 'Blob',
					default: '',
					validation: {
						minsize: 0,
						maxsize: 10000,
					}
				}
			},
			{ type: 'image' name: 'image',
				params: {
					label: 'Image',
					default: '',
					validation: {
						minsize: 0,
						maxsize: 10000,
						ext: ['.jpg','.png','.gif'],
						width: [10,50,100],
						height: [10,50,100],
						loc: 'uploads/images'
					}
				}
			},
			{ type: 'avatar' name: 'avatar',
					label: 'Avatar',
					default: '',
					validation: {
						minsize: 0,
						maxsize: 10000,
						ext: ['.jpg','.png','.gif'],
						width: [50],
						height: [10,50,100]
					}
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
			}
		]
	}
]
