import {parseEmployeeJson, Employee, EmployeeIndex, EmployeeErrorStatusEnum} from "./Employee"; 

describe("Employee constructor", () => {
    it("gives errorStatus NO_ID for no id", () => {
        let json = {
            name: "foo", 
            managerId: 1
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.NO_ID);
    })

    it("id 0 is OK", () => {
        let json = {
            name: "foo", 
            managerId: 1, 
            id: 0, 
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.OK);
    })

    it("strings for id gives NO_ID", () => {
        let json = {
            name: "foo", 
            managerId: 1, 
            id: "myid", 
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.NO_ID);
    })

    it("gives errorStatus NO_NAME on no name", () => {
        let json = {
            id: 11, 
            managerId: 1
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.NO_NAME);
    });
   
});

