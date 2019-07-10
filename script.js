Handlebars.templates = Handlebars.templates || {};

var templates = document.querySelectorAll(
    'script[type="text/x-handlebars-template"]'
);

Array.prototype.slice.call(templates).forEach(function(script) {
    Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
});

//////////////////////DO NOT TOUCH///////////////////////////////
var repos = [];
var go = $("button#dothemagic");
var name = "";
go.on("click", function(e) {
    var username = $('input[name="user"]').val();
    var password = $('input[name="pwd"]').val();
    var lookingFor = $('input[name="lookingfor"]').val();
    var baseUrl = "https://api.github.com";
    var endpoint = "/users/" + lookingFor + "/repos";
    var fullUrl = baseUrl + endpoint;
    var container = document.querySelector(".container");
    e.preventDefault();
    $.ajax({
        url: fullUrl,
        headers: {
            Authorization: "Basic " + btoa(username + ":" + password)
        },
        success: function(data) {
            var obj = {
                name: data[0].owner.login,
                pic: data[0].owner.avatar_url
            };
            name = data[0].owner.login;

            console.log(fullUrl);
            console.log(data);

            container.innerHTML = Handlebars.templates.user({
                owner: obj,
                resultsArray: data
            });
        }
    });
});

$(document).on("click", "li.repo", function(e) {
    //console.log(e);
    var username = $('input[name="user"]').val();
    var password = $('input[name="pwd"]').val();
    var lookingFor = $('input[name="lookingfor"]').val();
    var baseUrl = "https://api.github.com";
    var repo = $(e.target).attr("id");
    var endpoint = "/repos/" + repo + "/commits";
    var fullUrl = baseUrl + endpoint;
    var reposContainer = $(e.target);
    var actualCommits = $(e.target).find(".commits");
    e.preventDefault();

    if (actualCommits.html() && actualCommits.html() != "") {
        //console.log(actualCommits);
        actualCommits.toggle();
    } else {
        $(".commits").remove();
        $.ajax({
            url: fullUrl,
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            },
            success: function(commits) {
                //    console.log(fullUrl);
                console.log(commits);

                reposContainer.append(
                    Handlebars.templates.commits({
                        reposArray: commits
                    })
                );
            }
        });
    }
});
