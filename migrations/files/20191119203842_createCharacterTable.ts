export default `CREATE TABLE characters (
  character_id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  series_id int,
  book_id int NOT NULL
);`;
