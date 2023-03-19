const bcrypt = require("bcrypt");
require("dotenv").config();
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../../models");
const { HttpError } = require("../../utils");
const { sendEmail } = require("../../services/email");
const { BASE_URL } = process.env;

const register = async (request, response) => {
  const { email, password } = request.body;
  const result = await User.findOne({ email });

  if (result) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();

  const user = await User.create({
    ...request.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target ="_blank" href='${BASE_URL}/api/users/verify/${verificationToken}'>Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  response.status(201).json({
    status: "success",
    code: 201,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

module.exports = register;
