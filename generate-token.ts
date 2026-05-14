import { signToken } from "./src/lib/jwt.js";

// Grab a real User ID from your Prisma Studio
const token = signToken({ 
  id: "your-actual-user-uuid-from-db", 
  email: "test@example.com" 
});

console.log("Your Test Token:");
console.log(`Bearer ${token}`);