const permissions = {

    Admin: [
        "CREATE_USER",
        "VIEW_USERS",
        "VIEW_USER",
        "UPDATE_USER",
        "DELETE_USER",
        "RESTORE_USER",
        "VIEW_AUDIT_LOGS",
        "VIEW_STATS"
    ],

    HR: [
        "VIEW_USERS",
        "VIEW_USER",
        "UPDATE_USER"
    ],

    Developer: [
        "VIEW_PROFILE"
    ]

};

module.exports = permissions;