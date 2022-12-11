const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
const _ = require("lodash");
const today = new Date();
    const options={
        month:'long',
        day:'numeric',
        weekday: 'long'
    }
const day = today.toLocaleDateString("en-us",options);
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://adminaarthi:Log123@cluster0.subbc.mongodb.net/todolistDB');
  const todoSchema = new mongoose.Schema({
      itemName:String
  });
  const todoCollect = new mongoose.model("TodoList",todoSchema);
  const workItem = new todoCollect({
      itemName:"Welcome"
  });
  const studyItem = new todoCollect({
      itemName:"To ToDoList"
  })
  const lapItem = new todoCollect({
      itemName:"Click + to add the items"
  });
  const items =[workItem,studyItem,lapItem];

  const listSchema = new mongoose.Schema({
      item_name:[todoSchema],
      name:String
  });
  const listCollect = new mongoose.model("List",listSchema);
  
    
app.get("/", function(req, res)
{
todoCollect.find({},function(err,todoData)
        {
            if(todoData.length == 0)
            {
                todoCollect.insertMany(items,function(err)
            {
              if(err)
              {
                  console.log(err);
              }
              else
              {
                  console.log("Inserted many")
              }
      });
      res.redirect("/");
}
else
{
    res.render("list",{listTitle:day , newItems:todoData} );
}
        
});
  
});

app.get("/:customListName",function(req,res){

    const customListName=(_.capitalize(req.params.customListName));
    if (customListName==="favicon.ico")
    {
        return;
    }
    listCollect.findOne({name:customListName},async function(err,foundList)
    {
        if(!err)
        {
            if(!foundList)
            {
                // create a new list if not found

                const userList = new listCollect({
                    name:customListName,
                    item_name:items
                
                });
                await userList.save();
                res.redirect("/"+ customListName);
            
            }

            else
            {
             res.render("list",{listTitle:foundList.name, newItems:foundList.item_name})
            }
        }
    });
    

});
app.post("/",function(req,res){
    const modified_roto = req.body.list;
    const item = req.body.newItem;
    const userItem = new todoCollect({
        itemName:item
        })
        if (modified_roto === day)
        {
            userItem.save();
            res.redirect("/");
        }
        else{
            listCollect.findOne({name:modified_roto},function(err,foundList)
           
           {
                foundList.item_name.push(userItem);
                foundList.save();
                res.redirect("/"+modified_roto);
           } );
        }
});
app.post("/delete",function(req,res){
    const checkedValue = req.body.checkboxed;
    const hidlistName = req.body.hidlistName
    if(hidlistName===day)
    {
        todoCollect.findByIdAndRemove(checkedValue,function(err){
            if(!err)
            {
                console.log("Sucees")
                res.redirect("/")
            }
            else{
                console.log(err);
            }
        });
    }
    else
    {
        listCollect.findOneAndUpdate({name:hidlistName},{$pull:{item_name:{_id:checkedValue}}},function(err,results)
        {
            if(!err)
            {
                res.redirect("/"+hidlistName);
            }
        });
    }
    
});

app.listen(process.env.PORT || 3000,function(){

    console.log("Server is up and running"); 
});



