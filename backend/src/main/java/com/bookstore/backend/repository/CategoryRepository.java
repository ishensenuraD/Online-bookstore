package com.bookstore.backend.repository;

import com.bookstore.backend.model.Category; // Import the Category model
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// @Repository marks this as the data access component
@Repository
// We extend MongoRepository, telling Spring to use the Category Model and
// String (for the category_id type)
public interface CategoryRepository extends MongoRepository<Category, String> {

    // Spring Data automatically handles all basic database operations for the
    // Category entity.
}