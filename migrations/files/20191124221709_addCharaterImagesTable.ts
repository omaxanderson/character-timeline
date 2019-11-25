export default `CREATE TABLE character_image (
   character_id INT,
   image_url VARCHAR(500),
   PRIMARY KEY (character_id, image_url)
)`;
