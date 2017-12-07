var ME = "me";
var YOU = "you";

var me_avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";
var you_avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

function insertChat(who, text){
    var control = "";
    var date = formatAMPM(new Date());
    
	text = text.replace("\n", "<br>");

    if (who == YOU){
        
        control = '<li style="width:100%; margin-top: 10px;">' +
                        '<div class="msj macro">' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li style="width:100%; margin-top: 10px;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                  '</li>';
    }
    
    $(".msg-area ul").append(control);
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function rand(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var socket = io();
var conversation = {
    usernames: {
        start: null,
        connect: null,
    },
    from: null,
    to: null,
    idconversation: null,
    password: null
};

$(document).ready(function() {

    socket.on('m-error', function(msg) {
        alert("Erreur : " + msg);
    });

    socket.on('m-notif', function(msg) {
        alert("Notif : "+msg);
    });

    socket.on('conversation-connected', function(username) {
        //window.location.href = "/talk";
        console.log(username);
    });

	$("#start-form").submit(function() {
        if(!$(this).find("input[name=username]").val().trim()) {
          alert("Veuillez entrer un nom d'utilisateur valide.");
          return false;
        }

        conversation.usernames.start = $(this).find("input[name=username]").val();
        conversation.from = $(this).find("select[name=from]").val();
        conversation.to = $(this).find("select[name=to]").val();
        conversation.idconversation = rand(100, 999)+"."+rand(100, 999)+"."+rand(100, 999);
        conversation.password = rand(1000, 9999);

        $("#modal-idconversation").val(conversation.idconversation);
        $("#modal-password").val(conversation.password);

        socket.emit('start-conversation', conversation);
        
        $("#start-modal").modal();
		return false;
	});

    $("#connect-form").submit(function() {
        conversation.usernames.connect = $(this).find("input[name=username]").val();
        conversation.idconversation = $(this).find("input[name=idconversation]").val();
        conversation.password = $(this).find("input[name=password]").val();
        socket.emit('connect-conversation', conversation);
        return false
    });

	$(".copy-clip").click(function() {
		var input = $(this).parent().parent().find("input");
		input.select();
		document.execCommand("Copy");
	});

	$(".msg-input button").click(function() {
		var input = $(this).parent().find("textarea");
		insertChat(ME, input.val());
		input.val("");
	});

	insertChat(ME, "Salam");
	insertChat(YOU, "Bonjour");
	insertChat(ME, "Ca va ?");

});
