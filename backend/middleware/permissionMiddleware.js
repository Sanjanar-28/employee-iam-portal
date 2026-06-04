const permissions = require("../config/permissions");

const authorizePermission = (permission) => {

    return (req, res, next) => {

        const role = req.user.role;

        const rolePermissions =
            permissions[role] || [];

        if (
            !rolePermissions.includes(permission)
        ) {

            return res.status(403).json({
                message: "Permission Denied"
            });

        }

        next();

    };

};

module.exports = authorizePermission;