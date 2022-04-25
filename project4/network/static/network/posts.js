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
        document.querySelector('#post_Content').value = '';
        const message = document.createElement('div');
        message.setAttribute('class','alert alert-info');
        message.setAttribute('role','alert');
        message.innerHTML = "Successfully Posted";
        document.querySelector('#display_Message').append(message);
        document.querySelector('#display_Message').style.display = "block";
        document.querySelector('#display_Message').onclick = function(){
            document.querySelector('#display_Message').innerHTML = "";
            document.querySelector('#display_Message').style.display = "none";
        }
    })
}

// displays friend posts, all posts or the profile of friends depending on the parameter passed 
function display(content){
    fetch(`/${content}`)
    .then(response => response.json())
    .then(function(posts){
        if(content == 'following'){
            document.querySelector('#new_Post').style.display ='none';
            document.querySelector('#display_Posts').innerHTML = '';
            document.querySelector('#display_Profile').style.display = 'none';
            document.querySelector('#display_Content').style.display = 'none';
            document.querySelector('#display_Message').style.display = 'none';
        }
        
        posts.forEach(posts => {
            document.querySelector('#display_Posts').style.display = 'block'
            document.querySelector('#display_Profile').style.display = 'none';
            document.querySelector('#display_Content').style.display = 'none';
            document.querySelector('#display_Message').style.display = 'none';
            const wrapper = document.createElement('div');
            wrapper.setAttribute('id','wrapper');
            wrapper.style.border = "0.5px";
            wrapper.style.borderRadius = "0.3px";
            const username = document.createElement('div');
            const user_id = posts.user;
            username.innerHTML = posts.user;
            username.style.fontWeight = "bold";

            //display profile of user clicked
            username.onclick = function(){
                document.querySelector('#new_Post').style.display ='none';
                document.querySelector('#display_Posts').style.display ='none';
                document.querySelector('#display_Message').style.display = 'none';
                document.querySelector('#display_Profile').style.display = 'flex';
                document.querySelector('#display_Posts').innerHTML = '';
                document.querySelector('#display_Content').style.display = 'block';
                fetch(`profile/${user_id}`)
                .then(response=>response.json())
                .then((post)=>{
                    console.log()
                    //do something 
                    //const User = document.createElement('div');
                    const text_Follower = document.createElement('h6');
                    const text_Following = document.createElement('h6');
                    //User.innerHTML = post.user;
                    //document.querySelector('#display_Profile').append(User);
                    const User = document.createElement('h3');
                    User.innerHTML = user_id
                    document.querySelector('#display_Profile').append(User);
                    const follower = document.createElement('div');
                    follower.innerHTML = post.counter_Follower;
                    text_Follower.innerHTML = "Followers: ";
                    document.querySelector('#display_Profile').append(text_Follower);
                    document.querySelector('#display_Profile').append(follower);
                    text_Following.innerHTML = "Following: ";
                    text_Following.style.marginLeft = "10px";
                    const following =document.createElement('div');
                    document.querySelector('#display_Profile').append(text_Following);
                    following.innerHTML = post.counter_Following;
                    document.querySelector('#display_Profile').append(following);
                    button_Container = document.createElement('div');
                    follow_Button = document.createElement('button');
                    Unfollow_Button = document.createElement('button');
                    follow_Button.innerHTML = "Follow";
                    follow_Button.setAttribute('class','btn btn-primary');
                    Unfollow_Button.setAttribute('class','btn btn-primary');
                    Unfollow_Button.innerHTML = "Unfollow";
                    button_Container.style.display = "block";
                    button_Container.style.postion = "absolute"
                    button_Container.style.padding = "10px";
                    button_Container.append(follow_Button);
                    button_Container.append(Unfollow_Button);
                    document.querySelector('#display_Profile').append(button_Container);

                    post.forEach(function(post){
                        const wrapper = document.createElement('div');
                        wrapper.setAttribute('id','wrapper');
                        wrapper.style.border = "0.5px";
                        wrapper.style.borderRadius = "0.3px";
                        const username = document.createElement('div');
                        const id = post.id;
                        username.setAttribute('id',id)
                        username.innerHTML = post.user;
                        username.style.fontWeight = "bold";
                        wrapper.append(username);
                        const content = document.createElement('div');
                        content.innerHTML = post.post;
                        content.style.fontSize = '25';
                        wrapper.append(content);
                        const date = document.createElement('div');
                        date.innerHTML = post.date_Posted;
                        wrapper.append(date);
                        const like = document.createElement('div');
                        const like_Image = document.createElement('img');
                        like_Image.src = "project4\network\static\network\heart.png"
                        like.innerHTML = post.likes;
                        wrapper.append(like_Image);
                        wrapper.append(like);
                        const dislike = document.createElement('div');
                        const dislike_Image = document.createElement('img');
                        dislike_Image.src = "project4\network\static\network\dislike.png"
                        dislike.innerHTML = post.dislikes;
                        wrapper.append(dislike_Image);
                        wrapper.append(dislike);
                        wrapper.style.border = "0.25px solid rgb(201, 199, 199)";
                        wrapper.style.borderRadius = "20px"
                        wrapper.style.padding = "10px";
                        wrapper.style.marginTop= "20px";
                        document.querySelector('#display_Content').append(wrapper);
                    });
                })
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
            like_Image.src = "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/red-heart.png";
            like_Image.style.width = "30px";
            like_Image.style.height = "30px";
            like.innerHTML = posts.likes;
            wrapper.append(like_Image);
            wrapper.append(like);
            const dislike = document.createElement('div');
            const dislike_Image = document.createElement('img');
            dislike_Image.src = "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/thumbs-down.png"
            dislike_Image.style.width = "30px";
            dislike_Image.style.height = "30px"
            dislike.innerHTML = posts.dislikes;
            wrapper.append(dislike_Image);
            wrapper.append(dislike);
            wrapper.style.border = "0.25px solid rgb(201, 199, 199)";
            wrapper.style.borderRadius = "20px"
            wrapper.style.padding = "10px";
            wrapper.style.marginTop= "20px";
            document.querySelector('#display_Posts').append(wrapper);
        })
    })
    return 0;
}


