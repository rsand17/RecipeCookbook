import React, { Component } from "react";
import {
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem
} from "@material-ui/core";
import { DateFormatInput } from "material-ui-next-pickers";
import IngredientsAutocomplete from "../IngredientsAutocomplete/IngredientsAutocomplete";
import { connect } from "react-redux";
import "./mainPantry.css";
import Axios from "axios";

class AddItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
      date: new Date(),
      amt: "",
      amtUnit: "choose",
      date2:'none',
    };
  }

  changeDate = date => {
    let date2=''+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
    this.setState({ date:date, date2:date2 });
    // console.log(date2)
  };

  handleChange = event => {
    this.setState({ amt: event.target.value });
  };

  handleSubmit = () => {
    //todo: fix this when routes are in place
    let that = this;
    Axios.post("http://localhost:8080/freshness", {
      user: that.props.auth,
      item: that.state.item,
      date: that.state.date2
    }).then(response => {
      that.props.closeModal();
    });
  };

  render() {
    return (
      <Modal open={this.props.modal} onClose={this.props.closeModal}>
        <Paper
          style={{
            position: "absolute",
            top: "30%",
            left: "25%",
            width: "50%",
            padding: "30px"
          }}
        >
          <Typography variant="h5">Add item to pantry</Typography>
          <div style={{ paddingLeft: "10px" }}>
            <TextField onChange={this.handleChange} label="Amount" />
            &nbsp;
            <Select
              value={this.state.amtUnit}
              onChange={event => this.setState({ amtUnit: event.target.value })}
              style={{ paddingTop: "16px" }}
            >
              <MenuItem value="choose">Choose Unit</MenuItem>
              <MenuItem value="teaspoon">Teaspoon(s)</MenuItem>
              <MenuItem value="tablespoon">Tablespoon(s)</MenuItem>
              <MenuItem value="fluid ounce">Fluid Ounce(s)</MenuItem>
              <MenuItem value="cup">Cup(s)</MenuItem>
              <MenuItem value="pint">Pint(s)</MenuItem>
              <MenuItem value="quart">Quart(s)</MenuItem>
              <MenuItem value="gallon">Gallon(s)</MenuItem>
              <MenuItem value="milliliter">Milliliter(s)</MenuItem>
              <MenuItem value="liter">Liter(s)</MenuItem>
              <MenuItem value="pound">Pound(s)</MenuItem>
              <MenuItem value="ounce">Ounce(s)</MenuItem>
              <MenuItem value="milligram">Milligram(s)</MenuItem>
              <MenuItem value="gram">Gram(s)</MenuItem>
              <MenuItem value="kilogram">Kilogram(s)</MenuItem>
            </Select>
          </div>
          <IngredientsAutocomplete
            label={"Item"}
            onChange={item => {
              this.setState({
                item
              });
            }}
          />
          <div style={{ paddingLeft: "10px" }}>
            <DateFormatInput
              value={this.state.date}
              onChange={this.changeDate}
            />
            Optional
          </div>
          <br />
          <div>
            <Button onClick={this.handleSubmit}>Submit</Button>
            <Button onClick={this.props.closeModal}>Close</Button>
          </div>
        </Paper>
      </Modal>
    );
  }
}
// export default AddItemModal;
function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(AddItemModal);
