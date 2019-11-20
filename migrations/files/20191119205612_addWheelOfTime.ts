export default `
INSERT INTO series (title) VALUES ('The Wheel of Time');
INSERT INTO book (title, book_number) VALUES
('The Eye of the World', 1),
('The Great Hunt', 2),
('The Dragon Reborn', 3),
('The Shadow Rising', 4),
('The Fires of Heaven', 5),
('Lord of Chaos', 6),
('A Crown of Swords', 7),
('The Path of Daggers', 8),
("Winter's Heart", 9),
('Crossroads of Twilight', 10),
('Knife of Dreams', 11),
('The Gathering Storm', 12),
('Towers of Midnight', 13),
('A Memory of Light', 14),
('New Sprint', 0);
INSERT INTO series_book VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(0, 1);
`;
