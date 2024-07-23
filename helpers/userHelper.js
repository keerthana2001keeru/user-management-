const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

async function findUserByEmail(email) {
  return await User.findOne({ email: email,isDeleted:false });
}

async function createUser(  { fullName, phone, email, hashedPassword }) {
  if (!hashedPassword) {
    throw new Error('Password is required');
  }
  // const hashedpassword = await bcrypt.hash(password, 10);
  const password=hashedPassword;
  // const user = new User({
  //   fullName,
  //   phone,
  //   email,
  //    hashedpassword,
  // });
  // console.log("ccc")
  return await User.create({fullName,
    phone,
    email,
     password,
    isDeleted:false});
}

async function findAllUsers(page=1,limit=3) {
  const skip = (page - 1)* limit;
  const users = await User.find({ isDeleted: false })
  .skip(skip)
  .limit(limit)
  .lean();
  const totalUsers = await User.countDocuments({ isDeleted: false });

  return {
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page
  };
  // return await User.find({isDeleted:false}).lean();
}

async function deleteUserById(userId) {
  return await User.findByIdAndUpdate( userId ,{isDeleted:true});
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
module.exports = {
  findUserByEmail,
  createUser,
  findAllUsers,
  deleteUserById,
  updateUserById,
  countUsers,
  findUsersWithPagination
};
