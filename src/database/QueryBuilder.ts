import Db from './db';

class QueryBuilder {
   constructor() {
      this._table = null;
      this._select = [];
      this._joins = [];
      this._where = [];
      this._groupBy = [];
      this._having = [];
      this._order = [];
      this._sql = null;
   }


   from(table) {
      if (this._table) {
         throw new Error('Table has already been set');
      }
      this._table = table;
      return this;
   }

   addSelect(select) {
      this._select.push(select);
      return this;
   }

   addJoin(join) {
      this._joins.push(join);
      return this;
   }

   addWhere(where) {
      this._where.push(where);
      return this;
   }

   addGroupBy(groupBy) {
      this._groupBy.push(groupBy);
      return this;
   }

   addHaving(having) {
      this._having.push(having);
      return this;
   }

   addOrder(order) {
      this._order.push(order);
      return this;
   }

   // Used internally to build the sql statement
   _buildQuery() {
      if (!this._table) {
         throw new Error('Table name required!');
      }
      if (!this._select.length) {
         // throw { error: "Select statement required" };
         this._select.push('*');
      }

      let sql = 'SELECT ';
      sql += this._select.join(', ');

      sql += ' FROM ';
      sql += this._table;

      sql += ' ';
      sql += this._joins.join(' ');

      sql += this._where.length ? ' WHERE ' : '';
      sql += this._where.map((clause) => {
         if (clause.toLowerCase().includes(' or ')) {
            return `(${clause})`;
         }
         return clause;
      }).join(' AND ');

      sql += this._groupBy.length ? ' GROUP BY ' : '';
      sql += this._groupBy.join(', ');

      sql += this._having.length ? ' HAVING ' : '';
      sql += this._having.map((clause) => {
         if (clause.toLowerCase().includes(' or ')) {
            return `(${clause})`;
         }
         return clause;
      }).join(' AND ');

      sql += this._order.length ? ' ORDER BY ' : '';
      sql += this._order.join(' AND ');

      this._sql = sql;
   }

   async execute() {
      this._buildQuery();

      const result = await Db.query(this._sql);
      return result;
   }
}

export default QueryBuilder;
