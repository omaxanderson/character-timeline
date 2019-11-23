export default `
INSERT INTO chapter (title, chapter_number) VALUES
('Prologue: In the Shadow', 0),
('The Flame of Tar Valon', 1),
('The Welcome', 2),
('Friends and Enemies', 3),
('Summoned', 4),
('The Shadow of Shienar', 5),
('Dark Prophecy', 6),
('Blood Calls Blood', 7),
('The Dragon Reborn', 8);

INSERT INTO book_chapter (book_id, chapter_id) VALUES
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17);
`;

