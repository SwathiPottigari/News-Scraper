$(function(){

    $(".save").click(function(event){
        let id=$(this).parent().parent().parent().attr("data-id");
        $.ajax("/saveArticle/"+id,{
            type:"PUT"
        }).then(function(){
            location.reload();
        }).catch();
    });

    $(".delete").click(function(event){
        let id=$(this).parent().parent().parent().attr("data-id");
        $.ajax("/deleteArticle/"+id,{
            type:"DELETE"
        }).then(function(result){
            location.reload();
        }).catch(function(error){
            console.log(error);
        });
    });

    // $(".notes").click(function(event){
    //     let id=$(this).parent().parent().parent().attr("data-id");
    //     $.ajax("/getNotes/"+id).then(function(results){
    //         console.log(results);
    //         // location.reload(results);
    //         // alert("Hello");
    //          return (results);
    //     }).catch(function(error){
    //         console.log(error);
    //     });
    // });
});