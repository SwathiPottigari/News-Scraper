$(function(){

    $(".save").click(function(event){
        let id=$(this).parent().parent().parent().attr("data-id");
        $.ajax("/saveArticle/"+id,{
            type:"PUT"
        }).then(function(){
            location.reload();
        }).catch();
    });
});