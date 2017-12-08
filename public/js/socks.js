var ME = "me";
var YOU = "you";

var conversation = {
    usernames: {
        start: null,
        connect: null,
    },
    from: null,
    to: null,
    idconversation: null,
    password: null,
    action: null
};

var socket = io();

$(document).ready(function() {
	socket.on('m-error', function(msg) {
        alert("Erreur : " + msg);
    });

    socket.on('m-notif', function(msg) {
        alert("Notif : "+msg);
    });
});