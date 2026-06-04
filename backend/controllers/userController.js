const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuditLog = require("../models/AuditLog");

const registerUser = async (req, res) => {
  try {

    const { name, email, password, role, department } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department
    });
    await AuditLog.create({

     action: "CREATE_USER",

        performedBy:
        req.user?.name || "System",

        targetUser:
        user.name

    });

    res.status(201).json({
      message: "User Registered Successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    if (!user.active) {
    return res.status(403).json({
        message: "Account is inactive"
    });
    }
    

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
    message: "Login Successful",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getAllUsers = async (req, res) => {

    try {

        const query = {};

        // Active / Inactive / All Users
       if (req.query.active === "true") {
    query.active = true;
}

if (req.query.active === "false") {
    query.active = false;
}


        // Role Filter
        if (req.query.role) {
            query.role = req.query.role;
        }

        // Department Filter
        if (req.query.department) {
            query.department = req.query.department;
        }

        // Name Search
        if (req.query.name) {
            query.name = {
                $regex: req.query.name,
                $options: "i"
            };
        }

        const users = await User.find(query)
            .select("-password");

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.department = req.body.department || user.department;
        user.active = req.body.active ?? user.active;
        const updatedUser = await user.save();
        await AuditLog.create({
    action: "UPDATE_USER",
    performedBy: req.user.role || "Admin",
    targetUser: user.name
});

        res.status(200).json({
            message: "User updated successfully",
            updatedUser
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        user.active = false;

        await user.save();
        await AuditLog.create({
            action: "DEACTIVATE_USER",
            performedBy: req.user.role,
            targetUser: user.name
        });

        res.status(200).json({
            message: "User deactivated successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getAuditLogs = async (req, res) => {

    try {

        const logs = await AuditLog.find()
            .sort({ timestamp: -1 });

        res.status(200).json(logs);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


const getUserStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({
            active: true
        });

        const inactiveUsers = await User.countDocuments({
            active: false
        });

        const admins = await User.countDocuments({
            role: "Admin"
        });

        const developers = await User.countDocuments({
            role: "Developer"
        });

        const hr = await User.countDocuments({
            role: "HR"
        });

        res.status(200).json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            admins,
            developers,
            hr
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const restoreUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User Not Found"
            });

        }

        user.active = true;

        await user.save();

        await AuditLog.create({
            action: "RESTORE_USER",
            performedBy: req.user.role,
            targetUser: user.name
        });

        res.status(200).json({
            message: "User Restored Successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const createUser = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await api.post(
      "/users/register",
      newUser,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    alert(
      "Employee created successfully"
    );

    setShowModal(false);

    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message
      || "Failed to create user"
    );

  }

};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAuditLogs,
  getUserStats,
  restoreUser,
  createUser
};