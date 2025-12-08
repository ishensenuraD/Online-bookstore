package com.bookstore.backend.service;

import com.bookstore.backend.model.Book; // Import the Model
import com.bookstore.backend.repository.BookRepository; // Import the Repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// @Service marks this class as the business logic layer component
@Service
public class BookService {

    // Spring injects the Repository here, so the Service can use it
    @Autowired
    private BookRepository bookRepository;

    // CREATE / SAVE (Admin Panel: Add Book)
    public Book save(Book book) {
        // Example of Business Logic: If we find a problem, we throw an error!
        if (book.getPrice() <= 0) {
            throw new IllegalArgumentException("Book price must be greater than zero.");
        }
        return bookRepository.save(book); // Delegate the saving task to the Repository
    }

    // READ ALL (Admin Panel & Book Browsing)
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    // READ ONE (View single book details)
    public Optional<Book> findById(String id) {
        return bookRepository.findById(id);
    }

    // UPDATE (Admin Panel: Edit Book)
    public Book update(String id, Book bookDetails) {
        Optional<Book> bookOptional = bookRepository.findById(id);

        if (bookOptional.isPresent()) {
            Book existingBook = bookOptional.get();
            // Update fields (we only update fields passed in the request body)
            existingBook.setTitle(bookDetails.getTitle());
            existingBook.setAuthor(bookDetails.getAuthor());
            existingBook.setPrice(bookDetails.getPrice());
            existingBook.setStockQuantity(bookDetails.getStockQuantity());

            return bookRepository.save(existingBook); // Save the updated data
        } else {
            throw new RuntimeException("Book not found with id: " + id);
        }
    }

    // DELETE (Admin Panel: Delete Book)
    public void delete(String id) {
        bookRepository.deleteById(id);
    }
}