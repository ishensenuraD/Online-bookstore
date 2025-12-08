package com.bookstore.backend.controller;

import com.bookstore.backend.model.Order;
import com.bookstore.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. PLACE ORDER (Checkout Process - 1.iii)
    // POST: http://localhost:8081/api/orders
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        try {
            Order newOrder = orderService.placeOrder(order);
            return new ResponseEntity<>(newOrder, HttpStatus.CREATED); // 201 Created
        } catch (IllegalArgumentException e) {
            // Catches validation errors like invalid user ID, book not found, or
            // insufficient stock.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 2. READ ALL ORDERS (Admin Panel)
    // GET: http://localhost:8081/api/orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }

    // 3. READ ORDER HISTORY BY USER (User History - 1.v)
    // GET: http://localhost:8081/api/orders/history/{user_id}
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable String userId) {
        List<Order> orders = orderService.findByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orders);
    }
}