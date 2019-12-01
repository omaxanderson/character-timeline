import mysql, { Connection, Query } from 'mysql';
import { promisify } from 'util';
import config from './config';

interface InsertResult {
   fieldCount: number;
   affectedRows: number;
   insertId: number;
   serverStatus: number;
   warningCount: number;
   message: string;
   protocol41: boolean;
   changedRows: number;
}

type Row = {
   [key: string]: any;
};
type SelectResult = Row[];

interface Config {
   host: string;
   database: string;
   user: string;
   password: string;
}

/**
 * Allows more precise handling, but won't close connection for you so need to be careful here
 */
export const databaseFactory = () => {
   const connection: Connection = mysql.createConnection(config);
   connection.connect();

   return {
      query: (sql: string, params: (string | number)[]) => {
         const formatted: string = params.length > 0 ? Db.format(sql, params) : sql;
         return promisify(connection.query).call(connection, formatted);
      },
      closeConnection: () => {
         return promisify(connection.end).call(connection);
      },
   };
};

export default class Db {
   static getConnection(config: Config): Connection {
      const connection: Connection = mysql.createConnection(config);
      connection.connect();
      return connection;
   }

   static async select(sql: string, params: (string | number)[] = []): Promise<SelectResult> {
       const db = databaseFactory();
       try {
          const result = await db.query(sql, params);
          db.closeConnection();
          return result;
       } catch (err) {
          throw new Error(err);
       }
   }

   static async insert(sql: string, params: (string | number)[] = []): Promise<InsertResult> {
      if (!sql.toLowerCase().startsWith('insert')) {
         throw new Error(`SQL must be an insert statement. Instead got: ${sql.split(' ')[0]}`);
      }
      const db = databaseFactory();
      try {
         const result = await db.query(sql, params);
         db.closeConnection();
         return result;
      } catch (err) {
         throw new Error(err);
      }
      /*
     const connection = Db.getConnection(config);

     const formatted: string = params.length ? Db.format(sql, params) : sql;

     try {
        const results: Query = await connection.query(formatted);
        connection.end();
        return results;
     } catch (err) {
        connection.end();
        throw new Error(err);
     }

       */
   }

   /**
    * @deprecated
    * @param sql
    * @param params
    */
   static query(sql, params: string[] = []): Promise<SelectResult | InsertResult> {
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

   static format(sql, params = []): string {
      return mysql.format(sql, params);
   }

   static async fetchOne(sql: string, params: (number | string)[] = []): Promise<Row> {
      const result = await this.select(sql, params);
      return result[0];
   }

   /* Insert a row into the database
    *
    * @param table String
    * @param values Object - contains the key-value pairs that are to be inserted
    * @param ignore Boolean - whether or not to INSERT IGNORE
    */
   /*
   static insert(table, values, ignore = false): Promise<SelectResult | InsertResult | DatabaseError> {
      const columns = Db.format(Object.keys(values).filter(key => values[key]).join(', '));
      const columnString = Object.values(values).filter(val => val).map(() => '?');
      const data = Object.values(values).filter(val => val);
      const sql = Db.format(`INSERT ${ignore ? 'IGNORE ' : ''}INTO ${table} (${columns}) VALUES (${columnString})`, data);
      return this.query(sql);
   }
    */
}
