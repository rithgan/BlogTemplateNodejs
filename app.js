var bodyParser=require("body-parser");
var express= require("express");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

var app=express();

mongoose.connect('mongodb://localhost:27017/restful_blog',{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//MONGOOSE MODE CONFIG
//title
//image
//body
//created
mongoose.set('useFindAndModify', false);  //removes the depreciation warning for mongoose
var BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body:  String,
  created: {type: Date, default:  Date.now} //default date is used
});
var Blog= mongoose.model('Blog',BlogSchema);

//RESTFUL ROUTES
//INDEX
app.get("/",(req,res)=>{
  res.redirect('/blogs')
});
app.get('/blogs', function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log(error);
    }
    else{
      res.render('index',{blogs:blogs});
    }
  })
});

//NEW
app.get("/blogs/new",function(req,res){
  res.render("new");
});

//CREATE
app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitizer(req.body.blog.body);
  //using body-parser
  Blog.create(req.body.blog,function(err,newBlog){
    if(err){
      res.render("new");
    }
    else{
      res.redirect('/blogs');
    }
  });
});

//SHOW
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("show",{blog:foundBlog});
    }
  });
});

// EDIT
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs")
    }
    else{
      res.render("edit",{blog: foundBlog});
    }
  });
});

//UPDATE
app.put("/blogs/:id",function(req,res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs/"+ req.params.id);
    }
  });
});

//DELETE
app.delete("/blogs/:id",function(req,res){
    req.body.blog.body=req.santitizer(req.body.blog.body);
  Blog.findByIdAndRemove(req.params.id,function(err,deletedBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  })
});


app.listen(3000,function(){
  console.log("Server is running");
})
