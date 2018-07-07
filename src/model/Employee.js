export class Employee {
    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.managerId = obj.managerId;
        this.manager = null;
        this.subordinates = [];
        this.errorStatus = EmployeeErrorStatusEnum.OK;


        if (typeof this.name !== 'string') {
            this.errorStatus = EmployeeErrorStatusEnum.NO_NAME;
        }
        if (typeof this.id !== 'number') {
            //We could have a 'no name, no id' case - but lets say no ID is more important
            this.errorStatus = EmployeeErrorStatusEnum.NO_ID;
        }


    }
}

export const EmployeeErrorStatusEnum = {
    OK: 0,
    NO_ID: 1,
    NO_NAME: 2,
    CONFLICTED: 3,
    MANAGER_DOES_NOT_EXIST: 4,
    CIRCULAR: 5,
}

export class EmployeeIndex {
    constructor() {
        this.index = {};
        this.ceoList = [];
        this.errorList = [];

        this.conflictedIndices = new Set();
    }

    addEmployee(employee) {


        //Employee is invalid in themselves (eg. no name)
        if (employee.errorStatus) {
            this.errorList.push(employee);
            return;
        }

        //First conflict found, just deal with the existing employee 
        if (this.index[employee.id]) {
            this.conflictedIndices.add(employee.id);
            this.index[employee.id].errorStatus = EmployeeErrorStatusEnum.CONFLICTED;
            this.errorList.push(this.index[employee.id]);
            delete this.index[employee.id];
        }
        //An existing conflict is there 
        if (this.conflictedIndices.has(employee.id)) {
            employee.errorStatus = EmployeeErrorStatusEnum.CONFLICTED;
            this.errorList.push(employee);
            return;
        }

        //All good, add to index
        this.index[employee.id] = employee;

        //Mark CEOs
        if (!employee.managerId) {
            this.ceoList.push(employee);
        }
    }

    parseHierarchy() {
        //Link managers and subordinates
        for (let value of Object.entries(this.index)) {

            let emp = value[1];
            let manId = emp.managerId;
            console.log(emp);
            if (manId !== null) {
                let manager = this.index[manId];

                if (manager) {
                    manager.subordinates.push(emp);
                    emp.manager = manager;
                }
                else {
                    emp.errorStatus = EmployeeErrorStatusEnum.MANAGER_DOES_NOT_EXIST;
                    this.errorList.push(emp);
                    delete this.index[emp.id];
                }
            }
        }

        //now check for circular heirarchies 
        let circularEmployeesToRemove = new Set();
        for (let value of Object.entries(this.index)) {

            let emp = value[1];

            let seenManagerIds = new Set();
            while (emp.manager !== null) {
                emp = emp.manager;
                if (seenManagerIds.has(emp.id)) {
                    seenManagerIds.forEach(v => {
                        circularEmployeesToRemove.add(v);
                    });
                    break;
                }
                else {
                    seenManagerIds.add(emp.id);
                }
            }

        }

        circularEmployeesToRemove.forEach(v => {

            let emp = this.index[v];
            emp.errorStatus = EmployeeErrorStatusEnum.CIRCULAR;
            this.errorList.push(emp);
            delete this.index[v];
        });
    }


    populateFromJson(json) {

        for (let obj of json) {
            let emp = new Employee(obj);
            this.addEmployee(emp);
        }

        this.parseHierarchy();

    }
}
