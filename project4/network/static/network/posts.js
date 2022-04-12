document.addEventListener('DOMContentLoaded',function(){
    document.querySelector("#post_Btn").addEventListener('click',()=>postcontent);
});

function postcontent(){
    const content = document.querySelector("#post_Content").value;
    fetch('/emails',{
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