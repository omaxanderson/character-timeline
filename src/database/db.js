import mysql from 'mysql';
import config from './config';

export default class Db {
   static query(sql, params) {
      return new Promise((resolve, reject) => {
         const connection = mysql.createConnection(config);
         connection.connect();

         let formatted = sql;
         if (params) {
            formatted = Db.format(sql, params);
         }

         connection.query(formatted, (err, rows) => {
            if (err) {
               reject(err);
            } else {
               resolve(rows);
            }
            connection.end();
         });
      });
   }

   static format(sql, params) {
      return mysql.format(sql, params);
   }

   static async fetchOne(sql) {
      const result = await this.query(sql);
      return result[0];
   }

   /* Insert a row into the database
    *
    * @param table String
    * @param values Object - contains the key-value pairs that are to be inserted
    * @param ignore Boolean - whether or not to INSERT IGNORE
    */
   static insert(table, values, ignore = false) {
      const columns = Db.format(Object.keys(values).filter(key => values[key]).join(', '));
      const columnString = Object.values(values).filter(val => val).map(() => '?');
      const data = Object.values(values).filter(val => val);
      const sql = Db.format(`INSERT ${ignore ? 'IGNORE ' : ''}INTO ${table} (${columns}) VALUES (${columnString})`, data);
      console.log(sql);
      return this.query(sql);
   }
}
