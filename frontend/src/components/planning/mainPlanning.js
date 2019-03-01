import React, { Component } from "react";
import { connect } from 'react-redux';
import Calendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import RecipeModal from "../RecipeModal/RecipeModal";
import moment from "moment";
import "./mainPlanning.css";
import Axios from "axios";

const localizer = Calendar.momentLocalizer(moment);
//Fix this when route is implemented
class mainPlanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          start: new Date(),
          end: new Date(),
          title: "Chipotle Tomato Pepper Cheeseburger",
          id: 553935
        }
      ],
      id: null,
      date: null,
      meal: null
    };
  }

  onClose = () => {
    this.setState({ id: null });
  };

  click = event => {
    // console.log(event);
    this.setState({ id: event.id, date: event.date, meal: event.meal });
    console.log(this.state);
  };

  componentDidMount = () => {
    let that = this;
    Axios.get("http://localhost:8080/meal/month", {
      headers: {
        googleId: that.props.auth,
        udate: `${new Date().getMonth() + 1}/1/${new Date().getFullYear()}`
      }
    }).then(response => {
      console.log(response.data);
      that.setState({ events: response.data });
    });
  };

  changeMonth = event1 => {
    let that = this;
    Axios.get("http://localhost:8080/meal/month", {
      headers: {
        googleId: that.props.auth,
        date: `${event1.getMonth() + 1}/1/${event1.getFullYear()}`
      }
    }).then(response => {
      that.setState({ events: response.data });
    });
  };

  render() {
    return (
      <div className="BigDivArea">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "calc(100vh - 48px)" }}
          onSelectEvent={this.click}
          resizable
          views={{ month: true }}
          // onRangeChange={this.changeMonth}
          onNavigate={this.changeMonth}
        />
        <RecipeModal
          {...this.state}
          onClose={this.onClose}
          type="Planning"
          updateSavedList={this.updateList}
        />
      </div>
    );
  }
}

function mapStatesToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStatesToProps)(mainPlanning);
