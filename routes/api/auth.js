const express = require("express");

const { userController } = require("../../controllers");

const { validateBody, authenticate, upload } = require("../../middlewares");

const { registerSchema, loginSchema, emailSchema } = require("../../schemas");

const authRouter = express.Router();

// signUp
authRouter.post("/register", validateBody(registerSchema), userController.register);

authRouter.get("/verify/:verificationToken", userController.verifyEmail)

authRouter.post("/verify", validateBody(emailSchema), userController.resendVerifyEmail)

// signIn
authRouter.post("/login", validateBody(loginSchema), userController.login);

authRouter.get("/current", authenticate, userController.current);

authRouter.post("/logout", authenticate, userController.logout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), userController.updateAvatar); 

module.exports = authRouter;
