let Columns = [
    {
       dataField: 'name',
       text: 'Name',
       Cell: row => (
          <div>
             <span>Kishore Rajan</span>
          </div>
       ),
       sort: true
    },
    {
       dataField: 'department',
       text: 'Department',
       Cell: row => (
          <div>
             <span>Production</span>
          </div>
       ),
       sort: true
    },
    {
       dataField: 'designation',
       text: 'Designation',
       Cell: row => (
          <div>
             <span>Line Supervisor</span>
          </div>
       ),
       sort: true
    },
       {
       dataField: 'projects',
       text: 'Projects',
       Cell: row => (
          <div>
             <span>Project 1</span>
          </div>
       ),
       sort: true
    },
    {
       dataField: 'shiftname',
       text: 'Shift Name',
       Cell: row => (
          <div>
             <span>Evening</span>
          </div>
       ),
       sort: true
    },
     {
       dataField: 'shifttiming',
       text: 'Shift Timing',
       Cell: row => (
          <div>
             <span>12:00 pm - 08:00 pm</span>
          </div>
       ),
       sort: true
    },         
    {
       text: 'Action',
       sort: false,
       formatter: (row, cell) => (<div className="action-btn">
          <i className="icon-edit" onClick={() => this.editRow(this, cell)}></i>
          <i className="icon-delete" onClick={e => this.deleteRow(cell)}></i>
       </div>)
    }
];

export default Columns;