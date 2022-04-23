document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#post_Button').addEventListener('click', postcontent);
    document.querySelector('#all_Posts').addEventListener('click', ()=> display('display'));
    document.querySelector("#following").addEventListener('click', ()=>display('following'));
    display('display');
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

function display(content){
    fetch(`/${content}`)
    .then(response => response.json())
    .then(function(posts){
        if(content == 'following'){
            document.querySelector('#new_Post').style.display ='none';
            document.querySelector('#display_Posts').innerHTML = '';
        }
        posts.forEach(posts => {
            document.querySelector('#display_Posts').style.display = 'block'
            const wrapper = document.createElement('div');
            wrapper.setAttribute('id','wrapper');
            wrapper.style.border = "0.5px";
            wrapper.style.borderRadius = "0.3px";
            const username = document.createElement('div');
            username.innerHTML = posts.user;
            username.style.fontWeight = "bold";
            username.onclick = function(){
                console.log(username.innerHTML);
                fetch(`profile/${username.innerHTML}`)
            }
            wrapper.append(username);
            const content = document.createElement('div');
            content.innerHTML = posts.post;
            content.style.fontSize = '25';
            wrapper.append(content);
            const date = document.createElement('div');
            date.innerHTML = posts.date_Posted;
            wrapper.append(date);
            const like = document.createElement('div');
            const like_Image = document.createElement('img');
            like_Image.src = "project4\network\static\network\heart.png"
            like.innerHTML = posts.likes;
            wrapper.append(like_Image);
            wrapper.append(like);
            const dislike = document.createElement('div');
            const dislike_Image = document.createElement('img');
            dislike_Image.src = "project4\network\static\network\dislike.png"
            dislike.innerHTML = posts.dislikes;
            wrapper.append(dislike_Image);
            wrapper.append(dislike);
            document.querySelector('#display_Posts').append(wrapper);
        })
    })
    return 0;
}


