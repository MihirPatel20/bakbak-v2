import { faker } from "@faker-js/faker";
import fs from "fs";
import { AvailableUserRoles } from "../constants.js";
import { User } from "../models/user.models.js";
import { SocialProfile } from "../models/profile.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber, removeLocalFile } from "../utils/helpers.js";
import { USERS_COUNT } from "./_constants.js";

const avatarServices = [
  (username) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
  (username) => `https://robohash.org/${username}.png`,
  (username) => `https://avatar.iran.liara.run/public/boy?username=${username}`,
  (username) =>
    `https://avatar.iran.liara.run/public/girl?username=${username}`,
];

// Array of fake users
const users = new Array(USERS_COUNT).fill("_").map(() => {
  const username = faker.internet.userName().substring(0, 12);
  const avatarUrl =
    avatarServices[getRandomNumber(avatarServices.length)](username);

  return {
    avatar: {
      url: avatarUrl,
      localPath: "",
    },
    username,
    email: faker.internet.email(),
    password: "1234",
    isEmailVerified: true,
    role: AvailableUserRoles[getRandomNumber(2)],
  };
});

/**
 * @description Seeding middleware for users api which other api services can use which are dependent on users
 */
const seedUsers = asyncHandler(async (req, res, next) => {
  const userCount = await User.countDocuments();
  if (userCount >= USERS_COUNT) {
    // Don't re-generate the users if we already have them in the database
    next();
    return;
  }
  await User.deleteMany({}); // delete all the existing users from previous seedings
  await SocialProfile.deleteMany({}); // delete dependent model documents as well
  // remove cred json
  removeLocalFile("./public/temp/seed-credentials.json"); // remove old credentials

  // Seed default users
  await seedDefaultUsers();

  const credentials = [];

  // create Promise array
  const userCreationPromise = users.map(async (user) => {
    credentials.push({
      username: user.username.toLowerCase(),
      email: user.email.toLowerCase(),
      password: user.password,
      role: user.role,
    });
    await User.create(user);
  });

  // pass promises array to the Promise.all method
  await Promise.all(userCreationPromise);

  // Once users are created dump the credentials to the json file
  const json = JSON.stringify(credentials);

  fs.writeFileSync(
    "./public/temp/seed-credentials.json",
    json,
    "utf8",
    (err) => {
      console.log("Error while writing the credentials", err);
    }
  );

  // proceed with the request
  next();
});

/**
 * @description Function to seed default users from a JSON file
 */
const seedDefaultUsers = async () => {
  try {
    const defaultUsers = JSON.parse(
      fs.readFileSync("./public/temp/default-users.json", "utf8")
    );

    // Create default users
    console.log("defaultUsers: ", defaultUsers);
    await User.create(defaultUsers);
  } catch (error) {
    throw new ApiError(500, "Error seeding default users: " + error.message);
  }
};

/**
 * @description This api gives the saved credentials generated while seeding.
 */
const getGeneratedCredentials = asyncHandler(async (req, res) => {
  try {
    const json = fs.readFileSync("./public/temp/seed-credentials.json", "utf8");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(json),
          "Dummy credentials fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      404,
      "No credentials generated yet. Make sure you have seeded social media or ecommerce api data first which generates users as dependencies."
    );
  }
});

/**
 * @description This function is used to seed the Admin user
 */
const seedAdminUser = async () => {
  const adminUser = {
    avatar: {
      url: "",
      localPath: "/images/default/avatar_toy-2.jpg",
    },
    username: "mihir",
    email: "mihir@gmail.com",
    password: "User@1234",
    role: "ADMIN",
    firstname: "Mihir",
    lastname: "Patel",
    bio: "This user hasn't added a bio yet.",
    dob: "1990-01-01",
    location: "Not specified",
    countryCode: "+91",
    phoneNumber: "+91  123 456 7890",
  };

  try {
    // Check if admin already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      return { alreadyExists: true, user: existingUser };
    }

    // Create the user
    const newUser = await User.create(adminUser);

    // Create associated social profile
    const newProfile = await SocialProfile.create({
      owner: newUser._id,
      bio: "Admin account profile.",
      location: "HQ",
      website: "https://example.com",
    });

    // Link profile to user
    newUser.profile = newProfile._id;
    await newUser.save();

    return { created: true, user: newUser, profile: newProfile };
  } catch (err) {
    console.error("Error seeding admin user:", err);
    throw err;
  }
};

export { getGeneratedCredentials, seedUsers, seedAdminUser };
