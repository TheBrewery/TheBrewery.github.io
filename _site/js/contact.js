$(function() {
  "use strict";
  $("input, textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM

            $(":button").innerHTML = 'sending...';

            var name = $("input#_name").val();
            var email = $("input#_replyto").val();
            var phone = $("input#_phone").val();
            var message = $("textarea#_message").val();

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://formspree.io/contact@thebrewery.io', true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.send( "name=" + name + "&email=" + email + "&phone=" + phone + "&message=" + message);
            xhr.onloadend = function (res) {
              if (res.target.status === 200) {
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
                    $('#success > .alert-success').append("<strong>Your message has been sent. </strong>");
                    $('#success > .alert-success').append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
              } else {
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry, it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
              }
            };
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});

// var contactForm = document.querySelector('form'),
//     inputName = contactForm.querySelector('[name="_name"]'),
//     inputEmail = contactForm.querySelector('[name="_replyto"]'),
//     inputPhone = contactForm.querySelector('[name="_phone"]'),
//     textAreaMessage = contactForm.querySelector('[name="_message"]'),
//     sendButton = contactForm.querySelector('button');

//     sendButton.addEventListener('click', function(event){
//       event.preventDefault(); // prevent the form to do the post.

//       sendButton.innerHTML = 'sending...';

//       var xhr = new XMLHttpRequest();
//       xhr.open('POST', '//formspree.io/contact@thebrewery.io', true);
//       xhr.setRequestHeader("Accept", "application/json")
//       xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

//       xhr.send(
//         "name=" + inputName.value +
//         "&email=" + inputEmail.value +
//         "$phone=" + inputPhone +
//         "&message=" + textAreaMessage.value);

//       xhr.onloadend = function (res) {
//         if (res.target.status === 200){

//           // sendButton.innerHTML = 'Message sent!';

//         $('#success').html("<div class='alert alert-success'>");
//         $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
//         $('#success > .alert-success').append("<strong>Your message has been sent. </strong>");
//         $('#success > .alert-success').append('</div>');

//         //clear all fields
//         $('#contactForm').trigger("reset");
//         }
//         else {
//           // sendButton.innerHTML = 'Error!';

//           $('#success').html("<div class='alert alert-danger'>");
//           $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
//           $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
//           $('#success > .alert-danger').append('</div>');
//           //clear all fields
//           $('#contactForm').trigger("reset");
//         }
//       }
//     });