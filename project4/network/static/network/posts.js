document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#post_Button').addEventListener('click', postcontent);
    document.querySelector('#all_Posts').addEventListener('click', display);
    display();
});

function postcontent(){
    const content = document.querySelector("#post_Content").value;
    fetch('/new_Post',{
        method: 'POST',
        body: JSON.stringify({
            post : content
        })
    })
    .then(response=>response.json())
    .then(posts => {
        console.log(posts);
    })
}

function display(){
    fetch('/display')
    .then(response => response.json())
    .then(function(posts){
        console.log(posts);
        posts.forEach(posts => {
            const username = document.createElement('div');
            username.innerHTML = posts.user;
            username.style.fontWeight = "bold";
            document.querySelector('#display_Posts').append(username);
            const content = document.createElement('div');
            content.innerHTML = posts.post;
            document.querySelector('#display_Posts').append(content);
            const date = document.createElement('div');
            date.innerHTML = posts.date_Posted;
            document.querySelector('#display_Posts').append(date);
            const like = document.createElement('div');
            const like_Image = document.createElement('img');
            like_Image.src = "project4\network\static\network\heart.png"
            like.innerHTML = posts.likes;
            document.querySelector('#display_Posts').append(like_Image);
            document.querySelector('#display_Posts').append(like);
            const dislike = document.createElement('div');
            const dislike_Image = document.createElement('img');
            dislike_Image.src = "project4\network\static\network\dislike.png"
            dislike.innerHTML = posts.dislikes;
            document.querySelector("#display_Posts").append(dislike_Image);
            document.querySelector('#display_Posts').append(dislike);
        })
    })
    return 0;
}

