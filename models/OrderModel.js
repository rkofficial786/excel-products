// const mongoose = require("mongoose")

// const orderSchema = new mongoose.Schema(
//   {
//     products: [
//       {
//         type: mongoose.ObjectId,
//         ref: "Products",
//       },
//     ],
//     payment: {},
//     buyer: {
//       type: mongoose.ObjectId,
//       ref: "user",
//     },
//     status: {
//       type: String,
//       default: "Not Process",
//       enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "Placed",
      enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

// Mongoose middleware to send email on order placement
orderSchema.post("save", async function () {
  try {
    // Fetch the user details using the buyer ObjectId
    const User = mongoose.model("user"); // Assuming you have a User model
    const user = await User.findById(this.buyer);

    // Fetch the product details using the product ObjectId
    const Product = mongoose.model("Products"); // Assuming you have a Products model
    const productPromises = this.products.map((productId) =>
      Product.findById(productId)
    );
    const products = await Promise.all(productPromises);

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      // configure your email transport options (e.g., SMTP)
      service: "Gmail",
      auth: {
        user: "excelshopping0@gmail.com",
        pass: "aqaeynanrrwuzqik",
      },
    });

    const productDetailsHTML = products
      .map(
        (product) =>
          `<li>${product.name} - ₹${product.price}</li>`
      )
      .join("");

    const mailOptions = {
      from: "your_email@example.com",
      to: user.email, // Assuming the email property exists in the User schema
      subject: "Order Confirmation",
      html: `<html>
      <head>
        <style>
          /* Add your CSS styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          h1 {
            color: #333;
          }
          /* Add more styles as needed */
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Order Status Update</h1>
          <p>Dear ${user.name},</p>
          <p>Your order  has been  <strong>${this.status}</strong>.</p>
          <h2>Order Details:</h2>
          <ul>${productDetailsHTML}</ul>
          <!-- Add more HTML content as needed -->
        </div>
      </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
});




orderSchema.statics.updateOrderStatus = async function (orderId, newStatus) {
  try {
    const order = await this.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    // Fetch the user details using the buyer ObjectId
    const User = mongoose.model("user"); // Assuming you have a User model
    const user = await User.findById(order.buyer);

    // Fetch the product details using the product ObjectId
    const Product = mongoose.model("Products"); // Assuming you have a Products model
    const productPromises = order.products.map((productId) => Product.findById(productId));
    const products = await Promise.all(productPromises);

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      // configure your email transport options (e.g., SMTP)
      service: "Gmail",
      auth: {
        user: "excelshopping0@gmail.com",
        pass: "aqaeynanrrwuzqik",
      },
    });

    const productDetailsHTML = products
      .map((product) => `<li>${product.name} - ₹${product.price}</li>`)
      .join("");

    const mailOptions = {
      from: "your_email@example.com",
      to: user.email, // Assuming the email property exists in the User schema
      subject: "Order Status Update",
      html: `<html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            h1 {
              color: #333;
            }
            /* Add more styles as needed */
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Order Status Update</h1>
            <p>Dear ${user.name},</p>
            <p>Your order  has been  <strong>${order.status}</strong>.</p>
            <h2>Order Details:</h2>
            <ul>${productDetailsHTML}</ul>
            <!-- Add more HTML content as needed -->
          </div>
        </body>
      </html>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// Middleware to check if status has been modified and trigger email accordingly
orderSchema.pre("save", async function (next) {
  if (this.isModified("status")) {
    try {
      await this.constructor.updateOrderStatus(this._id, this.status);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }
  next();
});



module.exports = mongoose.model("Order", orderSchema);

