import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAl_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //remove the # from the id to call the loadrecipe
    const id = window.location.hash.slice(1);

    if (!id) return;

    //0) render spinner
    recipeView.renderSpinner();

    //0.5) update results view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //1) load recipe
    await model.loadRecipe(id);

    //2) rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    //shows the error that grabbed by model.js
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load search results
    await model.laodSearchResults(query);

    //3) rednder results
    resultsView.render(model.getSearchResultsPage());

    //4) render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) rednder NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) render the NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings(in state)
  model.updateServings(newServings);

  //update the view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBoomark = function () {
  //1)) add ore remove bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  //2) update recpe view
  recipeView.update(model.state.recipe);

  //3) render bookamrks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    //console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    // display succes message
    addRecipeView.renderMessage();

    //render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in hte url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // check  and check history api

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAl_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message); // nadw pws to error
  }
};

const init = function () {
  //controlrecipes will be the handler function that the eventlistener needs
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBoomark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};
init();
