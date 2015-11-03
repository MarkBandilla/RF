var rfMigrate = [
	{
		id: 0,
		table: '',
		name: 'database_reset',
		method: 'resetDataBase',
		up: ['DROP TABLE rf_input_types'],
	}, {
		id: 1,
		table: 'rf_input_types',
		name: 'create_table_rf_input_types',
		created_at: '2015-11-03 01:58:34',
		method: 'createTable',
		column: [
			{ type: 'auto_id', name: 'id', order: 0 },
			{ type: 'datetime_now', name: 'created_at', seed: 'datetime_now', order: 0 },
			{ type: 'datetime_now', name: 'modified_at', seed: 'datetime_now', order: 0 }
		],
		up: [
		'CREATE TABLE IF NOT EXISTS rf_input_types (' +
            'id INTEGER PRIMARY KEY,' +
            'created_at DATETIME,' +
            'modified_at DATETIME' +
        ')' 
		],
		down: 'DROP TABLE rf_input_types',
	}, {
		id: 2,
		table: 'rf_input_types',
		created_at: '2015-11-03 01:58:34',
		name: 'create_column_into_rf_input_types',
		method: 'createColumn',
		column: [
			{ type: 'string', name: 'string', seed: 'string', order: 1,
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
			{ type: 'number', name: 'number', seed: 'number', order: 2,
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
			{ type: 'float', name: 'float', seed: 'float', order: 3,
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
			{ type: 'email', name: 'email', seed: 'email', order: 4,
				params: {
					label: 'E-Mail',
					placeholder: 'mail@host.com',
					default: '',
					validation: {
						blacklist: ['@yopmail.com', '@host.com'],
						unique: true
					}
				}
			},
			{ type: 'url', name: 'url', seed: 'url', order: 5,
				params: {
					label: 'URL',
					placeholder: 'http://www.yourwebsite.com',
					default: '',
					validation: {
						mask: 'http://www.???.com'
					}
				} 
			},
			{ type: 'password', name: 'password', seed: 'password', order: 6,
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
			{ type: 'text', name: 'text', seed: 'text', order: 7,
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
			{ type: 'date', name: 'date', seed: 'date', order: 8, 
				params: {}
			},
			{ type: 'time', name: 'time', seed: 'time', order: 9, 
				params: {}
			},
			{ type: 'file', name: 'file', seed: 'image', order: 10,
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
			{ type: 'radio', name: 'radio', seed: 'select', order: 11,
				params: {
					options: ['on', 'off']
				}
			},
			{ type: 'checkbox', name: 'checkbox', seed: 'select', order: 12,
				params: {
					options: ['value1', 'value2']
				} 
			},
			{ type: 'select', name: 'selected', seed: 'select', order: 13,
				params: { 
					multiple: false, 
					values: [1, 0], 
					options: ['active', 'inactive']
				} 
			},
			{ type: 'query', name: 'query', seed: 'query', order: 14,
				params: { 
					query: rfQuery.function, 
					multiple: false, 
					values: "id", 
					options: "column" 
				} 
			},
			{ type: 'session', name: 'session', seed: 'session', order: 15,
				params: { 
					query: rfQuery.icons, 
					multiple: false, 
					values: "id", 
					options: "icon" 
				} 
			}
		],
		up: [
			'ALTER TABLE rf_input_types ADD string VARCHAR(100)',
			'ALTER TABLE rf_input_types ADD number INTEGER',
			'ALTER TABLE rf_input_types ADD float DECIMAL(10, 5)',
			'ALTER TABLE rf_input_types ADD email VARCHAR(150)',
			'ALTER TABLE rf_input_types ADD url VARCHAR(200)',
			'ALTER TABLE rf_input_types ADD password VARCHAR(250)',
			'ALTER TABLE rf_input_types ADD text TEXT',
			'ALTER TABLE rf_input_types ADD date DATE',
			'ALTER TABLE rf_input_types ADD time TIME',
			'ALTER TABLE rf_input_types ADD file BLOB',
			'ALTER TABLE rf_input_types ADD radio TEXT',
			'ALTER TABLE rf_input_types ADD checkbox TEXT',
			'ALTER TABLE rf_input_types ADD selected TEXT',
			'ALTER TABLE rf_input_types ADD query TEXT',
			'ALTER TABLE rf_input_types ADD session TEXT'
		],
		down: [
			'ALTER TABLE rf_input_types DROP string',
			'ALTER TABLE rf_input_types DROP number',
			'ALTER TABLE rf_input_types DROP float',
			'ALTER TABLE rf_input_types DROP email',
			'ALTER TABLE rf_input_types DROP url',
			'ALTER TABLE rf_input_types DROP password',
			'ALTER TABLE rf_input_types DROP text',
			'ALTER TABLE rf_input_types DROP date',
			'ALTER TABLE rf_input_types DROP time',
			'ALTER TABLE rf_input_types DROP file',
			'ALTER TABLE rf_input_types DROP radio',
			'ALTER TABLE rf_input_types DROP checkbox',
			'ALTER TABLE rf_input_types DROP select',
			'ALTER TABLE rf_input_types DROP query',
			'ALTER TABLE rf_input_types DROP session',
		],
		values: []
	}
]

var rfMigration = [
	{
		id: 1, 
		name: 'create_table_user', 
		up: 'CREATE TABLE IF NOT EXISTS users (' +
            'id INTEGER PRIMARY KEY,' +
            'email TEXT,' +
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

var rfSchema = {	
	users : {
		id: 1,
		table: 'users',
		method: 'createColumn',
		column: [
			{ type: 'string', name: 'fullname', seed: 'fullname',  order: 3,
				params: {
					label: 'Fullname',
					placeholder: 'FirstName M.I. SurName',
					default: 'string',
					validation: {
						required: true,
						before: '#',
						after: false,
						mask: '',
						min: 3,
						max: 100
					}
				}
			},
			{ type: 'email', name: 'email', seed: 'email', order: 1,
				params: {
					label: 'E-Mail',
					placeholder: 'mail@host.com',
					default: '',
					validation: {
						blacklist: ['@yopmail.com', '@host.com'],
						unique: true
					}
				}
			},
			{ type: 'password', name: 'password', seed: 'password', order: 2,
				params: {
					label: 'Password',
					placeholder: '*****',
					default: '',
					validation: {
						retype: true,
						strength: 'Very Strong'
					}
				}
			}
		]
	},
	rf_input_types : {
		id: 2,
		table: 'rf_input_types',
		created_at: '2015-11-03 01:58:34',
		name: 'create_column_into_rf_input_types',
		method: 'createColumn',
		column: [
			{ type: 'datetime_now', name: 'created_at', seed: 'datetime_now', order: 0,
				params: {}
			},
			{ type: 'datetime_now', name: 'modified_at', seed: 'datetime_now', order: 0,
				params: {}
			},
			{ type: 'string', name: 'string', seed: 'string', order: 1,
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
			{ type: 'number', name: 'number', seed: 'number', order: 2,
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
			{ type: 'float', name: 'float', seed: 'float', order: 3,
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
			{ type: 'email', name: 'email', seed: 'email', order: 4,
				params: {
					label: 'E-Mail',
					placeholder: 'mail@host.com',
					default: '',
					validation: {
						blacklist: ['@yopmail.com', '@host.com'],
						unique: true
					}
				}
			},
			{ type: 'url', name: 'url', seed: 'url', order: 5,
				params: {
					label: 'URL',
					placeholder: 'http://www.yourwebsite.com',
					default: '',
					validation: {
						mask: 'http://www.???.com'
					}
				} 
			},
			{ type: 'password', name: 'password', seed: 'password', order: 6,
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
			{ type: 'text', name: 'text', seed: 'text', order: 7,
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
			{ type: 'date', name: 'date', seed: 'date', order: 8, 
				params: {}
			},
			{ type: 'time', name: 'time', seed: 'time', order: 9, 
				params: {}
			},
			{ type: 'file', name: 'file', seed: 'image', order: 10,
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
			{ type: 'radio', name: 'radio', seed: 'select', order: 11,
				params: {
					options: ['on', 'off']
				}
			},
			{ type: 'checkbox', name: 'checkbox', seed: 'select', order: 12,
				params: {
					options: ['value1', 'value2']
				} 
			},
			{ type: 'select', name: 'selected', seed: 'select', order: 13,
				params: { 
					multiple: false, 
					values: [1, 0], 
					options: ['active', 'inactive']
				} 
			},
			{ type: 'query', name: 'query', seed: 'query', order: 14,
				params: { 
					query: rfQuery.function, 
					multiple: false, 
					values: "id", 
					options: "column" 
				} 
			},
			{ type: 'session', name: 'session', seed: 'session', order: 15,
				params: { 
					query: rfQuery.icons, 
					multiple: false, 
					values: "id", 
					options: "icon" 
				} 
			}
		],
	}
}


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
						unique: true
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
			{ type: 'file', name: 'file', 
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
			{ type: 'image', name: 'image',
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
			{ type: 'avatar', name: 'avatar',
				params: {
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