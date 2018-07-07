import React, { Component } from 'react';
import EvalTextArea from './EvalTextArea/EvalTextArea';
import './App.css';
import { getEmployeeIndex } from "./model/Employee";

const EmployeeRender = ({ employee, children }) => {
  return (<div className="employee">
    <p className="employee-name"> {`${employee.name} (${employee.id})`}</p>

    {employee.status && <p>{employee.status}</p>}

    {children}
  </div>);
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      employeeData: null,
    };
  }

  getData = (data) => {
    this.setState({
      employeeData: getEmployeeIndex(data)
    });
  }


  renderEmployeeTree = (emp) => {
    if (emp) return (
      <EmployeeRender employee={emp}>
        <div className="subordinates">
          <label>Direct Reports:</label>
          {emp.subordinates.map(e => this.renderEmployeeTree(e))}
          {emp.subordinates.length === 0 && <span>(none)</span>}
        </div>
      </EmployeeRender>
    );
  }

  renderErrorEmployees = (emps) => {
    if (emps) return <div className="error-employees">
      <h3>Error Employees </h3>
      <p> The following employees had import errors: </p>
      {emps.map((e, i) => <EmployeeRender employee={e} key={i} />)}
    </div>
  }

  render() {
    return (
      <div className="App">
        <EvalTextArea onSubmit={this.getData} />
        <div>
          <h3> Employees </h3>
          {this.state.employeeData && this.renderEmployeeTree(this.state.employeeData.ceoList[0])}  {/* or we could render multiple CEOS*/}
        </div>

        {this.state.employeeData && this.renderErrorEmployees(this.state.employeeData.errorList)}
      </div>
    );
  }
}

export default App;
