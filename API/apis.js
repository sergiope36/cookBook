const express = require ("express");
const bodyParser = require("body-parser");
const app = express();


let cors = require("cors");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"root",
  database:"cookbookbd",
  port: 8889 

});

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Conexion establecida con exito.")
    }
    
});

app.get("/lesson",function(req,res){
    connection.query("SELECT * FROM `lesson`",function(err,result){
        if(!err){
           res.send(result);
        }else{
            console.log(err);
        }
    });
});
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

//USERS

//Select all users
app.get("/user",function(req,res){
    connection.query("SELECT * FROM user",(err,result,)=>{
        if(!err){
           res.send(result);
        }else{
            console.log(err);
        }
    }
)});
/*
app.get('/users/:user_id', (req, res) => {
    const  user_id  = req.params.user_id;
    console.log(user_id);
    connection.query('SELECT * FROM user WHERE user_id = ?', [user_id], (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
});
*/
//Select user Id
app.get('/user', (req, res) => {
    const  id  = req.query.id;
    console.log(id);
    connection.query('SELECT * FROM `user` WHERE user_id = ?', [id], (error, result) => {
      if (error){
        console.log(error)
      }else{
        res.send(result)
      }
    });
  });
//USER LOGIN
app.post("/user/login",function(req,res){
    var select = "SELECT * FROM user WHERE user_name = ? AND password = ?";
    var array = [req.body.user_name,req.body.password];
    console.log(array)
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
    var insert = "INSERT INTO user (email,user_name,password) VALUES (?,?,?)";
    var array = [req.body.email,req.body.user_name,req.body.password];
    connection.query(insert,array,function(err,result){
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

// Recipes Search and create
//Show recipes by ingredients
app.get("/recipes/search?", function (req, res){
    let ingredients = req.query.ingredients;
    data = `SELECT * FROM recipe JOIN recipe_ingredients ON recipe.recipe_id  = recipe_ingredients.recipe_id JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.ingredient_id WHERE ingredients.name IN ("${ingredients[1]}", "${ingredients[2]}", "${ingredients[3]}, "${ingredients[4]}, "${ingredients[5]}") GROUP BY recipe.title HAVING count(recipe.title) = "${ingredients.length}"`
    result(data, res)
})
//Create recipe
app.post("/recipes/insert", function (req,res) {
    let data = `INSERT INTO recipe (title, ingredients, duration, dificulty, type, description, picture, user_id) VALUES ("${req.body.title}", "${req.body.ingredients}", "${req.body.duration}", "${req.body.dificulty}", "${req.body.type}", "${req.body.description}", "${req.body.picture}", ${req.body.user_id})`;
    db.query(data, (err, result) => {
        for (let i=0; req.body.ingredients.length; i++) {
            let ingredients = `SELECT ingredient_id FROM ingredients WHERE ingredients.name = "${req.body.ingredients[i]}"`
            let recipe_id = result.insertId
             db.query(ingredients, (err, result) => {
               let results = `INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (${recipe_id}, ${result[0].ingredient_id})`
               console.log(result)
               db.query(results, (err, result) => {
                   res.send(results)
               })
          })
        }
    })
})
//Update recipe
app.put("/recipes/update", function (req,res) {
    let data = `UPDATE recipe SET title = "${req.body.title}", ingredients = "${req.body.ingredients}", duration = "${req.body.duration}", dificulty = "${req.body.dificulty}", type = "${req.body.type}", description = "${req.body.description}", picture = "${req.body.picture}"`;
    result(data, res)
})
//Delete recipe
app.delete("/recipes/:id", function (req, res){
    let id = req.params
    let data = `DELETE FROM recipe WHERE recipe.id = "${id.id}"`
    result(data, res)
})

app.listen(3000);