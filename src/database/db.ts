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
}
