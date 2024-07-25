const Admin = require("../models/adminSchema");
const bcrypt = require("bcrypt");

async function findAdminByEmail(email) {
  try {
    return await Admin.findOne({ email: email });
  } catch (error) {
    throw new Error("Error finding admin by email: " + error.message);
  }
 
}

module.exports = {
  findAdminByEmail,
  
};
