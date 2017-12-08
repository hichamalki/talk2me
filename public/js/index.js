$(document).ready(function() {

	$.get("/connect", function(html) {
		$("#dynamic-content").html(html);
		connectFunctions();
	});

});