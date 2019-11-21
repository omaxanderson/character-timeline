export default `
CREATE TABLE nickname (
  nickname_id int PRIMARY KEY AUTO_INCREMENT,
  character_id int NOT NULL,
  name varchar(255) NOT NULL
);
`;
