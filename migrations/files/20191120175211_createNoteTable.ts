export default `
CREATE TABLE note (
  note_id int PRIMARY KEY AUTO_INCREMENT,
  character_id int NOT NULL,
  series_id int,
  book_id int NOT NULL,
  chapter_id int NOT NULL,
  content text
);
`;
