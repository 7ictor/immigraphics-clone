function saveUser()
{

		_username = $("#newUserName").val();
		_password = $("#newPassword").val();

		p2 = $("#newPassword2").val();
		if(_password!=p2){
		  	alert("Passwords do not match");
		    return
		}else{
		   _password = CryptoJS.MD5(_password).toString();
		 }
		_profession = $("#profession option:selected").text();
		_state =$("#state option:selected").text();
		_email =$("#email").val();

		$.ajax({
				url: "http://safetrails.herokuapp.com/u/save.php",
				   type: "POST",
				   data:{
					   username:_username,
					   password:_password,
					   profession: _profession,
					   state:_state,
					   county:"test_county",
					   email:_email
					},
				   xhrFields: {
				      withCredentials: false
				   },
				   crossDomain: true,
				   success: function(data){
				   		console.log(data);
				   		a = $.parseJSON(data);
				   		console.log(a);
				   		if(a.response=="success"){
				   			console.log("entro");
				   			$(".message").html("User created.");
				   		}else{
				   			$(".message").html("error creating user");
				   		}
				   }
				});


}