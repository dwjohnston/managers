import React, { Component } from 'react';
import EvalTextArea from './EvalTextArea/EvalTextArea';
import './App.css';
import {EmployeeIndex} from "./model/EmployeeIndex";
import {EmployeeErrorStatusEnum} from "./model/Employee"

const statusSwitch = (emp) => {
  switch (emp.errorStatus) {
    case EmployeeErrorStatusEnum.OK: return "Ok"; 
    case EmployeeErrorStatusEnum.CONFLICTED: return `Non-unique ID ${emp.id}`;  
    case EmployeeErrorStatusEnum.CIRCULAR: return `Circular management heirarchy. (Manager id = ${emp.managerId})`; 
    case EmployeeErrorStatusEnum.NO_ID: return "No id."; 
    case EmployeeErrorStatusEnum.NO_NAME: return "No name."
    case EmployeeErrorStatusEnum.MANAGER_DOES_NOT_EXIST: return `Manager with id ${emp.managerId} does not exist`;
  }
}

const EmployeeRender = ({ employee, children }) => {
  return (<div className="employee">
    <p className="employee-name"> {`${employee.name} (${employee.id})`}</p>

    {employee.errorStatus>0 && <p>{statusSwitch(employee)}</p>}

    {children}
  </div>);
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      employeeData: null
    };
  }

  getData = (data) => {

    const employeeIndex = new EmployeeIndex();
    employeeIndex.populateFromJson(data);
    
    
    this.setState({
      employeeData: employeeIndex.getData()
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
