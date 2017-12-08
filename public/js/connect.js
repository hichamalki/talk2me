function connectFunctions() {
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

    socket.on('conversation-connected', function(username, action) {
        conversation.action = action;
        $.get("/talk", function(html) {
            $("#username-label").text(username);
            $("#dynamic-content").html(html);
            talkFunctions();
        });
    });

    $(".copy-clip").click(function() {
        var input = $(this).parent().parent().find("input");
        input.select();
        document.execCommand("Copy");
    });
}

function rand(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}