const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body  // get data from request

        const userExists = await User.findOne({ email })  // check DB

        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword  // save hashed, never plain text
        })
        const token = jwt.sign(
            { id: user._id },        // payload — what we store in the token
            process.env.JWT_SECRET,     // secret key from .env
            { expiresIn: "7d" }      // token expires in 7 days
        )
        return res.status(201).json({
            message: "User registered successfully ",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    }
     catch (error) {
   console.log(error)  // add this
    res.status(500).json({ message: error.message })  // change this
}
}

    exports.login = async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" })
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            )

            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                }
            })

        } catch (error) {
            res.status(500).json({ message: "server error" })
        }
    }
