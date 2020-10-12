const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//Create connection
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    database : 'cookbookbd',
    password: null,
    user: 'root',
});


//Connect
connection.connect(function(err) {
  if(err){
      console.log(err);
  }else{
      console.log("Conexion establecida con exito.")
  }
});

// Show recipes
app.get("/", function (req, res){
  let data = "SELECT * FROM recipe"
  connection.query(data, (err, result) => {
      if (err) throw err;
      res.send(result)
  })
})

// Show all recipes by id
app.get("/recipe/:id", function (req, res){
let id = req.params
let data = `SELECT * FROM recipe WHERE user_id =  ${id.id}`
connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result)
})
})

//Show ingredients
app.get("/ingredients", function (req, res) {
  let data = `SELECT * FROM ingredients`
  connection.query(data, (err, result) => {
      if (err) throw err;
      res.send(result)
  })
})

// Recipes Search and create

//Search recipes 
app.get("/recipes/search?", function (req, res){
  let subquery =""; 
  let array = []
 
  if (req.query.interrogacion == 5) {
      array = [req.query.ingredient1, req.query.ingredient2, req.query.ingredient3, req.query.ingredient4, req.query.ingredient5, req.query.type]
      subquery = "?, ?, ?, ?, ? "
  }

  if (req.query.interrogacion == 4) {
      array = [req.query.ingredient1, req.query.ingredient2, req.query.ingredient3, req.query.ingredient4, req.query.type]
      subquery = "?, ?, ?, ? "
  }

  if (req.query.interrogacion == 3) {
      array = [req.query.ingredient1, req.query.ingredient2, req.query.ingredient3, req.query.type]
      subquery = "?, ?, ? "
  }

  if (req.query.interrogacion == 2) {
      array = [req.query.ingredient1, req.query.ingredient2, req.query.type]
      subquery = "?, ?"
  }

  if (req.query.interrogacion == 1) {
      array = [req.query.ingredient1,  req.query.type]
      subquery = "?"
  }
   
  let data = `SELECT COUNT(*) AS n_ingredients, recipe.recipe_id, recipe.title, recipe.description, recipe.duration, recipe.ingredients, recipe.dificulty, recipe.picture, recipe.type, user_id FROM recipe JOIN recipe_ingredients ON recipe.recipe_id = recipe_ingredients.recipe_id JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.ingredient_id WHERE ingredients.name IN (${subquery}) AND recipe.type = ? GROUP BY recipe.recipe_id HAVING n_ingredients=` + req.query.interrogacion;
 
  connection.query(data, array, (err, result) => {
      if (err) throw err;
      res.send(result)
  })

});

//Create recipe
app.post("/recipes", function (req,res) {

  let data = `INSERT INTO recipe (user_id, title, ingredients, duration, dificulty, type, description, picture) VALUES (${req.body.user_id}, "${req.body.title}", "${req.body.ingredients}", "${req.body.duration}", "${req.body.dificulty}", "${req.body.type}", "${req.body.description}", "${req.body.picture}")`;
 
  connection.query(data, (err, result1) => {
    if (err) throw err;
        for (let i=0; i<req.body.ingredients.length; i++) {

            let ingredient_id = `SELECT ingredient_id FROM ingredients WHERE name = "${req.body.ingredients[i]}"`
               
            connection.query(ingredient_id, (err, result) => {
                if (err) throw err;
                let ingredients = `INSERT into recipe_ingredients (recipe_id, ingredient_id) VALUES (${result1.insertId}, ${result[0].ingredient_id})`
               
                connection.query(ingredients, (err, result) => {
                  if (err) throw err;
                })
            })
      }
      res.send(result1)
  })
  
})

//Update recipe
app.put("/recipes/update", function (req,res) {

  let data = `UPDATE recipe SET title = "${req.body.title}", ingredients = "${req.body.ingredients}", duration = "${req.body.duration}", dificulty = "${req.body.dificulty}", type = "${req.body.type}", description = "${req.body.description}", picture = "${req.body.picture}" WHERE recipe.recipe_id = ${req.body.recipe_id}`;
console.log(req.body.picture)
  
  connection.query(data, (err, result) => {
      if (err) throw err;
      
      res.send(result)
  })
})

//  show comments by recipe_id
app.get("/comments/:id", function (req, res){
let id = req.params
let data = `SELECT * FROM comment WHERE recipe_id =  ${id.id}`
connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result)
})
})

//  Create a comment
app.post("/comment/", function (req, res){
let data = `INSERT INTO comment (description, user_id, recipe_id, user_name) VALUES ("${req.body.description}", ${req.body.user_id}, ${req.body.recipe_id}, "${req.body.user_name}")`;
 
connection.query(data, (err, result) => {
    if (err) throw err;          
    res.send(result);  
  
})
})

// get comments_number
app.get("/comments_number/:id", function (req, res){
let id = req.params
let data = `SELECT COUNT(comment_id) AS count FROM comment WHERE recipe_id =  ${id.id}`
connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result)
})
})


//Delete recipe
app.delete("/", function (req, res){

  let data = `DELETE FROM recipe WHERE recipe_id = ${req.body.id}` 
  connection.query(data, (err, result) => {
      if (err) throw err;
      res.send(result)
  })
})


// Show following
app.get("/recipe/followed/:id", function (req, res) {
let data = `SELECT * FROM user JOIN following ON user.user_id = following.followers_id WHERE (following.user_id = ${req.params.id} AND user.user_id = following.followers_id)`
  connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result);
  })  
})
// Get following number
app.get("/recipe/followed/count/:id", function (req, res){
let id = req.params
let data = `SELECT COUNT(user_id) AS count FROM following WHERE user_id =  ${id.id}`
connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result)
})
})
// Followers  number
app.get("/recipe/followers/count/:id", function (req, res){
let id = req.params
let data = `SELECT COUNT(profile_id) AS count FROM followers WHERE profile_id =  ${id.id}`
connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result)
})
})
// Show followers
app.get('/recipe/followers/:user_id', (req, res) => { 
connection.query(`SELECT * FROM user JOIN followers ON user.user_id = followers.seguidores_id WHERE (followers.profile_id = ${req.params.user_id} AND followers.seguidores_id = user.user_id)`,  (error, result) => {
  if (error){
    console.log(error)
  }else{
    res.send(result)
  }
});
});

// Get status following
app.get("/recipe/followed/status/:user_id/:follower_id", function (req, res) {
let data = `SELECT * FROM following WHERE following.user_id = ${req.params.user_id} AND following.followers_id = ${req.params.follower_id}`
  connection.query(data, (err, result) => {
    if (err) throw err;
    res.send(result);
  })  
})


app.post("/recipe/seguir", function(req,res){
let followed = `INSERT INTO following (followers_id, user_id, status) VALUES ( ${req.body.followers_id}, ${req.body.user_id}, "${req.body.status}")`;
connection.query(followed ,function(err,result){
    if(!err) {
      let followers = `INSERT INTO followers( seguidores_id, profile_id, status) VALUES (${req.body.user_id}, ${req.body.followers_id}, "${req.body.status}")`;
      connection.query(followers ,function(err,result){
          if(!err) {     
              res.send(result)
              console.log(result)
                      } else {
              console.log(err);
                } 
          })
        }
  })
})

// Delete following
app.delete("/recipe/followed", function(req,res){
let data = `DELETE FROM following WHERE followers_id = ${req.body.id} AND user_id = ${req.body.user_id}` 
connection.query(data ,function(err,result){
    if(!err){
        let followers = `DELETE FROM followers WHERE profile_id = ${req.body.id} AND seguidores_id = ${req.body.user_id}`;
        connection.query(followers ,function(err,result){
            if(!err) {     
                res.send(result)
                        } else {
                          return
                  } 
            })
          }
        })
      })


// Classes
app.get("/lesson",function(req,res){
  connection.query("SELECT * FROM `lesson`",function(err,result){
      if(!err){
         res.send(result);
      }else{
          console.log(err);
      }
  });
});

// lessons
app.get('/lesson/:user_id', (req, res) => {
  const { id_user } = req.params; 
  conection.query('SELECT * FROM `lesson` WHERE user_id = ?', [user_id], (error, result) => {
    if (error){
      console.log(error)
    }else{
      res.send(result)
    }
  });
});


app.get('/lesson/:lesson_id', (req, res) => {
    const { lesson_id } = req.params; 
    connection.query('SELECT * FROM `lesson`  WHERE lesson_id = ?',  [lesson_id] , (error, result) => {
      if (error){
        console.log(error)
      }else{
        res.send(result)
      }
    });
});


app.post("/lesson",function(req,res){
  var insert = "INSERT INTO `lesson`(`title`, `date`, `timetable`, `dificulty`, `price`, `ingredients`, `description`, `image`, `user_id`) VALUES (?,?,?,?,?,?,?,?,?)";
  var array = [req.body.title ,req.body.date, req.body.timetable, req.body.dificulty ,req.body.price, req.body.ingredients,req.body.description, req.body.image, req.body.user_id ];
  connection.query(insert,array,function(err,result){
      if(!err){
          res.send(result);
          console.log(result);
       }else{
          res.send(err);
       }
  })
});
app.put("/lesson",function(req,res){
  var insert = "UPDATE `lesson` SET `title`=?,`date`=?,`timetable`=?, `dificulty`=?, `price`=?, `ingredients`=?, `description`=?, `image`=?, `user_id`=? WHERE lesson_id = ?";
  var array = [req.body.title ,req.body.date, req.body.timetable, req.body.dificulty ,req.body.price, req.body.ingredients,req.body.description, req.body.image, req.body.user_id, req.body.lesson_id];
  connection.query(insert,array,function(err,result){
      if(!err){
          res.send(result);
          console.log(result);
       }else{
          res.send(err);
       }
  })
});
app.delete("/lesson",function(req,res){
  var insert = "DELETE FROM `lesson` WHERE lesson_id = "+ req.body.lesson_id +"";
  connection.query(insert,function(err,result){
      if(!err){
          res.send(result);
          console.log(result);
       }else{
          res.send(err);
       }
  })
});

app.get('/lesson/user/:user_id', (req, res) => { 
const { user_id } = req.params; 
connection.query('SELECT * FROM `lesson` WHERE user_id = ?', [user_id], (error, result) => {
  if (error){
    console.log(error)
  }else{
    res.send(result)
  }
});
});

app.get('/lesson/:lesson_id', (req, res) => {
  const { lesson_id } = req.params; 
  connection.query('SELECT * FROM `lesson`  WHERE lesson_id = ?',  [lesson_id] , (error, result) => {
    if (error){
      console.log(error)
    }else{
      res.send(result)
    }
    console.log(result)
  });
});

//Usuario que ha publicado la clase
app.get('/user/lesson/:lesson_id', (req, res) => { 
const { lesson_id } = req.params; 
connection.query('SELECT * FROM `lesson` JOIN user ON (lesson.user_id = user.user_id) WHERE lesson_id = ?', [lesson_id], (error, result) => {
  if (error){
    console.log(error)
  }else{
    res.send(result)
  }
});
});

// User login register

app.get("/user",function(req,res){
  connection.query("SELECT * FROM user",(err,result,)=>{
      if(!err){
         res.send(result);
      }else{
          console.log(err);
       }
  }
)});

//Select user Id
app.get('/user/:id', (req, res) => {
let id = req.params
let data = `SELECT * FROM user WHERE user_id =  ${id.id}`
  connection.query(data, [id], (error, result) => {
    if (error){
      console.log(error)
    }else{
      res.send(result)
    }
  });
});

app.post("/user/login",function(req,res){
var select = "SELECT * FROM user WHERE user_name = ? AND password = ?";
var array = [req.body.user_name,req.body.password];

connection.query(select,array,function(err,result){
  if(!err){
    res.send(result);
   }else{
    res.send(err);
   }
})
});

//USER REGISTER
app.post("/user/register",function(req,res){
var select = "SELECT * FROM user WHERE user_name = ? AND email = ? AND password = ?";
var array = [req.body.user_name,req.body.email,req.body.password];
connection.query(select,array,function(err,result){
  console.log(result)
  if(result.length === 0){
    var insert =`INSERT INTO user (user_name,email,password) VALUES (?,?,?)`;
  }else{
    console.log("usuario ya existe")
  }
  connection.query(insert,array,function(err,result){
    if(!err){
      res.send(result);
    }else{
        res.send(err);
    }
  })
})
});

//USER REGISTER SOCIAL
app.post("/user/register/social",function(req,res){
let data = `INSERT INTO user (user_name, email, password, picture) VALUES ("${req.body.user_name}", "${req.body.email}", "${req.body.password}", "${req.body.picture}")`;

connection.query(data,function(err,result){
  if(!err){
    res.send(result);
   }else{
    res.send(err);
   }
})
});

//USER LOGIN SOCIAL
app.post("/user/login/social",function(req,res){
var select = `SELECT * FROM user WHERE user_name = "${req.body.user_name}" AND user.email = "${req.body.email}"`;


connection.query(select,function(err,result){
  console.log(result)
  if(!err){
    res.send(result);
   }else{
    res.send(err);
   }
})
});


//USER UPDATE AND UPLOAD PIC
app.put("/user/edit_profile",function(req,res){
var insert = "UPDATE user SET email=?, password=?, picture=? WHERE user_id = ?";
var array = [req.body.email,req.body.password,req.body.picture,req.body.user_id];
connection.query(insert,array,function(err,result){
  if(!err){
    res.send(result);
   }else{
    res.send(err);
    console.log(err);
   }
})
});

//Delete user
app.delete("/user",function(req,res){
  var insert = "DELETE FROM user WHERE user_id ="+req.body.user_id+"";
  connection.query(insert,function(err,result){
      if(!err){
          res.send(result);
       }else{
          res.send(err);
       }
  })
});

//RECETAS FAVORITAS DE UN USUARIO
app.get('/favorite/user/:user_id', (req, res) => {  
const { user_id } = req.params; 
connection.query('SELECT user_fav_id, recipe.recipe_id, recipe.title, recipe.ingredients, recipe.description, recipe.picture, recipe.user_id, user.user_name, user.picture AS user_pic FROM recipe JOIN user on recipe.user_id=user.user_id JOIN user_fav ON recipe.recipe_id=user_fav.recipe_id WHERE user_fav.user_id = ?', [user_id],(error, result) =>  {
  if(!error) {
    console.log(result)
        res.send(result)
      } else {
        console.log(error);
      } 
});
});
app.post("/favorite",function(req,res){
var insert = "INSERT INTO `user_fav`(user_fav_id, `recipe_id`, `user_id`) VALUES (?, ?,?)";
var array = [ req.body.user_fav_id, req.body.recipe_id, req.body.user_id];
connection.query(insert,array,function(err,result){
  if(!err){
    res.send(result);
   }else{
    res.send(err);
   }
})
});

// Check fav
app.post('/fav', (req, res) => {  
  connection.query('SELECT * FROM user_fav WHERE recipe_id = ? AND user_id = ?', [req.body.recipe_id, req.body.user_id], (error, result) =>  { 
    if(!error) {
      console.log(result)
          res.send(result)
        } else {
          console.log(error);
        } 
  });
});

app.delete("/favorite",function(req,res){
var insert = "DELETE FROM `user_fav` WHERE `user_fav_id`= "+ req.body.user_fav_id +"";
connection.query(insert,function(err,result){
    if(!err){
        res.send(result);
        console.log(result);
     }else{
        res.send(err);
     }
})
});


app.post('/likes2', (req, res) => {  
  connection.query('SELECT * FROM likes WHERE recipe_id = ? AND user_id = ?', [req.body.recipe_id, req.body.user_id], (error, result) =>  { 
    if(!error) {
      console.log(result)
          res.send(result)
        } else {
          console.log(error);
        } 
  });
});

app.get('/likes/:recipe_id', (req, res) => {  
  const { recipe_id } = req.params; 
  connection.query('SELECT COUNT(recipe_id) AS likes_n FROM likes WHERE recipe_id = ?', [recipe_id],(error, result) =>  { 
    if(!error) {
      console.log(result)
          res.send(result)
        } else {
          console.log(error);
        } 
  });
});

app.post("/likes", function(req,res){
  var insert = "INSERT INTO likes (user_id, recipe_id, count)  VALUES (?,?,?)"
  var array = [  req.body.user_id, req.body.recipe_id, req.body.count];
  connection.query(insert,array,function(err,result){
    if(!err){
      res.send(result);
    }else{
      res.send(err);
    }
  })
});

app.delete("/likes",function(req,res){
  var insert = "DELETE FROM `likes` WHERE `likes_id`= "+ req.body.likes_id +"";
  connection.query(insert,function(err,result){
      if(!err){
          res.send(result);
          console.log(result);
       }else{
          res.send(err);
       }
  })
});



app.listen(3000)
