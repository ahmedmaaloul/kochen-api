const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// @desc    Register new user
// @route   POST /v1/api/users/create
// @access  Public
const user_create_post = (req, res) => {
  const userContent = req.body;
  const salt = bcrypt.genSaltSync(10);
  userContent["password"] = bcrypt.hashSync(userContent["password"], salt);
  const user = new User(userContent);
  const token = generateToken(user.id);
  //check if the user exists already
  User.find({email:userContent.email}).then((users)=>{
      if(users.length > 0)
          res.status(409).json({
          error:"L'adresse e-mail existe déjà."
          })
      else {
          // saving the user
          user.save().then((data)=>{
              res.status(201).json({
                  _id:user.id,
                  email:user.email,
                  firstName:user.firstName,
                  lastName:user.lastName,
                  token:generateToken(user.id),
              })
          }).catch((err)=>{
              res.status(500).json({
                  error: "Something went wrong !, we will fix it as soon as possible",
                  details:err
              })
          })

      }
  })
//   // saving the user
//   user
//     .save()
//     .then((data) => {
//       res.status(201).json({
//         _id: user._id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         token,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: "Something went wrong !, we will fix it as soon as possible",
//         details: err,
//       });
//     });
};

// @desc    Authenticate a user
// @route   POST /v1/api/users/login
// @access  Public
const user_login_post = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("_id email password firstName lastName likes")
    .then((data) => {
      if (bcrypt.compareSync(password, data.password)) {
        res.status(202).json({
          _id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          token:generateToken(data._id),
        });
      }
      else{
        res.status(403).json({
          error: "L'email ou le mot de passe saisi est incorrect.",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: "Email incorrect ou peut-être devez-vous vous inscrire avant.",
        details: err,
      });
    });
};
// @desc    get the avatar of user
// @route   GET /v1/api/users/avatar/:id
// @access  Private
const user_avatar_get= (req,res)=>{
  User.findOne({_id:req.params.id}).select("firstName lastName").then(data=>{
      res.status(200).json({
        firstName: data.firstName,
        lastName: data.lastName,
      })
  }).catch((err)=>{
    res.status(404).json({
      error: "User introuvable",
      details: err,
    });
  })
}
// @desc    get the profile of user
// @route   GET /api/v1/users/profile
// @access  Private
const user_profile_get= (req,res)=>{
  User.findOne({_id:req.user._id}).select("firstName lastName birthdate password").then(data=>{
      res.status(200).json({
        firstName: data.firstName,
        lastName: data.lastName,
        birthdate:data.birthdate,
        password:data.password
      })
  }).catch((err)=>{
    res.status(404).json({
      error: "User introuvable",
      details: err,
    });
  })
}
// @desc    get the profile of user
// @route   GET /api/v1/users/profile
// @access  Private
const user_profile_put= (req,res)=>{
  const userContent= req.body
  if(userContent.password){
    const salt = bcrypt.genSaltSync(10);
    userContent["password"] = bcrypt.hashSync(userContent["password"], salt);
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: userContent },
    {
      new: true,
    }
  ).then(data=>{
      res.status(200).json({
        message:"les informations de l'utilisteur a été mis à jour"
      })
  }).catch((err)=>{
    res.status(404).json({
      error: "User introuvable",
      details: err,
    });
  })
}
// @desc    add a recipe to list of likes
// @route   POST /v1/api/users/like
// @access  Private
const like_post =(req,res)=>{
    const {recipe_id} = req.body
    const user_id = req.user._id
    User.findOne({_id:user_id}).then((user)=>{
        if(user){
            user.likes.push(recipe_id)
            user.save().then(()=>{
                res.status(201).json({
                    message:"added to list of likes",
                    likes:user.likes
                  });
            }).catch(()=>{
                res.status(500).json({
                    error: "Something went wrong !, we will fix it as soon as possible",
                  });
            })
        }
        else{
            res.status(404).json({
                error: "invalid user",
              });
        }
    }).catch(()=>{
        res.status(500).json({
            error: "Something went wrong !, we will fix it as soon as possible",
          });
    })
}

// @desc    remove a recipe from the list of likes
// @route   DELETE /v1/api/users/dislike
// @access  Private
const dislike_delete =(req,res)=>{
    const {recipe_id} = req.body
    const user_id = req.user._id
    console.log(recipe_id)
    User.findOne({_id:user_id}).then((user)=>{
        if(user){
            user.likes.pull(recipe_id)
            user.save().then(()=>{
                res.status(201).json({
                    message:"removed from the list of likes",
                    likes:user.likes
                  });
            }).catch(()=>{
                res.status(500).json({
                    error: "Something went wrong !, we will fix it as soon as possible",
                  });
            })
        }
        else{
            res.status(404).json({
                error: "invalid user",
              });
        }
    }).catch(()=>{
        res.status(500).json({
            error: "Something went wrong !, we will fix it as soon as possible",
          });
    })
}
const user_likes_get = (req,res)=>{
  User.findById(req.user._id).select("likes").then((likes)=>{
    res.status(200).json({
      likes,
    })
  }).catch(err=>console.log(err))
}
//Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    {id},
    process.env.KEY_SECRET,
    {
      expiresIn: "1d", // 1 day in days
    }
  );
};

module.exports = {
  user_create_post,
  user_login_post,
  user_avatar_get,
  user_likes_get,
  like_post,
  dislike_delete,
  user_profile_get,
  user_profile_put,
};
