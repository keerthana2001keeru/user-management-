const Admin = require("../models/adminSchema");
const bcrypt = require("bcrypt");

async function findAdminByEmail(email) {
  try {
    return await Admin.findOne({ email: email });
  } catch (error) {
    throw new Error("Error finding admin by email: " + error.message);
  }
 
}
// async function createAdmin({ fullName, phone, email, password }) {
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = new Admin({
//       fullName,
//       email,
//       password: hashedPassword
//     });
//     return await admin.save();
//   } catch (error) {
//     throw new Error("Error creating admin: " + error.message);
//   }
 
// }
module.exports = {
  findAdminByEmail,
  // createAdmin
};
