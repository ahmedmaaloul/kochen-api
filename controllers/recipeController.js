const Recipe = require("../models/recipe");

// @desc    create recipes
// @route   POST /v1/api/recipes
// @access  Private
const recipe_create_post = (req, res) => {
  const uploadedImage = req.file;
  const recipeContent = req.body;
  recipeContent.created_by = req.user._id;
  recipeContent.image = uploadedImage.path;
  const recipe = new Recipe(recipeContent);
  recipe
    .save()
    .then((result) => {
      res.send(result);
    })
    .then((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    get recipes
// @route   GET /v1/api/recipes
// @access  Private
const recipe_index = (req, res) => {
  let page;
  if (req.query.page && req.query.page > 0) page = req.query.page - 1;
  else page = 0;
  Recipe.find()
    .select("title image body")
    .skip(page * process.env.LIMIT_PAGE)
    .limit(process.env.LIMIT_PAGE)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    get recipes by title
// @route   GET /v1/api/recipes/:title
// @access  Private
const recipe_title = (req, res) => {
  let page;
  if (req.query.page && req.query.page > 0) page = req.query.page - 1;
  else page = 0;
  Recipe.find({ title: { $regex: `${req.params.title}`, $options: "i" } })
    .select("title image body")
    .skip(page * process.env.LIMIT_PAGE)
    .limit(process.env.LIMIT_PAGE)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    get a recipe
// @route   GET /v1/api/recipes/details/:id
// @access  Private
const recipe_details = (req, res) => {
  Recipe.findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    update a recipe
// @route   PUT /api/v1/recipes/update/:id
// @access  Private
const recipe_update_put = (req, res) => {
  console.log(req.user);
  console.log(req.params.id);
  Recipe.findOne({ created_by: req.user._id, _id: req.params.id }).catch(() => {
    res.status(403).json({
      error: "Updating recipes that you do not own is not allowed.",
    });
  });
  const recipeContent = { ...req.body };
  if (req.file) recipeContent.image = req.file.path;
  Recipe.findOneAndUpdate(
    { _id: req.params.id },
    { $set: recipeContent },
    {
      new: true,
    }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    delete a recipe
// @route   DELETE /v1/api/recipes/delete/:id
// @access  Private
const recipe_delete = (req, res) => {
  Recipe.findOne({ created_by: req.user._id, _id: req.params.id }).catch(() => {
    res.status(403).json({
      error: "Deleting recipes that you do not own is not allowed.",
    });
  });
  Recipe.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    get my recipes
// @route   GET /v1/api/recipes/me
// @access  Private
const my_recipes_get = (req, res) => {
  let page;
  if (req.query.page && req.query.page > 0) page = req.query.page - 1;
  else page = 0;
  Recipe.find({ created_by: req.user._id })
    .select("title image body")
    .skip(page * process.env.LIMIT_PAGE)
    .limit(process.env.LIMIT_PAGE)
    .then((recipes) => {
      res.send(recipes);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
      });
    });
};

// @desc    get my favourite recipes
// @route   GET /v1/api/recipes/fav
// @access  Private
const fav_recipes_get = (req, res) => {
  let page;
  if (req.query.page && req.query.page > 0) page = req.query.page - 1;
  else page = 0;
  Recipe.find({
    _id: { $in: req.user.likes }
  })
    .select("title image body")
    .skip(page * process.env.LIMIT_PAGE)
    .limit(process.env.LIMIT_PAGE)
    .then((recipes) => {
      res.send(recipes);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong !, we will fix it as soon as possible",
      });
    });
};

// @desc    add a commment to recipe
// @route   POST /v1/api/recipes/details/:id/create
// @access  Private
const recipe_comment_post = (req, res) => {
  const recipe_id = req.params.id;
  const { body } = req.body;
  const created_by = req.user._id;
  Recipe.findOne({ _id: recipe_id })
    .then((recipe) => {
      if (recipe) {
        recipe.comments.push({
          created_by,
          body,
        });
        recipe
          .save()
          .then((data) => {
            res.status(201).json({
              message: "comment added successfully",
              data: data.comments[data.comments.length - 1],
            });
          })
          .catch(() => {
            res.status(500).json({
              error:
                "Something went wrong (adding a comment)!, we will fix it as soon as possible",
            });
          });
      } else {
        res.status(404).json({
          error: "recipe not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error:
          "Something went wrong (finding the recipe) !, we will fix it as soon as possible",
        details: err,
      });
    });
};

// @desc    delete from recipe
// @route   DELETE /v1/api/recipes/details/:id/delete
// @access  Private
const recipe_comment_delete = (req, res) => {
  const recipe_id = req.params.id;
  const { comment_id } = req.body;
  Recipe.findOne({ _id: recipe_id })
    .then((recipe) => {
      if (recipe) {
        const index = recipe.comments.findIndex(
          (comment) => comment.id === comment_id
        );
        if (index == -1) {
          res.status(404).json({
            error: "Comment not found",
          });
        } else {
          if (recipe.comments[index].created_by.toString() != req.user._id) {
            res.status(403).json({
              error: "Deleting commments that you do not own is not allowed.",
            });
            console.log("im here");
          } else {
            console.log("im here2");
            recipe.comments.pull({ _id: comment_id });
            recipe
              .save()
              .then(() => {
                console.log("im here3");
                res.status(200).json({
                  message: "comment deleted",
                });
              })
              .catch(() => {
                res.status(500).json({
                  error:
                    "Something went wrong (in saving changes ) !, we will fix it as soon as possible",
                });
              });
          }
        }
      } else {
        res.status(404).json({
          error: "recipe not found",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error:
          "Something went wrong (finding the recipe) !, we will fix it as soon as possible",
      });
    });
};

module.exports = {
  recipe_create_post,
  recipe_index,
  my_recipes_get,
  recipe_title,
  recipe_details,
  recipe_update_put,
  recipe_delete,
  recipe_comment_post,
  recipe_comment_delete,
  fav_recipes_get,
};
