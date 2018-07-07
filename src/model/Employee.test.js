import {parseEmployeeJson, Employee, EmployeeIndex, EmployeeErrorStatusEnum} from "./Employee"; 

describe("Employee constructor", () => {
    it("gives errorStatus on no ID", () => {
        let json = {
            name: "foo", 
            managerId: 1
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.NO_ID);
    })

    it("id 0 is ok", () => {
        let json = {
            name: "foo", 
            managerId: 1, 
            id: 0, 
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.OK);
    })

    it("gives errorStatus on no name", () => {
        let json = {
            id: 11, 
            managerId: 1
        }

        let emp = new Employee(json); 
        expect(emp.errorStatus).toBe(EmployeeErrorStatusEnum.NO_NAME);
    });
   
});


describe ("EmployeeIndex", () => {

  
    describe("addEmployee(employee", () => {
        it ("adds valid employees to the index", () =>{
            let employeeIndex = new EmployeeIndex(); 
            let employee = new Employee({
                name: "foo", 
                id: 123, 
                managerId: 111
            }); 

            employeeIndex.addEmployee(employee); 

            expect(employeeIndex.index[123]).toBeDefined(); 

        }); 

        it ("adds employees with no manager ID to the index, and to the CEO list", () =>{
            let employeeIndex = new EmployeeIndex(); 
            let employee = new Employee({
                name: "foo", 
                id: 123, 
                managerId: null
            }); 

            employeeIndex.addEmployee(employee); 

            expect(employeeIndex.index[123]).toBeDefined(); 
            expect(employeeIndex.ceoList.length).toBe(1); 
        }); 

        it ("adds invalid employees to errorList", () => {
            let employeeIndex = new EmployeeIndex(); 
            let employee = new Employee({}); //Invalid employee; 

            employeeIndex.addEmployee(employee); 
            expect(employeeIndex.errorList.length).toBe(1);
        });

        describe("when: an employee with an existing ID is attempted to be added", () => {
            it ("removes existing employee, adds index to conflictedIndices, sets errorStatus of both to conflicted, and adds them to the errorList", () => {
                let employeeIndex = new EmployeeIndex(); 
                let employeeA = new Employee( {
                    name: "foo", 
                    id: 1, 
                    managerId: 2
                }); 

                employeeIndex.addEmployee(employeeA); 

                let employeeB = new Employee({
                    name: "bar", 
                    id: 1, 
                    managerId: 2
                });

                employeeIndex.addEmployee(employeeB);
                
                expect(employeeIndex.index[1]).not.toBeDefined();
                expect(employeeIndex.errorList.length).toBe(2); 
                expect(employeeA.errorStatus).toBe(EmployeeErrorStatusEnum.CONFLICTED);
                expect(employeeB.errorStatus).toBe(EmployeeErrorStatusEnum.CONFLICTED);
                expect(employeeIndex.conflictedIndices.size).toBe(1);
            }); 

            it ("as above, but for adding a third conflicted employee ", () => {
                let employeeIndex = new EmployeeIndex(); 
                let employeeA = new Employee( {
                    name: "foo", 
                    id: 1, 
                    managerId: 2
                }); 

                employeeIndex.addEmployee(employeeA); 

                let employeeB = new Employee({
                    name: "bar", 
                    id: 1, 
                    managerId: 2
                });

                let employeeC = new Employee({
                    name: "bar", 
                    id: 1, 
                    managerId: 2
                });

                employeeIndex.addEmployee(employeeB);
                employeeIndex.addEmployee(employeeC);

                
                expect(employeeIndex.index[1]).not.toBeDefined();
                expect(employeeIndex.errorList.length).toBe(3); 
                expect(employeeA.errorStatus).toBe(EmployeeErrorStatusEnum.CONFLICTED);
                expect(employeeB.errorStatus).toBe(EmployeeErrorStatusEnum.CONFLICTED);
                expect(employeeC.errorStatus).toBe(EmployeeErrorStatusEnum.CONFLICTED);
                expect(employeeIndex.conflictedIndices.size).toBe(1);
            }); 
        }); 
    }); 


    describe ("parseHierarchy()", () => {
        describe("when: A standard boss and their employee scenario ", () => {

            it("boss has subordinate list of 1, employee has manager", () => {
                let employeeIndex =  new EmployeeIndex(); 
                let boss = new Employee({
                    name: "foo", 
                    id: 1, 
                    managerId: null
                }); 
                let employee = new Employee({
                    name: "bar", 
                    id: 2, 
                    managerId:1
                }); 

                employeeIndex.addEmployee(boss); 
                employeeIndex.addEmployee(employee); 

                employeeIndex.parseHierarchy(); 

                expect(boss.subordinates.length).toBe(1); 
                expect(boss.manager).toBeNull();
                expect(employee.manager).toBe(boss); 
                expect(employee.subordinates.length).toBe(0);
            }); 

            

        }); 

        describe("when: A boss's boss, a boss and their employee scenario ", () => {

            it("boss has subordinate list of 1, employee has manager", () => {
                let employeeIndex =  new EmployeeIndex(); 
                let boss = new Employee({
                    name: "foo", 
                    id: 1, 
                    managerId: 0
                }); 

                let bossesBoss = new Employee({
                    name: "zero", 
                    id: 0, 
                    managerId: null
                }); 
                let employee = new Employee({
                    name: "bar", 
                    id: 2, 
                    managerId:1
                }); 

                employeeIndex.addEmployee(bossesBoss); 
                employeeIndex.addEmployee(boss); 
                employeeIndex.addEmployee(employee); 

                employeeIndex.parseHierarchy(); 

                expect(bossesBoss.subordinates.length).toBe(1); 
                expect(bossesBoss.manager).toBeNull(); 

                expect(boss.subordinates.length).toBe(1); 
                expect(boss.manager).toBe(bossesBoss);

                expect(employee.manager).toBe(boss); 
                expect(employee.subordinates.length).toBe(0);
            }); 

            

        }); 


        describe("a circular heirarchy (A is the boss of B, B is the boss of A", () => {
            it ("both employees have errorStatus CIRCULAR", () => {
                let employeeIndex = new EmployeeIndex();
                let empA = new Employee({
                    id: 0, 
                    name: "foo", 
                    managerId: 1
                }); 

                let empB = new Employee({
                    id: 1, 
                    name: "bar", 
                    managerId: 0
                }); 

                employeeIndex.addEmployee(empA);
                employeeIndex.addEmployee(empB);

                employeeIndex.parseHierarchy();
                
                expect(employeeIndex.index[0]).not.toBeDefined(); 
                expect(employeeIndex.index[1]).not.toBeDefined();

                expect(empA.errorStatus).toBe(EmployeeErrorStatusEnum.CIRCULAR);
                expect(empB.errorStatus).toBe(EmployeeErrorStatusEnum.CIRCULAR);
                expect(employeeIndex.errorList.length).toBe(2);
            }); 
        }); 

        describe("a circular heirarchy (A is the boss of B, B is the boss of C, C is the boss of A, D -> E is OK", () => {
            it ("both employees have errorStatus CIRCULAR", () => {
                let employeeIndex = new EmployeeIndex();
                let empA = new Employee({
                    id: 0, 
                    name: "a", 
                    managerId: 2
                }); 

                let empB = new Employee({
                    id: 1, 
                    name: "b", 
                    managerId: 0
                }); 


                let empC = new Employee({
                    id: 2, 
                    name: "c", 
                    managerId: 1
                }); 


                let empD = new Employee({
                    id: 3, 
                    name: "d", 
                    managerId: null
                }); 


                let empE = new Employee({
                    id: 4, 
                    name: "e", 
                    managerId: 3
                }); 

                employeeIndex.addEmployee(empA);
                employeeIndex.addEmployee(empB);
                employeeIndex.addEmployee(empC);
                employeeIndex.addEmployee(empD);
                employeeIndex.addEmployee(empE);

                employeeIndex.parseHierarchy();
                
                expect(employeeIndex.index[0]).not.toBeDefined(); 
                expect(employeeIndex.index[1]).not.toBeDefined();
                expect(employeeIndex.index[2]).not.toBeDefined();
                expect(employeeIndex.index[3]).toBeDefined();
                expect(employeeIndex.index[4]).toBeDefined();

                expect(empA.errorStatus).toBe(EmployeeErrorStatusEnum.CIRCULAR);
                expect(empB.errorStatus).toBe(EmployeeErrorStatusEnum.CIRCULAR);
                expect(empC.errorStatus).toBe(EmployeeErrorStatusEnum.CIRCULAR);
                expect(empD.errorStatus).toBe(EmployeeErrorStatusEnum.OK);
                expect(empE.errorStatus).toBe(EmployeeErrorStatusEnum.OK);

                expect(employeeIndex.errorList.length).toBe(3);
            }); 
        }); 


        describe("Bob has a manager who does not exist", () => {
            it ("Bob get errorStatus MANAGER_DOES_NOT_EXIST", () => {
                let employeeIndex = new EmployeeIndex(); 
                let employee = new Employee({
                    name:"bob", 
                    id: 0, 
                    managerId: 111
                });

                employeeIndex.addEmployee(employee); 
                employeeIndex.parseHierarchy(); 

                expect(employeeIndex[0]).not.toBeDefined();
                expect(employee.errorStatus).toBe(EmployeeErrorStatusEnum.MANAGER_DOES_NOT_EXIST); 
                expect(employeeIndex.errorList.length).toBe(1);
            }); 
        });
    });


    describe("parseFromJson()", () => {
        
    }); 
});



