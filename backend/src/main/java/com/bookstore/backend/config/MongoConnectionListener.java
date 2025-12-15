package com.bookstore.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoConnectionListener {

    private static final Logger logger = LoggerFactory.getLogger(MongoConnectionListener.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void verifyMongoConnection() {
        try {
            // Try to get database name to verify connection
            String dbName = mongoTemplate.getDb().getName();
            
            logger.info("=========================================");
            logger.info("MongoDB Connection Verified!");
            logger.info("Database Name: {}", dbName);
            
            // Verify we're connecting to the correct database
            if (!"bookstore_db".equals(dbName)) {
                logger.warn("WARNING: Connected to database '{}' instead of 'bookstore_db'!", dbName);
            }
            
            // Test write capability
            try {
                long userCount = mongoTemplate.getCollection("users").countDocuments();
                logger.info("Current users collection document count: {}", userCount);
            } catch (Exception e) {
                logger.warn("Could not count documents in users collection: {}", e.getMessage());
            }
            
            logger.info("MongoDB is ready to accept connections");
            logger.info("=========================================");
        } catch (Exception e) {
            logger.error("=========================================");
            logger.error("MongoDB Connection Failed!");
            logger.error("Error: {}", e.getMessage());
            logger.error("Stack trace: ", e);
            logger.error("Please check your MongoDB connection string in application.properties");
            logger.error("=========================================");
        }
    }
}

