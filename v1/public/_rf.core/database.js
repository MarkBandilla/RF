initLayout();

function initLayout() {
  // w2layout script
  var tstyle = 'background: #fff; border: 1px solid #dfdfdf; overflow: hidden;';
  var pstyle = 'background: #fff; border: 1px solid #dfdfdf;';
  var cstyle = 'background: #000; border: 1px solid #dfdfdf;';
  var sstyle = 'min-width: 355px; background: #fff; border: 1px solid #dfdfdf;';
  $('#layout').w2layout({
    name: 'layout',
    padding: 4,
    panels: [{ 
      type: 'top', 
      size: 36, 
      style: tstyle, 
      content: $('#tplTop').html()
    },{
      type: 'main'
    }, {
      type: 'preview',
      size: '30%',
      resizable: true,
      style: sstyle,
      content: $('#tplPreview').html()
    }]
  });

  $().w2layout({
    name: 'layout2',
    panels: [{
      type: 'main',
      style: pstyle,
      content: $('#tplMain').html()
    }, {
      type: 'left', 
      size: 350, 
      resizable: true,
      style: pstyle, 
      content: $('#tplLeft').html()
    }, {
      type: 'right',
      size: 350,
      resizable: true,
      style: sstyle,
      content: $('#tplRight').html()
    }]
  });

  w2ui['layout'].content('main', w2ui['layout2']);

  $('#templates').remove();
}


function listData(table) {
  listColumns(table);
  listRows(table);

  return false;
}
function listTables() {
  var template = $('#tpl_dbTables').html();
  $('#dbTables').html('');

  $.each(rfSchema, function(i, value){
    var table = {name: i, columns: rfSchema[i].column.length};
    var html = Mustache.render(template, table);

    $('#dbTables').append(html);
  });
}
function listColumns(table) {
  var template = $('#tpl_dbColumns').html();
  $('#dbColumns').html('');
  var columns = rfFunction.sort({array: rfSchema[table].column, key: 'order'});

  $.each(columns, function(i, value){
    var html = Mustache.render(template, value);
    $('#dbColumns').append(html);    
  });
}
function listRows(table) {
  var templateHead = $('#tpl_dbRowsHead').html();
  var templateBody = $('#tpl_dbRowsBody').html();

  $('#dbRows').html('<thead></thead><tbody></tbody>');

  var rowshead = rfFunction.sort({array: rfSchema[table].column, key: 'order'});

  $('#dbRows thead').append('<tr></tr>'); 

  $.each(rowshead, function(i, value){
    var html = Mustache.render(templateHead, value);
    $('#dbRows thead tr').append(html); 
  });

  var query = 'SELECT * FROM ' + table;



  rfSQL.exec({
    query: query, 
    success: function(t, r) {
      $.each(r.rows, function(row, value){
        $('#dbRows tbody').append('<tr></tr>'); 
        $.each(rowshead, function(column, value){
          var column = value.name;
          var html = '<td>' + r.rows[row][column] + '</td>';
          console.log(html);
          $('#dbRows tbody tr').append(html); 
        });
      });
    },
    error: function(t, e) {
      alert(e.message);
    }
  });
   
}
function listMigration() {
  $('#dbMigrations').html('');
  $.each(rfMigrateSQLSchema, function(i){
    if(rfSQL.lm >= i) var template = $('#tpl_dbMigrations_active').html();
    else var template = $('#tpl_dbMigrations').html();
    var html = Mustache.render(template, rfMigrateSQLSchema[i]);
    $('#dbMigrations').append(html);
  });
}


function switchMigrate(id) {
  if(id < rfSQL.lm) rfSQL.rollback(id);
  else if(id > rfSQL.lm) rfSQL.migrate(id);
}