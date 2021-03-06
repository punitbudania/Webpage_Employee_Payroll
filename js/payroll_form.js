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
            checkName(name.value);
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
            checkStartDate(new Date(Date.parse(startDate)));
            //new Date(Date.parse(startDate));
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
    //Event.preventDefault();
    //Event.stopPropagation();
    try 
    {
        setEmployeePayrollObject();
        if(site_properties.use_local_storage.match("true"))
        {
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);    
        }
        else
        {
            createOrUpdateEmployeePayroll();
        }
        localStorage.removeItem('editEmp');
    } 
    catch (error) { return; }
}

const createOrUpdateEmployeePayroll = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate)
    {
        methodCall = "PUT";
        postURL = postURL + employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall, postURL, false, employeePayrollObj)
        .then(responseText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });
}

const setEmployeePayrollObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true"))
    {
        employeePayrollObj.id = createNewEmployeeId();
    }
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

function createAndUpdateStorage()
{
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList)
    {
        let empPayrollData = employeePayrollList.find(empData => empData.id == employeePayrollObj.id);
        if(!empPayrollData) { employeePayrollList.push(employeePayrollObj); }
        else
        {
            const index = employeePayrollList
                            .map(empData => empData.id)
                            .indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }    
    }
    else
    {
        employeePayrollList = [employeePayrollObj]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

// const createEmployeePayrollDataByID = (id) => {
//     let employeePayrollData = new EmployeePayrollData();
//     if(!id) employeePayrollData.id = createNewEmployeeId();
//     else employeePayrollData.id = id;
//     setEmployeePayrollData(employeePayrollData);
//     return employeePayrollData;
// }

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

// const setEmployeePayrollData = (employeePayrollData) => {
//     const textError = document.querySelector('.text-error');
//     const dateError = document.querySelector('.date-error');
//     try {
//         employeePayrollData.name = employeePayrollObj._name;
//     } catch (error) {
//         textError.textContent = error;
//         throw error;    
//     }
//     employeePayrollData.profilePic = employeePayrollObj._profilePic;
//     employeePayrollData.gender = employeePayrollObj._gender;
//     employeePayrollData.department = employeePayrollObj._department;
//     employeePayrollData.salary = employeePayrollObj._salary;
//     employeePayrollData.note = employeePayrollObj._note;
//     try {
//         employeePayrollData.startDate = new Date(Date.parse(employeePayrollObj._startDate));
//     } catch (error) {
//         dateError.textContent = error;   
//         throw error;
//     }
//     alert(employeePayrollData.toString());
// }

const createEmployeePayrollData = () => {
    let employeePayrollData = new EmployeePayrollData();
    const textError = document.querySelector('.text-error');
    try
    {
        employeePayrollData.name = getInputValueById('#name');    
    } 
    catch (error)
    {
        //setTextValue('.text-error', error);    
        textError.textContent = error;
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
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
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