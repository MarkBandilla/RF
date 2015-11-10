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

  $('#templates').remove();

  listTables();
  listMigration();
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

  return false;
}
function listMigration() {
  var template = $('#tpl_dbMigrations').html();
  $('#dbMigrations').html('');
  $.each(rfMigrateSQLSchema, function(i){
    var html = Mustache.render(template, rfMigrateSQLSchema[i]);
    $('#dbMigrations').append(html);
  });
}


function switchMigrate(id) {
  if(id < rfSQL.lm) rfSQL.rollback(id);
  else if(id > rfSQL.lm) rfSQL.migrate(id);
}