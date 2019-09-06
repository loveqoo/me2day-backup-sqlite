CREATE TABLE IF NOT EXISTS PEOPLE (
                                      id           VACHAR(50) PRIMARY KEY,
                                      nick_name    VARCHAR(50) NOT NULL,
                                      profile_path VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS POST (
                                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                    content    VARCHAR(100) NOT NULL,
                                    writer     VACHAR(50)   NOT NULL,
                                    created_at TIMESTAMP    NOT NULL,
                                    FOREIGN KEY (writer) REFERENCES PEOPLE(id)
);

CREATE TABLE IF NOT EXISTS COMMENT (
                                       id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                       content    VARCHAR(100) NOT NULL,
                                       writer     VACHAR(50)   NOT NULL,
                                       post_id    LONG         NOT NULL,
                                       created_at TIMESTAMP    NOT NULL,
                                       FOREIGN KEY (writer) REFERENCES PEOPLE(id),
                                       FOREIGN KEY (post_id) REFERENCES POST(id)
);

CREATE TABLE IF NOT EXISTS TAG (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS POST_TAG (
    post_id LONG NOT NULL,
    tag_id LONG NOT NULL,
    FOREIGN KEY (post_id) REFERENCES POST(id),
    FOREIGN KEY (tag_id) REFERENCES TAG(id)
);