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
            
            const edit = document.createElement('a');
            edit.innerHTML = "Edit Post";
            edit.setAttribute('href','');
            edit.setAttribute('class','link-success');

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
                    const text_Follower = document.createElement('h6');
                    const text_Following = document.createElement('h6');
                    const User = document.createElement('h3');
                    User.innerHTML = user_id
                    document.querySelector('#display_Profile').append(User);
                    fetch(`follower/${user_id}`)
                    .then(response => response.json())
                    .then(function(data){
                        console.log(data);
                            const follower = document.createElement('div');
                            follower.innerHTML = data.counter_Follower;
                            text_Follower.innerHTML = "Followers: ";
                            document.querySelector('#display_Profile').append(text_Follower);
                            document.querySelector('#display_Profile').append(follower);
                            text_Following.innerHTML = "Following: ";
                            text_Following.style.marginLeft = "10px";
                            const following = document.createElement('div');
                            document.querySelector('#display_Profile').append(text_Following);
                            following.innerHTML = data.counter_Following;
                            document.querySelector('#display_Profile').append(following);
                    });
                    button_Container = document.createElement('div');
                    follow_Button = document.createElement('button');
                    Unfollow_Button = document.createElement('button');
                    follow_Button.innerHTML = "Follow";
                    follow_Button.style.marginRight = "20px";
                    follow_Button.setAttribute('class','btn btn-primary');
                    Unfollow_Button.setAttribute('class','btn btn-primary');
                    Unfollow_Button.innerHTML = "Unfollow";
                    button_Container.style.display = "block";
                    button_Container.style.postion = "absolute"
                    button_Container.style.padding = "10px";
                    button_Container.append(follow_Button);
                    button_Container.append(Unfollow_Button);
                    document.querySelector('#display_Profile').append(button_Container);

                    //calls follow function
                    follow_Button.onclick = function(){
                        follow(user_id)
                    }
                    //calls unfollow function
                    Unfollow_Button.onclick = function(){
                        unfollow(user_id)
                    }

                    //display posts related to the clicked profile
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
                        like_Image.src = "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/red-heart.png"
                        like_Image.style.width = "20px";
                        like_Image.style.height = "20px"
                        like.innerHTML = post.likes;
                        wrapper.append(like_Image);
                        wrapper.append(like);
                        const dislike = document.createElement('div');
                        const dislike_Image = document.createElement('img');
                        dislike_Image.src = "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/thumbs-down.png"
                        dislike.innerHTML = post.dislikes;
                        dislike_Image.style.width = "20px";
                        dislike_Image.style.height = "20px"
                        wrapper.append(dislike_Image);
                        wrapper.append(dislike);
                        wrapper.style.border = "0.25px solid rgb(201, 199, 199)";
                        wrapper.style.borderRadius = "20px"
                        wrapper.style.padding = "10px";
                        wrapper.style.marginTop= "20px";
                        document.querySelector('#display_Content').append(wrapper);
                    });
                });
            }
            wrapper.append(username);
            wrapper.append(edit);
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
            like_Image.style.width = "20px";
            like_Image.style.height = "20px";
            like.innerHTML = posts.likes;
            wrapper.append(like_Image);
            wrapper.append(like);
            const dislike = document.createElement('div');
            const dislike_Image = document.createElement('img');
            dislike_Image.src = "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/thumbs-down.png"
            dislike_Image.style.width = "20px";
            dislike_Image.style.height = "20px"
            dislike.innerHTML = posts.dislikes;
            wrapper.append(dislike_Image);
            wrapper.append(dislike);
            wrapper.style.border = "0.25px solid rgb(201, 199, 199)";
            wrapper.style.borderRadius = "20px"
            wrapper.style.padding = "10px";
            wrapper.style.marginTop= "20px";
            document.querySelector('#display_Posts').append(wrapper);
            
            const like_Text = "Like";
            like_Image.onclick = function(){
                like_Dislike(like_Text,posts.id);
            }

            const Dislike_Text = "Dislike";
            dislike_Image.onclick = function(){
                like_Dislike(Dislike_Text,posts.id);
            }

            edit.onclick = function(){
                edit_Post(posts.id)
            }
        })
    });
}

//allows user to follow another user
function follow(user_id){
    fetch(`follow/${user_id}`,{
        method: 'POST',
        body: JSON.stringify({
            follow : user_id
        })
    })
    .then(response=>response.json())
    .then(posts => {
        document.querySelector('#post_Content').value = '';
        const message = document.createElement('div');
        message.setAttribute('class','alert alert-info');
        message.setAttribute('role','alert');
        message.innerHTML = posts.message;
        document.querySelector('#display_Message').append(message);
        document.querySelector('#display_Message').style.display = "block";
        document.querySelector('#display_Message').onclick = function(){
        document.querySelector('#display_Message').innerHTML = "";
        document.querySelector('#display_Message').style.display = "none";
        }
    });
}

//allows a user to unfollow another user
function unfollow(user_id){
    fetch(`unfollow/${user_id}`,{
        method: 'POST',
        body: JSON.stringify({
            unfollow : user_id
        })
    })
    .then(response=>response.json())
    .then(posts => {
        document.querySelector('#post_Content').value = '';
        const message = document.createElement('div');
        message.setAttribute('class','alert alert-info');
        message.setAttribute('role','alert');
        message.innerHTML = posts.message;
        document.querySelector('#display_Message').append(message);
        document.querySelector('#display_Message').style.display = "block";
        document.querySelector('#display_Message').onclick = function(){
        document.querySelector('#display_Message').innerHTML = "";
        document.querySelector('#display_Message').style.display = "none";
        }
    });
}

 //allows a user to like or dislike posts 
function like_Dislike(status,post_id){
    if(status === "Like"){
        fetch(`like/${post_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                like: '1'
            })
            })

        const message = document.createElement('div');
        message.setAttribute('class','alert alert-info');
        message.setAttribute('role','alert');
        message.innerHTML = "Successfully liked";
        document.querySelector('#display_Message').append(message);
        document.querySelector('#display_Message').style.display = "block";
        document.querySelector('#display_Message').onclick = function(){
        document.querySelector('#display_Message').innerHTML = "";
        document.querySelector('#display_Message').style.display = "none";
    }
}
    else if (status === "Dislike"){
        fetch(`dislike/${post_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                dislike: '1'
            })
            })

        const message = document.createElement('div');
        message.setAttribute('class','alert alert-info');
        message.setAttribute('role','alert');
        message.innerHTML = "Successfully disliked";
        document.querySelector('#display_Message').append(message);
        document.querySelector('#display_Message').style.display = "block";
        document.querySelector('#display_Message').onclick = function(){
        document.querySelector('#display_Message').innerHTML = "";
        document.querySelector('#display_Message').style.display = "none";
    }
    }
}

function edit_Post(post_id){
    //event.preventDefault changes The default behaviour of the input which is to refresh the page once the function has passed. Thus making it stagnant
    event.preventDefault(); 

    document.querySelector('#display_Posts').innerHTML = '';
    document.querySelector('#display_Profile').style.display = 'none';
    document.querySelector('#display_Content').style.display = 'none';
    document.querySelector('#display_Message').style.display = 'none';
    document.querySelector('#edit_Posts').style.display = 'flex';
    document.querySelector('#new_Post').style.display = "none";

    const edit_Label = document.createElement('h4');
    const label_Div = document.createElement('div');
    edit_Label.innerHTML = "Edit";
    label_Div.append(edit_Label);
    const edit_TextArea = document.createElement('textarea');
    const textArea_Div = document.createElement('div');
    edit_TextArea.cols = 100;
    edit_TextArea.rows = 8;
    edit_TextArea.style.padding = "20px";
    edit_TextArea.setAttribute('class','form-group');
    textArea_Div.append(edit_TextArea);
    const edit_Button = document.createElement('button');
    const button_Div = document.createElement('div');
    edit_Button.setAttribute('class', 'btn btn-primary')
    edit_Button.innerHTML = "Edit"
    button_Div.append(edit_Button);
    document.querySelector('#edit_Posts').append(label_Div);
    document.querySelector('#edit_Posts').append(textArea_Div);
    document.querySelector('#edit_Posts').append(button_Div);
    
    fetch(`edit/${post_id}`)
    .then (response => response.json())
    .then(posts =>{
        if (posts.message){
            const message = document.createElement('div');
            message.setAttribute('class','alert alert-info');
            message.setAttribute('role','alert');
            message.innerHTML = posts.message
            document.querySelector('#display_Message').append(message);
            document.querySelector('#display_Message').style.display = "block";
            document.querySelector('#display_Message').onclick = function(){
            document.querySelector('#display_Message').innerHTML = "";
            document.querySelector('#display_Message').style.display = "none";
        }
              //show error message if user tried to edit other people's posts
            document.querySelector('#edit_Posts').innerHTML = '';
            const error_Message = document.createElement('div');
            message.setAttribute('class','alert alert-danger');
            message.setAttribute('role','alert');
            message.innerHTML = "Forbidden Task, You can't edit the posts of other people! Go back to all Posts"
            document.querySelector('#display_Message').append(error_Message);
            document.querySelector('#display_Message').style.display = "block";
            document.querySelector('#display_Message').onclick = function(){
            document.querySelector('#display_Message').innerHTML = "";
            document.querySelector('#display_Message').style.display = "none";
            }
            
        }
        else{
            edit_TextArea.innerHTML = posts.post;
        }
        
    });
    
    edit_Button.onclick = function(){
        const content = edit_TextArea.value;
        if(content === ''){
            const message = document.createElement('div');
                message.setAttribute('class','alert alert-danger');
                message.setAttribute('role','alert');
                message.innerHTML = "Content can't be empty";
                document.querySelector('#display_Message').append(message);
                document.querySelector('#display_Message').style.display = "block";
                document.querySelector('#display_Message').onclick = function(){
                document.querySelector('#display_Message').innerHTML = "";
                document.querySelector('#display_Message').style.display = "none";
                }
        }
        else{
            fetch(`edit/${post_id}`,{
                method: 'POST',
                body: JSON.stringify({
                    post : content
                })
            })
            .then(response=>response.json())
            .then(posts => {
                const message = document.createElement('div');
                message.setAttribute('class','alert alert-info');
                message.setAttribute('role','alert');
                message.innerHTML = "Successfully Updated Post";
                document.querySelector('#display_Message').append(message);
                document.querySelector('#display_Message').style.display = "block";
                document.querySelector('#display_Message').onclick = function(){
                document.querySelector('#display_Message').innerHTML = "";
                document.querySelector('#display_Message').style.display = "none";
                }
            })
        }
        
    }
}