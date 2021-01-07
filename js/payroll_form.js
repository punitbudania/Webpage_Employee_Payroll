let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (Event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function() {
        if(name.value.length == 0)
        {
            textError.textContent = "";
            //setTextValue('.text-error', "");
            return;
        }
        try 
        {
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
            //setTextValue('.text-error', "");
        } 
        catch (error)
        {
            //setTextValue('.text-error', error);
            textError.textContent = error;    
        }
    });

    const date = document.querySelector('#date');
    const dateError = document.querySelector('.date-error');
    date.addEventListener('input', function() {
        let startDate = getInputValueById('#day') + " " + getInputValueById('#month') 
                            + " " + getInputValueById('#year');
        try 
        {
            (new EmployeePayrollData()).startDate = new Date(Date.parse(startDate));
            dateError.textContent = "";
        } 
        catch (error) 
        {
            dateError.textContent = error;   
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });

    checkForUpdate();
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

// const save = () => {
//     try 
//     {
//         let employeePayrollData = createEmployeePayrollData();
//         createAndUpdateStorage(employeePayrollData);    
//     }
//     catch (error) { return;}
// }

const save = (Event) => {
    Event.preventDefault();
    Event.stopPropagation();
    try 
    {
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);    
    } 
    catch (error) { return; }
}

const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');    
    employeePayrollObj._note = getInputValueById('#notes');    
    let date = getInputValueById('#day') + " " + getInputValueById('#month') 
                + " " + getInputValueById('#year');
    employeePayrollObj._startDate = date;
}

function createAndUpdateStorage(employeePayrollData)
{
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList)
    {
        let empPayrollData = employeePayrollList.find(empData => empData._id == employeePayrollObj._id);
        if(!empPayrollData) { employeePayrollList.push(employeePayrollData); }
        else
        {
            const index = employeePayrollList
                            .map(empData => empData._id)
                            .indexOf(empPayrollData._id);
            employeePayrollList.splice(index, 1, createEmployeePayrollData(empPayrollData._id));
        }    
    }
    else
    {
        employeePayrollList = [employeePayrollData]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if(!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const setEmployeePayrollData = (employeePayrollData) => {
    const textError = document.querySelector('.text-error');
    const dateError = document.querySelector('.date-error');
    try {
        employeePayrollData.name = employeePayrollObj._name;
    } catch (error) {
        textError.textContent = error;
        throw error;    
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try {
        employeePayrollData.startDate = new Date(Date.parse(employeePayrollObj._startDate));
    } catch (error) {
        dateError.textContent = error;   
        throw error;
    }
    alert(employeePayrollData.toString());
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

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allitems = document.querySelectorAll(propertyValue);
    allitems.forEach(item => {
        if(Array.isArray(value))
        {
            if(value.includes(item.value))
            {
                item.checked = true;
            }
        }
        else if (item.value == value)
        {
            item.checked = true;
        }
    });
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
        let now = new Date();
        if(new Date(startDate) > now) throw 'Future Date not allowed!!';
        var diff = Math.abs(now.getTime() - (new Date(startDate)).getTime());
        if (diff / (1000 * 60 * 60 * 24) > 30) throw 'Start date is beyond 30 days!';
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