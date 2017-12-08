function talkFunctions() {
    /*var params = window.location.href.split('/');
    var username = params[params.length-2];
    var idconversation = params[params.length-1];

    $("#username-label").text(username);*/
    
    $(".msg-input button").click(function() {
        var input = $(this).parent().find("textarea");
        insertChat(ME, input.val());
        socket.emit('chat', input.val(), conversation);
        input.val("");
    });

    socket.on('chat', function(message){
        insertChat(YOU, message);
    });
}

function insertChat(who, text){
    var control = "";
    var date = formatTime(new Date());
    
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

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return hours+":"+minutes;
}
