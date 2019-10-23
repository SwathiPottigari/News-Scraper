const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const ArticleSchema=new Schema({

    headline:{
        type:String,
        required:true,
        unique:true
    },
    summary:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    notes:[{
        type:Schema.Types.ObjectId,
        ref:"Notes"
    }]

});

const Article=mongoose.model("Article",ArticleSchema);

module.exports=Article;