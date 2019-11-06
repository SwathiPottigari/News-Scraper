$(function () {

    $(".save").click(function (event) {
        let id = $(this).parent().parent().parent().attr("data-id");
        $.ajax("/saveArticle/" + id, {
            type: "PUT"
        }).then(function () {
            location.reload();
        }).catch();
    });

    $(".delete").click(function (event) {
        let id = $(this).parent().parent().parent().attr("data-id");
        $.ajax("/deleteArticle/" + id, {
            type: "DELETE"
        }).then(function (result) {
            location.reload();
        }).catch(function (error) {
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

    $(".note-delete").click(function (event) {
        let notesId = $(this).attr('data-id');
        let articleId = $(this).closest(".modal").attr("id").split("-")[1];
        $.ajax("/deleteNotes/" + notesId + "/" + articleId, {
            type: "DELETE"
        }).then(function (results) {
            location.reload();
        }).catch(function (error) { console.log(error) });
    });

    $(".saveNotes").click(function (event) {
        let id = $(this).closest(".modal").attr("id").split("-")[1];
        let notes={
            note:$("#newNotes").val()
        };
        
        $.ajax("/saveNotes/" + id,{
            type:"POST",
            data:notes
        }).then(function (results) {
            location.reload();   
        }).catch(function (error) { console.log(error) });
    });
});