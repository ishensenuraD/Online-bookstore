package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // CREATE / SAVE
    public Book save(Book book) {
        if (book.getPrice() <= 0) {
            throw new IllegalArgumentException("Book price must be greater than zero.");
        }
        return bookRepository.save(book);
    }

    // READ ALL
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    // READ ONE
    public Optional<Book> findById(String id) {
        return bookRepository.findById(id);
    }

    // UPDATE
    public Book update(String id, Book bookDetails) {
        Optional<Book> bookOptional = bookRepository.findById(id);

        if (bookOptional.isPresent()) {
            Book existingBook = bookOptional.get();
            existingBook.setTitle(bookDetails.getTitle());
            existingBook.setAuthor(bookDetails.getAuthor());
            existingBook.setPrice(bookDetails.getPrice());
            existingBook.setStockQuantity(bookDetails.getStockQuantity());

            return bookRepository.save(existingBook); // Save the updated data
        } else {
            throw new RuntimeException("Book not found with id: " + id);
        }
    }

    // DELETE
    public void delete(String id) {
        bookRepository.deleteById(id);
    }
}