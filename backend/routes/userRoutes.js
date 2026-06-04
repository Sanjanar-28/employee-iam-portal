const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAuditLogs,
    getUserStats,
    restoreUser
} = require("../controllers/userController");


const authorizePermission =
require("../middleware/permissionMiddleware");

router.post(
    "/register",
    protect,
    authorizePermission(
        "CREATE_USER"
    ),
    registerUser
);

router.post("/login", loginUser);

router.get(
    "/profile",
    protect,
    (req, res) => {

        res.json({
            message: "Protected Route Accessed",
            user: req.user
        });

    }
);

router.get(
    "/admin",
    protect,
    authorizePermission("VIEW_STATS"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);

router.get(
    "/audit/logs",
    protect,
    authorizePermission("VIEW_AUDIT_LOGS"),
    getAuditLogs
);

router.get(
    "/stats",
    protect,
    authorizePermission("VIEW_STATS"),
    getUserStats
);
router.put(
    "/restore/:id",
    protect,
    authorizePermission("RESTORE_USER"),
    restoreUser
);

router.get(
    "/:id",
    protect,
    authorizePermission("VIEW_USER"),
    getUserById
);

router.get(
    "/",
    protect,
    authorizePermission("VIEW_USERS"),
    getAllUsers
);

router.put(
    "/:id",
    protect,
    authorizePermission("UPDATE_USER"),
    updateUser
);

router.delete(
    "/:id",
    protect,
    authorizePermission("DELETE_USER"),
    deleteUser
);

module.exports = router;