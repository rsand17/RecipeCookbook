import React, { Component } from "react";
import {Button, Grid} from "@material-ui/core";
import SavedSearch from "./SavedSearch";
import RecipeTiles from "./RecipeTiles";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./mainSave.css";
import Axios from "axios";
import RecipeModal from "../RecipeModal/RecipeModal";
import BodyContainer from "../BodyContainer/BodyContainer";
import filter from "fuzzaldrin";
import { connect } from "react-redux";
import EditRecipeModal from "../EditRecipeModal/EditRecipeModal";

class mainSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownCards: [],
      allCards: [],
      id: null,
      names: [],
      info: [],
      displayingEditModal: false
    };
  }

  openRecipe = id => {
    this.setState({ id: id });
  };

  onClose = () => {
    this.setState({ id: null });
  };

  componentDidMount = () => {
    if (this.state.auth)
      this.updateList();
    else
      setTimeout(() => {
        this.updateList();
      }, 10);
  };

  updateList = () => {
    let that = this;

    Axios.get("http://localhost:8080/savedRecipes", {
      headers: { googleId: that.props.auth }
    }).then(function(response) {
      let tempCard = [];
      let tempName = [];
      if (response.data.length===0) {
        tempCard.push(<h3 style={{margin:'auto',paddingTop:'5vh'}} key={1}>Save some recipes to see them here!</h3>);
        that.setState({
          allCards: tempCard,
          shownCards: tempCard,
          names: tempName
        });
      } else {
        for (let i in response.data[0].recipes) {
          tempCard.push(
            <Grid item xs={3} key={i}>
              <RecipeCard
                title={response.data[0].recipes[i].title}
                image={response.data[0].recipes[i].image}
                id={response.data[0].recipes[i].id}
                onClick={() => that.openRecipe(response.data[0].recipes[i].id)}
              />
            </Grid>
          );
          tempName.push({ name: response.data[0].recipes[i].title, id: i });
        }
        that.setState({
          allCards: tempCard,
          shownCards: tempCard,
          names: tempName,
          info: response.data[0].recipes
        });
      }
    });
  };

  searchSaved = searchKey => {
    let matched = filter(this.state.names, searchKey, { key: "name" });
    let tempCard = [];
    for (let i in matched) {
      tempCard.push(this.state.allCards[matched[i].id]);
    }
    this.setState({ shownCards: tempCard });
  };

  onEditClose = () => {
    this.setState({
      displayingEditModal: false
    });
  };

  onSaveNew = () => {
    this.setState({
      displayingEditModal: false,
    });

    this.updateList();
  };

  render() {
    return (
      <div className="BigDivArea">
        <BodyContainer>
          <div className="save-search-bar">
            <SavedSearch {...this.state} searchSaved={this.searchSaved} />
          </div>

          <div id={'save-toolbar'}>
            <Button
              variant="contained"
              color={"primary"}
              onClick={() => {
                this.setState({
                  displayingEditModal: true
                });
              }}
            >
              Add Custom
            </Button>
          </div>

          <Grid id={"search-results"} container spacing={24}>
            {this.state.shownCards}
          </Grid>

          <RecipeModal
            {...this.state}
            onClose={this.onClose}
            type="saved"
            updateSavedList={this.updateList}
          />

          <EditRecipeModal
            recipe={this.state.displayingEditModal ? {
              extendedIngredients: [],
              analyzedInstructions: [{
                steps: []
              }],
              image: null,
              title: ""
            } : null}
            onClose={this.onEditClose}
            onSave={this.onSaveNew}
          />
        </BodyContainer>
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainSave);
