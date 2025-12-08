package com.bookstore.backend.repository;

import com.bookstore.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // Custom method to fetch all orders for a specific user (required for Order
    // History)
    List<Order> findByUserId(String user_id);
}