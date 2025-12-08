package com.bookstore.backend.repository;

import com.bookstore.backend.model.Book; // We import the Book model from the 'model' package
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// @Repository marks this as the data access component
@Repository
// This line tells Spring Data MongoDB:
// "Manage data for the Book entity, where the ID type is String."
public interface BookRepository extends MongoRepository<Book, String> {

    // Spring Data automatically gives you methods like save(), findAll(),
    // findById(), etc.
}