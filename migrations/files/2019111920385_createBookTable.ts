export default `CREATE TABLE book (
  book_id int PRIMARY KEY AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  book_number int DEFAULT 1
);`;
