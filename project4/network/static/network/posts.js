document.addEventListener('DOMContentLoaded',function(){
    document.querySelector('#post_Button').addEventListener('click',postcontent);
    document.querySelector('#button').addEventListener('click',hey);
});

function postcontent(){
    console.log("hello world");
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

function hey(){
    console.log("hello world");
}