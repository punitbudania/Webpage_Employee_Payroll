window.addEventListener('DOMContentLoaded', (Event) =>{
    createInnerHtml();
});

const createInnerHtml = () => {
    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th>";
    const innerHtml = `${headerHtml}
    <tr>
        <td><img src="../assets/Ellipse -2.png" alt="2" class="profile"></td>
        <td>Nuke</td>
        <td>Male</td>
        <td>
            <div class="dept-label">HR</div>
            <div class="dept-label">Finance</div>
        </td>
        <td>409000</td>
        <td>1 Nov 2020</td>
        <td>
            <img id="1" onclick="remove(this)" src="../assets/delete-black-18dp.svg" alt="delete">
            <img id="1" onclick="update(this)" src="../assets/create-black-18dp.svg" alt="create">
        </td>
    </tr>`;
    document.querySelector('#table-display').innerHTML = innerHtml;
}