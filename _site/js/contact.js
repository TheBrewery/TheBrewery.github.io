$(function() {
  "use strict";
  $("input, textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour

            const name = $("input#_name").val();
            const email = $("input#_replyto").val();
            const phone = $("input#_phone").val();
            const message = $("textarea#_message").val();

            $.ajax({
                url: "//formspree.io/contact@thebrewery.io",
                method: "POST",
                data: {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                },
                dataType: "json",
                success: function() {
                  $('#success').html("<div class='alert alert-success'>");
                  $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
                  $('#success > .alert-success').append("<strong>Your message has been sent. </strong>");
                  $('#success > .alert-success').append('</div>');

                  setTimeout(function() {
                      $('#success').fadeOut('fast');
                  }, 2000);

                  $('#success').fadeIn('fast');
                  $('#contactForm').trigger("reset");
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  $('#success').html("<div class='alert alert-danger'>");
                  $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
                  $('#success > .alert-danger').append("<strong>Sorry, it seems that my mail server is not responding. Please try again later!");
                  $('#success > .alert-danger').append('</div>');

                  setTimeout(function() {
                      $('#success').fadeOut('fast');
                  }, 2000);

                  $('#success').fadeIn('fast');
                }
            });
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
