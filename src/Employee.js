import {EmployeeErrorStatusEnum} from "./model/Employee"
import React, { Component } from 'react';

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

export const EmployeeRender = ({ employee, children }) => {
  return (<div className="employee">
    <p className="employee-name"> {`${employee.name} (${employee.id})`}</p>

    {employee.errorStatus>0 && <p>{statusSwitch(employee)}</p>}

    {children}
  </div>);
}
