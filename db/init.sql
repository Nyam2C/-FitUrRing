CREATE TABLE USER (
    user_id VARCHAR(255) PRIMARY KEY,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_gender VARCHAR(50),
    user_age INT,
    user_email VARCHAR(255) UNIQUE,
    user_phone VARCHAR(20),
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_last_login TIMESTAMP
);

CREATE TABLE ROUTINE (
    routine_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255),
    routine_name VARCHAR(255),
    routine_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

CREATE TABLE VIDEO (
    video_id INT PRIMARY KEY,
    video_title VARCHAR(255),
    video_description TEXT,
    video_tag VARCHAR(255),
    video_url VARCHAR(255)
);

CREATE TABLE MUSCLE (
    muscle_id INT PRIMARY KEY AUTO_INCREMENT,
    muscle_name VARCHAR(255),
    muscle_info TEXT,
    muscle_tag VARCHAR(255)
);

CREATE TABLE FOOD_100G (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(255),
    energy_kcal DECIMAL(5,2),
    carbohydrate DECIMAL(5,2),
    protein DECIMAL(5,2),
    fat DECIMAL(5,2),
    dietary_fiber DECIMAL(5,2),
    sugar DECIMAL(5,2),
    salt DECIMAL(5,2),
    vitamin VARCHAR(255),
    mineral VARCHAR(255)
);

CREATE TABLE ROUTINE_COMPONENT (
    component_id INT PRIMARY KEY AUTO_INCREMENT,
    routine_id INT,
    video_id INT,
    component_sets INT,
    FOREIGN KEY (routine_id) REFERENCES ROUTINE(routine_id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES VIDEO(video_id) ON DELETE CASCADE
);