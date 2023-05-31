import express from "express";
import AuthSchema from "../models/auth.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator';
import transporter from "../utils/NodeMailerConfig.js";

const router = express.Router();


router.post("/register", async (req, res) => {
    try {


        const isUserExist = await AuthSchema.findOne({ email: req.body.email });

        if (isUserExist) {
            return res.status(403).json({ message: "Email Already Exists" });
        } else {
            const securedPass = await bcrypt.hash(req.body.password, 10);


            const otpCode = await Math.floor(100000 + Math.random() * 900000).toString();


            // Save the OTP code to the user's record in the database
            const getOtpCode = otpCode;
            const getOtpExpire = Date.now() + 600000; // OTP expires in 10 minutes


            const createUser = new AuthSchema({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                companyName: req.body.companyName,
                VAT_ID: req.body.VAT_ID,
                addressLine: req.body.addressLine,
                zipCode: req.body.zipCode,
                city: req.body.city,
                country: req.body.country,
                email: req.body.email,
                password: securedPass,
                roles: req.body.roles,
                otpCode: getOtpCode,
                otpExpire: getOtpExpire
            });

            // Set up the email message options
            const mailOptions = {
                from: "abdulrehman@techsmiths.co", // sender address
                to: createUser.email, // receiver address
                subject: "Welcome to My Website", // Subject line
                html: `<p>Confirm Your OTP ${otpCode}</p>`, // plain text body
            };

            // Send the email with the OTP code
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Email sending failed" });
                } else {
                    console.log("Email sent: " + info.response);
                    return res
                        .status(200)
                        .json({ message: "OTP created and sent successfully" });
                }
            });

            const saveUser = await createUser.save();

            res.status(200).json({ status: 200, data: saveUser })

        }
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});



router.patch('/verify-otp', async (req, res) => {
    try {
        const userExist = await AuthSchema.findOne({ email: req.body.email });

        if (!userExist) {
            res.status(404).json({ message: "User Not Found" });
        } else {
            if (userExist.otpCode === req.body.otpCode) {
                // Check if OTP has expired
                const currentTime = Date.now();
                const otpExpirationTime = new Date(userExist.otpExpire).getTime() + 10 * 60 * 1000; // Adding 10 minutes in milliseconds

                if (currentTime > otpExpirationTime) {
                    await userExist.updateOne({ $unset: { otpCode: "", otpExpire: "" } });
                    res.status(400).json({ status: 400, message: "OTP has expired" });

                } else {
                    await userExist.updateOne({ verification: true });

                    const cookie = await jwt.sign(
                        {
                            email: userExist.email,
                            userID: userExist.id,
                            roles: userExist.roles,
                            invitation: userExist.invitation
                        },
                        process.env.JWT_SECRET
                    );

                    // Generate a cookie and set it in the response
                    res.cookie('cookie', cookie, { httpOnly: true });

                    res.status(200).json({ status: 200, data: userExist, cookie: cookie });
                }
            } else {
                res.status(400).json({ status: 400, message: "INCORRECT OTP" });
            }
        }
    } catch (error) {
        res.status(500).json({ status: 500, error });
        console.log(error);
    }
});




router.post('/login', [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userExists = await AuthSchema.findOne({ email: req.body.email });

        if (userExists) {
            const comparePass = await bcrypt.compare(req.body.password, userExists.password);

            if (comparePass) {
                const cookie = await jwt.sign(
                    {
                        email: userExists.email,
                        userID: userExists.id,
                        roles: userExists.roles,
                        invitation: userExists.invitation
                    }, process.env.JWT_SECRET
                );

                // Generate a cookie and set it in the response
                res.cookie('cookie', cookie, { httpOnly: true });

                res.status(200).json({ message: "Logged In Successfully", cookie });
            } else {
                res.status(400).json({ message: "Passwords Don't Match" });
            }
        } else {
            res.status(404).json({ message: "Account Not Found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});



export default router;