# RFv1 Core

# rfSQL
rfSQL implements Local Web SQL storage

### rfSQL.connect
>Connect to Local Web SQL database

implements:
```
rfSQL.conntect ( { dbname: "string", version: "string", description: "text" } );
```
execute:
```
rfSQL.conntect ( { dbname: "my_db", version: "1.0", description: "My Awesome Web SQL Database" } );
```
success response:
```
DB::my_db was created!
```
errors response:
```
Web SQL Not Supported
```


### rfSQL.exec
>Execute SQL Query

implements:
```
rfSQL.exec ( { query: "string", values: "array", success: "function", error: "function" } );
```
execute:
```
rfSQL.exec ( { 
	query: "SELECT * FROM tbl_users WHERE id = ? AND status = ?", 
	values: [1, 'Active'], 
	success: function (response) {
		console.log(response);
	},
	error: function (response) {
		console.log(response);
	}
} );
```
error response:
```
Error:: DB does not exists
```
```
Error:: 'SELECT * FROM tbl_users WHERE id = ? AND status = ?', [1,Active] 
: could not prepare statement (1 no such table: tbl_users)
```
success response:
```
Insert row: 1
```
```
{
	"0":{"id":1,"username":"mark","password":"password","fullname":"Mark Bandilla"},
	"1":{"id":2,"username":"bobs","password":"password","fullname":"Bobs Marly"}
}
```

