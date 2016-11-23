/**
 * Appspicket Login /SignUp methods
 */

$( document ).on( "pagecreate", "#login", function() {
	var I2FA_URL = 'https://mobile.appspicket.com/module.php/extendtwofactorauthentication/ipragsaml.php';
	var appspicket = new AppsPicket(I2FA_URL);
	
	$('#btn-signup').on('tap', function(event){ 
		console.log("Signing up");
		
		var username = $("#username").val();
		var password = $("#password").val();
		var email = $("#email").val();
		var mobileno = $("#mobileno").val();
		
		$.mobile.loading( "show", {
			text: 'Processing Signup',
			textVisible: true,
		});
		
		var data  = {};
		data.uname = username;
		data.password = password;
		data.email = email;
		data.mobileno = mobileno;

		appspicket.signUp( data , function onSuccess(response){
			console.log(response);
			$("#message").html("Please confirm otp");
			$('#btn-signup').hide();
			$('#btn-login').hide();
			$('.otp_field').show();
			$('.otp_field').html('<label class="fontawesome-mobile-phone" for="otp"><i class="fa fa-mobile fa-2x"></i></label><input type="text" name="otp" id="otp" placeholder="Please enter otp number">');
			$('#confirm_otp').show();
			$.mobile.loading("hide");
		}, 
		function onFailure(error){
			$.mobile.loading("hide");
			$("#message").html("Error: " + error.message);
		});
		
		event.preventDefault();
	}); 
  
    $('#confirm_otp').on('tap', function(event){
		var otp = $("#otp").val();
		$.mobile.loading( "show", {
			text: 'Processing Confirm Otp',
			textVisible: true,
		});
		
		appspicket.confirmOtp( otp , function onSuccess(response){
			console.log(response);
			$("#message").html(response.message);
			$('#confirm_otp').hide();
			$('#btn-signup').hide();
			$('.otp_field').hide();
			$('#btn-login').show();
			$.mobile.loading("hide");
		}, 
		function onFailure(error){
			console.log(error);
			$.mobile.loading("hide");
			$("#message").html("Error: " + error.message); 
		});
		
		event.preventDefault();
	});	

	$('#btn-login').on('tap', function(event){
		var username = $("#username").val();
		var password = $("#password").val();
		
		$.mobile.loading( "show", {
			text: 'Logging In',
			textVisible: true,
		});
		
		var data  = {};
		data.uname = username;
		data.password = password;
		
		appspicket.login( data, function onSuccess(response){
			console.log(response);
			$.mobile.pageContainer.pagecontainer("change", "#apps", {
				apps: response.apps
			});
		}, 
		function onFailure(error){
			console.log(error);
			$.mobile.loading("hide");
			$("#message").html("Error: " + error.message); 
		});
		event.preventDefault();
	});
});

$(document).on("pagebeforechange", function (e, data) {
	if (data.toPage[0].id == "apps") {
		
		if (data.options.apps){
			 var apps = data.options.apps;
			 showapps("#apps", apps);
		} else{
			$.mobile.pageContainer.pagecontainer("change", "#login");
		} 
	}
});

function showapps(page, apps) {
	console.log("Show Apps");
	var $page = $(page);
	var  BASE_URL = 'https://mobile.appspicket.com';
	
	var list = $("<ul/>", {
		"data-role": "listview",
		"data-inset": true,
		"data-theme": "b"
	});
	
	var items = '';
	$.each(apps, function (key, value) {
		if (value['icon'].indexOf("http") !=0) {
			value['icon'] = BASE_URL + value['icon'];
		} 
		
		if (value['url'].indexOf("saml2") >= 0) {
			value['url'] = BASE_URL + value['url'];
		}
		items = $('<li>'+
				'<a rel="external" href="' + value['url'] + '" class="app_link" id="' + value['name'] + '" target="_blank">'+
				'<img src="' + value['icon'] + '" class="ui-li-thumb" />'+
				'<h2 class="app_link_heading">' + value['name'] + '</h2>'+
				'</a></li>")');
		list.append(items);
	});
	
	$("ul", $page).remove();
	$(".ui-content", $page).append(list);
	$("ul", $page).listview();
}
