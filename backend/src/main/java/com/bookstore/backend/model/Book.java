package com.bookstore.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

// @Data from Lombok creates the getters, setters, and constructors.
@Data
// @Document maps this class to a MongoDB collection called 'books'.
@Document(collection = "books")
public class Book {

    // These attributes come directly from your identified attributes
    @Id
    private String book_id; // Book_id
    private String title; // Title
    private String author; // Author
    private double price; // Price
    private String description; // Description
    private String genre; // Genre
    private String publisher; // Publisher
    private String language; // Language
    private int stockQuantity; // stock_quantity
    private String coverImageUrl; // cover_image_url
    private LocalDate publishedDate; // published_date
}