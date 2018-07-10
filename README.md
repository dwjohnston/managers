
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

[Deployed demo here](https://dwjohnston.github.io/managers/index.html).

## Instructions

Start dev server with
```
npm i && npm start
```

Run tests with 

```
npm run test
```

## Overview. 

I chose a JSON array as the data format for the original data. 

The original data would be: 

```
 [{ name: "Alan", id: 100, managerId: 150 },
  { name: "Martin", id: 220, managerId: 100 },
  { name: "Jamie", id: 150, managerId: null },
  { name: "Alex", id: 275, managerId: 100 },
  { name: "Steve", id: 400, managerId: 150 },
  { name: "David", id: 190, managerId: 400 }]
```

The application is otherwise a reactjs browser app for importing and displaying the data. 

For convienience I created a `EvalTextArea` react component to import the raw json data as from a string. 

## Model 

### Employee

A plain data containing object to represent all employees.

**Constructor** 
- `Employee(obj)` - Create an employee from JSON.  

**Fields** 
 
- `name`- name of the employee
- `id` - unique id for the employee
- `managerId` - id of the employee's manager. If null, the - employee is considered a CEO.
- `manager` - reference to the `Employee` object of the employees manager. 
- `subordinates` - an array of references to the employee's subordinate `Employee` references. 
- `errorStatus` - of type `EmployeeErrorStatusEnum`

### EmployeeIndex

 A data container used to index `Employee`s, and to parse the heirarchy tree for validity. 

**Fields**

- `index` - a `employeeId : Employee` mapping of Employees
- `ceoList` - An array of all employees with `managerId=null` - considered CEOs
- `errorList` - An array of all employees with some kind of invalid status. 

**Methods** 

- `addEmployee(employee)` - Add an employee to the index. At this point 
- `parseHeirarchy()` - For all given Employees on the index - create references to their manager and subordinates. 
- `populateFromJson(json)` - a conveinience method that takes a JSON list and adds all employees, and parses the heirarchy. 

### EmployeeErrorStatusEnum
 A enum representing the valid (0) or invalid states an employee can have. Those states are: 
```
    OK: 0,
    NO_ID: 1,
    NO_NAME: 2,
    CONFLICTED: 3,
    MANAGER_DOES_NOT_EXIST: 4,
    CIRCULAR: 5,
```




## The main algorithm. 

The approach to the algorithm is: 

0. If the json is invalid an error is thrown. 
1. Parse each item into an `Employee` object. At this stage detect no ID or no name errors. 
2. Each `Employee` is added to the `Employee` index - indexed by their ID. If the employee is invalid at this stage, it is added to the `errorList`. Employees sharing an employee ID are detected at this stage and added to the errorList. 
3. Once all employees have been added, we run the `parseHeirarchy()` method. 

    i.  For each employee, find their manager by referencing the employee index. Add the manager to the employee's `manager` reference, and add the employee to the the manager's `subordinates` list. If the manager doesn't exist, the employee is removed and added to the errorList. 
  
    ii. After all employees managers and subordinates have been referenced, we check for circular heirarchies by following the management references and keeping track of which employeeIds we've already seen. 

  ### Performance 

The algorithm has O(n) performance. The worst case scenario (all employees are part of a circularly heirarchy) will still scale linearly with additional employees.  

The algorithm doesn't lend itself to efficient dynamic adding adding of employees. It is suited for a single load of employees. For adding additional employees - the `parseHeirarchy()` method would need to be rerun accross all employees for each batch of new employees. 


