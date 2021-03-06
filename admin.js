let adminPw = "testPw";
let isAdminPw = (q) => {
    return q === adminPw;
};
let generateAdminDashboard = () => {
    return (`<!DOCTYPE HTML>

    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css?family=Lora|Montserrat" rel="stylesheet">
        <link rel="stylesheet" href="public/styles/fundamental.css">

        <script type="text/javascript" src="public/scripts/socket.io-client-master/dist/socket.io.js"></script>
        <script type="text/javascript" src="public/scripts/client-admin.js"></script>
        <script type="text/javascript" src="public/scripts/element-formatter.js"></script>
        <script type="text/javascript" src="public/scripts/server-requests.js"></script>
        <script type="text/javascript" src="public/scripts/utility.js"></script>
        </head>

        <body>

        <div class="page-navbar">
        <ul class="topnav">
        <li class="left" id="navbar-left"><a id="hamburger" href="javascript:">☰</a></li>
    <li><a onclick="writeMode()" href="javascript:">Write</a></li>
    <li class="right" id="navbar-right"><a onclick="requestArchiveBackup()" href="javascript:">Backup</a></li>
    </ul>
    </div>

    <div id="label-list"></div>
        <div id="real-estate"></div>

        </body>`
);
};

exports.isAdminPw = isAdminPw;
exports.generateAdminDashboard = generateAdminDashboard;