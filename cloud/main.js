var Mandrill = require('mandrill');
Mandrill.initialize('q7yQOockBL95WNHu8KkVsg');

Parse.Cloud.define("sendContactEmail", function(request, response) {
	Mandrill.sendEmail({
	  message: {
	    text: "Name: " + request.params.name + "\nPhone: " + request.params.phone + "\n\n" + request.params.message,
	    subject: "thebrewery.io Contact Form: " + request.params.name + " " + request.params.phone,
	    from_email: request.params.email,
	    from_name: request.params.name,
	    to: [
	      {
	        email: "contact@thebrewery.io",
	      }
	    ]
	  },
	  async: true
	},{
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
});
