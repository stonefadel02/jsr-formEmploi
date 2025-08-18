// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("test");

db.employers.insertOne({
    companyName: "Administration JSR",
    email: "admin@example.com",
    password: "$2a$12$ffxmjDXu.wwSuMzI6le9re5kPW9Grfwmjl7g5lh7cRESFARkFXXmK",
    role: "admin",
    isActive: true,
    termsAccepted: true,
    createdAt: new Date(),
    updatedAt: new Date()
});