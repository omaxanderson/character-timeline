import fs from 'fs';
import mysql from 'mysql';
import Db from '../src/database/db';
import config from '../src/database/config';

const connection = mysql.createConnection({
   ...config,
   multipleStatements: true,
});
connection.connect();

const getMigrationsToRun = async () => {
   // Get a list of the files in the directory
   const files = fs.readdirSync('./migrations/files').filter(f => !f.endsWith('.swp'));
   // Get a list of files already run
   try {
      // @ts-ignore
      const results: Object[] = await Db.query('SELECT migration_name FROM migrations');
      // @ts-ignore
      const migrationsRun = results.map(result => result.migration_name);

      const migrationsNotRun = files.filter(migration => !migrationsRun.includes(migration));

      // Sort them by filename timestamp
      migrationsNotRun.sort();
      return migrationsNotRun;
   } catch (err) {
      // likely the migrations table doesn't exist, so we need to just run it anyway
      // Also I feel like this is pretty bad coding practice but eh whatever
      if (err.code === 'ER_NO_SUCH_TABLE') {
         console.log('Creating initial migration table...');
         /* eslint-disable-next-line global-require */
         const initialMigrationTableSql = require('./files/20191119195629_createMigrationsTable.ts').default;
       
         await Db.query(initialMigrationTableSql);
         await Db.query(
            `INSERT INTO migrations (migration_name)
            VALUES ('20191119195629_createMigrationsTable.ts')`
         );
      } else {
         console.log(err);
      }
      return [];
   }
};

// Helper function to run the actual migration
const performMigration = async (migration) => {
   console.log('performing', migration);
   return new Promise(async (resolve, reject) => {
      /* eslint-disable-next-line */
      const migrationSql = require(`./files/${migration}`).default;
      if (migrationSql !== 'QUERY') {
         try {
            await connection.query(migrationSql, async (err, rows) => {
               connection.end();
               if (err) {
                  console.log('rejecting');
                  reject(err);
                  return;
               }

               // if the migration ran, insert it into the database
               await Db.query(`INSERT INTO migrations (migration_name) VALUES ('${migration}')`);

               console.log(`${migration} ran successfully.`);
               resolve();
            });
         } catch (e) {
            console.log(`Error on migration ${migration}: `);
            /* eslint-disable-next-line prefer-promise-reject-errors */
            reject(new Error(e));
         }
      } else {
         reject(new Error('Empty migration...skipping.'));
      }
   });
};

const runAllMigrations = async (migrationsNotRun) => {
   /* eslint-disable-next-line no-restricted-syntax */
   for (const filename of migrationsNotRun) {
      try {
         /* we need to enforce the deoptimization of awaiting on each promise
          * as the migrations need to be run in a specific order
          */
         /* eslint-disable-next-line no-await-in-loop */
         await performMigration(filename);
      } catch (e) {
         console.log(e);
      }
   }
};

(async () => {
   const migrations = await getMigrationsToRun();
   await runAllMigrations(migrations);
   console.log('Done!');
})();
