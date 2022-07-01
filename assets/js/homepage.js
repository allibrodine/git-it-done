var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function (user) {
    //format github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            //request was successful
            if (response.ok) { //ok property determined by API
                response.json().then(function(data) {
                    displayRepos(data, user); //send data to displayRepos function
            });
            } else {
                alert("Error: Github user not found");        
            }   
    })
        .catch(function(error) {
            //.catch getting chained onto the end of the .then() method
            alert("Unable to connect to Github");
        });
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    //variable "username" to store value from input element
    var username = nameInputEl.value.trim();

    if (username) { //check for value in username variable
        getUserRepos(username); //pass username data to getUserRepos as an argument
        nameInputEl.value = ""; //clear the form
    } else {
        alert("Please enter a Githun username");
    }
    console.log(event);
};

var displayRepos = function(repos, searchTerm) {
    //clear old content
    repoContainerEl.textContent = "";

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //display search term above results
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    });
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    
    if(language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);