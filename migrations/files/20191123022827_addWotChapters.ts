export default `
INSERT INTO chapter (title, chapter_number) VALUES
('Prologue: Dragonmount', -1),
('Prologue: Ravens', 0),
('An Empty Road', 1),
('Strangers', 2),
('The Peddler', 3),
('The Gleeman', 4),
('Winternight', 5),
('The Westwood', 6);

INSERT INTO book_chapter (book_id, chapter_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8);
`;
