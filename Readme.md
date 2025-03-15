# Command to run
docker-compose up --build
# Test Database 
- docker exec -it postgres_db psql -U product -d product -c "\dt"
- docker exec -it postgres_db psql -U product -d product   
- check task status:
- run following sql if table empty:
    
INSERT INTO task_status (id, status_name)
VALUES
    (1, 'pending'),
    (2, 'processing'),
    (3, 'completed'),
    (4, 'failed')
;
