export class Employee {
    constructor(obj) {

        this.name = obj.name;
        this.id = obj.id;
        this.managerId = obj.managerId;
        this.manager = null;
        this.subordinates = []; 
        this.status = null; 
    }

}

export function getEmployeeIndex(json){
    const employeeIndex = {};
    const ceoList = [];
    const errorList = []; 
    
    //Index everyone
    for (let obj of json) {
        let emp = new Employee(obj);
    
        if (emp.managerId === null) {
            ceoList.push(emp);
        }

        if (!emp.id){
            emp.status = "No ID"; 
        }

        if (!emp.name){
            emp.status = "No Name"; 
        }

        if (!emp.status) {

            if (employeeIndex[emp.id]){
                let otherEmp = employeeIndex[emp.id];
                employeeIndex[emp.id].conflicted=true; 
                emp.status =`Non-unique id ${emp.id}`; 
                errorList.push(emp); 
            }
            else {
                employeeIndex[emp.id] = emp; 
            }
        }


        else {
            errorList.push(emp);
        }
    
    }

    //Remove conflicted employees from the index 
    for (let value of Object.entries(employeeIndex)) {
        let emp = value[1]; 
        if (emp.conflicted) {
            delete employeeIndex[emp.id];
            emp.status =`Non-unique id ${emp.id}`; 
            errorList.push(emp);
        }
    }

    for (let value of Object.entries(employeeIndex)) {
    
        let emp = value[1];
        let manId = emp.managerId;
        if (manId) {
            let manager = employeeIndex[manId];

            if (manager) {
                manager.subordinates.push(emp); 
                emp.manager = manager; 
            }
            else {
                emp.status = `Manager (${emp.managerId}) doesn't exist`; 
                errorList.push(emp);
            }
        }    
    }
    
    return {
        employeeIndex: employeeIndex, 
        ceoList: ceoList, 
        errorList: errorList
    }; 
}



