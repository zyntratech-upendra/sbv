import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "pavan@gmail.com" });
    if (adminExists) {
      console.log("❌ Admin already exists!");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin@2026", salt);

    // Create admin user
    const admin = await User.create({
      name: "Admin Pavan",
      email: "pavan@gmail.com",
      password: hashedPassword,
      role: "admin",
      phone: "+91-9999999999",
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: pavan@gmail.com");
    console.log("🔐 Password: admin@2026");
    console.log("👤 Role: admin");

    // Create sample teacher
    const teacherPassword = await bcrypt.hash("Teacher@2026", salt);
    const teacher = await User.create({
      name: "Mr. John Smith",
      email: "john@school.com",
      password: teacherPassword,
      role: "teacher",
      phone: "+91-8888888888",
      isActive: true,
    });
    console.log("\n✅ Sample teacher created!");
    console.log("📧 Email: john@school.com");
    console.log("🔐 Password: Teacher@2026");

    // Create sample student
    const studentPassword = await bcrypt.hash("Student@2026", salt);
    const student = await User.create({
      name: "Alice Johnson",
      email: "alice@school.com",
      password: studentPassword,
      role: "student",
      phone: "+91-7777777777",
      isActive: true,
    });
    console.log("\n✅ Sample student created!");
    console.log("📧 Email: alice@school.com");
    console.log("🔐 Password: Student@2026");

    console.log("\n🎉 All users seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
