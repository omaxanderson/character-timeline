export default `CREATE TABLE custom_attribute (
  custom_attribute_id int PRIMARY KEY AUTO_INCREMENT,
  character_id int NOT NULL,
  attribute_name varchar(255) NOT NULL,
  value varchar(255) NOT NULL,
  series_id int,
  book_id int NOT NULL,
  chapter_id int NOT NULL
);`;
