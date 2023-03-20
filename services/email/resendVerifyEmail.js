const { User } = require("../../models");
const { HttpError } = require("../../utils");
const sendEmail  = require('./sendEmail');
const { BASE_URL } = process.env;

const resendVerifyEmail = async (request, response) => {
  const { email } = request.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target ="_blank" href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  response.status(200).json({
    status: "success",
    code: 200,
    user: {
      message: "Verify email send success",
    },
  });
};

module.exports = resendVerifyEmail;
