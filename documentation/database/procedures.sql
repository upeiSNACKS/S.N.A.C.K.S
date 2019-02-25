DELIMITER //
CREATE PROCEDURE update_table_metrics(IN tname VARCHAR(64)) 
    BEGIN
        SET @n = tname;
        SET @text = CONCAT('ANALYZE TABLE ', @n);
        PREPARE s1 FROM @text;
        EXECUTE s1; 
        DEALLOCATE PREPARE s1;
        UPDATE Table_metrics SET TABLE_ROWS = 
            (SELECT TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = tname) 
            WHERE TABLE_NAME = tname;
    END
//
