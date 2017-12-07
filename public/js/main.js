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

$(document).ready(function() {

	$("#start-form").submit(function() {
		$("#start-modal").modal();
		return false;
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
