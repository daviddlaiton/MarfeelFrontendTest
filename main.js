//Some elements called just once. These elements are from the user information or error message
let avatar = document.getElementById('userAvatar');
let table = document.getElementById('reposTable');
let repositoriesLabelContainer = document.getElementById('repositoriesLabelContainer');
let errorMessage = document.getElementById('errorMessage');

//Hides the avatar, repositories label and error messge.
avatar.style.display = 'none';
repositoriesLabelContainer.style.display = 'none';
errorMessage.style.display = 'none';

//Create the reference to the search input
let searchInput = document.getElementById('searchInput');

//When the user hit enter key in the keyboard the click function is simulated. For this creates an event listener
searchInput.addEventListener('keyup', function (event) {
    // 13 is the keyCode of enter (Also called return).
    if (event.keyCode === 13) {
        event.preventDefault();
        //Simulates the click in the Button
        document.getElementById('searchButton').click();
    }
});

//Function to search the username entered in the search input
function seachUser() {
    //Gets the text from the input
    let username = searchInput.value;

    //Does the fetch
    fetch('https://api.github.com/users/' + username)
        .then(response => {
            //In case of error (The user does not exists) throw a response
            if (!response.ok) {
                throw response
            }
            //If everything is ok return the response as a json.
            return response.json()
        })
        .then(user => {
            // get from the json all the user information
            let userPhoto = user.avatar_url;
            //adds "@" to the username
            let username = "@" + user.login;
            let name = user.name;
            let bio = user.bio;

            //assign the user information to the elements in the HTML 
            avatar.src = userPhoto;
            document.getElementById('username').innerText = username;
            document.getElementById('name').innerText = name;
            document.getElementById('bio').innerText = bio;

            //The text in the search input is now empty
            searchInput.value = '';
        })
        .catch( (error) => {
            //Hides all the elements and shows the error message
            errorMessage.style.display = 'block';
            avatar.style.display = 'none';
            document.getElementById('username').style.display = 'none'
            document.getElementById('name').style.display = 'none'
            document.getElementById('bio').style.display = 'none'
            table.style.display = 'none'
            repositoriesLabelContainer.style.display = 'none';
        });

    //Does the fetch of the repositories
    fetch('https://api.github.com/users/' + username + '/repos')
        .then(response => {
            //In case of error (The user does not exists) throw a response
            if (!response.ok) {
                throw response
            }
            //If everything is ok return the response as a json.
            return response.json()
        })
        .then(userRepos => {
            //Get the repos and iterate over them
            userRepos.map( (repo,count) => {
                //Create the row in the table. Count says which row has to create.
                let row = table.insertRow(count);
                // Create the cells of the new row.
                let repoName = row.insertCell(0);
                let stars = row.insertCell(1);
                let forks = row.insertCell(2);

                //Put the name of the user in his element in the HTML 
                repoName.innerText = repo.name;

                //Put the number of stars in his element in the HTML
                stars.innerText = repo.stargazers_count;

                //Creates the image element that will be added to the element in the HTML
                let star = document.createElement('img');
                //Add the src of the img
                star.src = "/icons/star.svg";
                //Append the star to the element in the HTML
                stars.appendChild(star);

                //Put the number of forks in his element in the HTML
                forks.innerHTML = repo.forks;

                //Creates the image element that will be added to the element in the HTML
                let fork = document.createElement('img');
                //Add the id to the img just created
                fork.setAttribute('id','forkSvg');
                //Add the src of the img
                fork.src = "/icons/fork.svg";
                //Append the star to the element in the HTMLx
                forks.appendChild(fork);
            });

            //Shows all the elements and hides the error message
            avatar.style.display = 'inline-block';
            repositoriesLabelContainer.style.display = 'block'
            table.style.display = 'table';
            errorMessage.style.display = 'none';
        });
}