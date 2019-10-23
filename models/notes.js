const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const NotesSchema=new Schema({
    note:{
        type:Text
    }
});

const Notes=mongoose.model("Notes",NotesSchema);

module.exports=Notes;