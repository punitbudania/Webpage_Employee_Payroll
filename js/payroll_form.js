window.addEventListener('DOMContentLoaded', (Event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function() {
        if(name.value.length == 0)
        {
            textError.textContent = "";
            return;
        }
        try 
        {
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        } 
        catch (error)
        {
            textError.textContent = error;    
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });
});

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setValue('#day', '1');
    setValue('#month', 'January');
    setValue('#year', '2020');
}

const unsetSelectedValues = (propertyValue) => {
    let allitems = document.querySelectorAll(propertyValue);
    allitems.forEach(item => {
        item.checked = false;
    });
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const save = () => {
    try 
    {
        let employeePayrollData = createEmployeePayrollData();
        createAndUpdateStorage(employeePayrollData);    
    }
    catch (error) { return;}
}

function createAndUpdateStorage(employeePayrollData)
{
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList != undefined)
    {
        employeePayrollList.push(employeePayrollData);
    }
    else
    {
        employeePayrollList = [employeePayrollData]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = () => {
    let employeePayrollData = new EmployeePayrollData();
    try
    {
        employeePayrollData.name = getInputValueById('#name');    
    } 
    catch (error)
    {
        setTextValue('.text-error', error);    
    }
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById('#salary');    
    employeePayrollData.note = getInputValueById('#notes');    
    let date = getInputValueById('#day') + " " + getInputValueById('#month') 
                + " " + getInputValueById('#year');
    employeePayrollData.startDate = date;
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const getSelectedValues = (propertyValue) => {
    let allitems = document.querySelectorAll(propertyValue);
    let selitems = [];
    allitems.forEach(item => {
        if(item.checked) selitems.push(item.value);
    });
    return selitems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

class EmployeePayrollData 
{
    get id() { return this._id; }
    set id(id) { this._id = id; }

    get name() { return this._name; }
    set name(name) 
    {
        let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$')
        if(nameRegex.test(name))
        {
            this._name = name;    
        }
        else throw 'Incorrect Name !!';
    }

    get profilePic() { return this._profilePic; }
    set profilePic(profilePic) { this._profilePic = profilePic; }

    get gender() { return this._gender; }
    set gender(gender) { this._gender = gender; }

    get department() { return this._department; }
    set department(department) { this._department = department; }

    get salary() { return this._salary; }
    set salary(salary) { this._salary = salary; }

    get note() { return this._note; }
    set note(note) { this._note = note; }

    get startDate() { return this._startDate; }
    set startDate(startDate) 
    {
        this._startDate = startDate;
    }

    toString()
    {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return "id=" + this.id + ", name=" + this.name + ", gender=" + this.gender + 
                ", profilePic=" + this.profilePic + ", department=" + this.department +
                ", salary=" + this.salary +", startDate=" + this.startDate + ", note=" + this.note; 
    }
}