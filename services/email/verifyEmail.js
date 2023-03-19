const { User } = require("../../models");
const { HttpError } = require("../../utils");

const verifyEmail = async (request, response) => {
  const { verificationToken } = request.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  response.status(200).json({
    status: "success",
    code: 200,
    user: {
      message: "Verification successful",
    },
  });
};

module.exports = verifyEmail;
