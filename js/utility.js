const stringifyDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric'};
    const newDate = !date ? "undefined" :
                        new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
    return newDate;
}

const checkName = (name) => {
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if(!nameRegex.test(name)) throw 'Incorrect Name';
}

const checkStartDate = (startDate) => {
    let now = new Date();
    if(new Date(startDate) > now) throw 'Future Date not allowed!!';
    var diff = Math.abs(now.getTime() - (new Date(startDate)).getTime());
    if (diff / (1000 * 60 * 60 * 24) > 30) throw 'Start date is beyond 30 days!';
}