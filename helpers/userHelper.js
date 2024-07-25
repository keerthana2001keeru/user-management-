const User = require("../models/userSchema");

async function findUserByEmail(email) {
  return await User.findOne({ email: email, isDeleted: false });
}
async function findUserById(id) {
  try {
    return await User.findById(id).lean();
  } catch (error) {
    throw new Error("Error finding user by ID: " + error.message);
  }
}
async function createUser({ fullName, phone, email, hashedPassword }) {
  if (!hashedPassword) {
    throw new Error("Password is required");
  }
  
  const password = hashedPassword;
 
  return await User.create({
    fullName,
    phone,
    email,
    password,
    isDeleted: false,
  });
}

async function findAllUsers(page = 1, limit = 5) {
  const skip = (page - 1) * limit;
  const users = await User.find({ isDeleted: false })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalUsers = await User.countDocuments({ isDeleted: false });

  return {
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
  };
  // return await User.find({isDeleted:false}).lean();
}

async function deleteUserById(userId) {
  return await User.findByIdAndUpdate(userId, { isDeleted: true });
}

async function updateUserById(userId, updateData) {
  return await User.findByIdAndUpdate(
    { _id: userId },
    { $set: updateData },
    { new: true }
  );
}
async function findUsersWithPagination(query, limit, skip) {
  return await User.find(query).limit(limit).skip(skip).lean();
}

async function countUsers(query) {
  return await User.countDocuments(query);
}
async function searchUsers(keyword) {
  try {
    return await User.find({
      fullName: { $regex: `^${keyword}`, $options: "i" },
      isDeleted: false,
    }).lean();
  } catch (error) {
    throw new Error("Error searching users: " + error.message);
  }
}

module.exports = {
  findUserByEmail,
  createUser,
  findAllUsers,
  deleteUserById,
  updateUserById,
  countUsers,
  findUsersWithPagination,
  findUserById,
  searchUsers,
};
