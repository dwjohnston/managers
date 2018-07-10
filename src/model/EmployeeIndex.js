import {Employee, EmployeeErrorStatusEnum} from "./Employee"; 

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

                if (circularEmployeesToRemove.has(emp.id)){
                    break; //We've already scanned this circular loop. 
                }

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

    getData() {
        return {
            ceoList: this.ceoList, 
            index: this.index, 
            errorList: this.errorList
        }
    }
}
