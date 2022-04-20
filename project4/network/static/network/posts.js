document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#post_Button').addEventListener('click', postcontent);
    document.querySelector('#all_Posts').addEventListener('click', display);
});

function postcontent(){
    const content = document.querySelector("#post_Content").value;
    fetch('/new_Post',{
        method: POST,
        body: JSON.stringify({
            post : content
        })
    })
    .then(response=>response.JSON())
    .then(response => {
        console.log(response);
    })
}
function display (){
    console.log("hello world");
}
