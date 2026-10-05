const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lacacaesbonita1',
  database: 'login'
});

conexion.connect((err) => {
  if (err){
     throw err;}
  else{
  console.log('Conectado a MySQL');}
});

conexion.end();