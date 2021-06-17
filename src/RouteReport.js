import DatePicker from "react-datepicker";
import Select from "react-select";
import MapContainer from "./Map";
import { Component } from "react";

import "react-datepicker/dist/react-datepicker.css";

export class RouteReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVehicle: null,
      vehicles: [],
      fromDate: null,
      tillDate: null,
      polyline: null,
      showMap: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (selectedVehicle) => {
    this.setState({
      selectedVehicle: selectedVehicle || [],
    });
  };

  componentDidMount() {
    fetch(
      `https://mapon.com/api/v1/unit/list.json?key=${process.env.REACT_APP_MAPON_API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          vehicles: response.data.units.map((i) => ({
            label: i.number,
            value: i.unit_id,
          })),
        });
      });
  }

  handleSubmit(event) {
    const fromDate = this.state.fromDate.toISOString().split(".")[0] + "Z";
    const tillDate = this.state.tillDate.toISOString().split(".")[0] + "Z";

    fetch(
      `https://mapon.com/api/v1/route/list.json?key=${process.env.REACT_APP_MAPON_API_KEY}&from=${fromDate}&till=${tillDate}&unit_id=${this.state.selectedVehicle.value}&include=polyline`
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          polyline: response.data.units[0].routes[1].polyline,
          showMap: true,
        });
      });
    event.preventDefault();
  }

  setFromDate(date) {
    this.setState({
      fromDate: date,
    });
  }

  setTillDate(date) {
    this.setState({
      tillDate: date,
    });
  }

  render() {
    return (
      <div className="report-card">
        <div className="report-body">
          <h1>Route report</h1>
          <div className="vehicle-number-input">
            <label htmlFor="vehicleNumber" className="required">
              Vehicle number
            </label>
            <Select
              value={this.state.selectedVehicle}
              onChange={this.onChange}
              placeholder={"Select vehicle"}
              options={this.state.vehicles}
              className="vehicle-number"
              id="vehicleNumber"
            />
          </div>

          <div className="period">
            <label>Period</label>
            <div className="period-inputs">
              <div className="period-datepicker">
                <label htmlFor="fromDate">From</label>
                <DatePicker
                  selected={this.state.fromDate}
                  onChange={(date) => this.setFromDate(date)}
                  dateFormat="dd.MM.yyyy"
                  id="fromDate"
                />
              </div>
              <div className="period-datepicker">
                <label htmlFor="tillDate">To</label>
                <DatePicker
                  selected={this.state.tillDate}
                  onChange={(date) => this.setTillDate(date)}
                  dateFormat="dd.MM.yyyy"
                  id="tillDate"
                />
              </div>
            </div>
          </div>
        </div>
        <MapContainer
          polyline={this.state.polyline}
          available={this.state.showMap}
        />
        <div className="report-action">
          <input
            type="button"
            className="generate-btn"
            value="Generate"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}
