import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { SelectedEmployeeService } from '../../services/selected-employee.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  staffName;

  worktypes = ['Field', 'Shop', 'Delivery', 'PM'];
  defaultWorkType = 'Field';

  jobs;

  defaultCO = 'No';

  tasks;

  constructor(
    private _databaseService: DatabaseService,
    private _selectedEmployeeService: SelectedEmployeeService
  ) { }

  ngOnInit() {
    this.staffName = this._selectedEmployeeService.details.staffName;

    this._databaseService.jobsRef$.subscribe(res => {
      this.jobs = res.sort(this.compare);
    });

    this._databaseService.tasksRef$.subscribe(res => {
      this.tasks = res.sort(this.compare);
    });
  }

  compare(a, b) {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  }

  log(x) {
    console.log(x);
  }

  onSubmit(f) {
    console.log(f);
    this._selectedEmployeeService.details.worktype = f.value.worktype;
    this._selectedEmployeeService.details.job = f.value.job.value;
    this._selectedEmployeeService.details.jobId = f.value.job.key;
    this._selectedEmployeeService.details.co = f.value.co;
    if (f.value.customTask) {
      this._selectedEmployeeService.details.task = f.value.customTask;
      this._selectedEmployeeService.details.taskId = 'custom task';
    } else {
      this._selectedEmployeeService.details.task = f.value.task.value;
      this._selectedEmployeeService.details.taskId = f.value.task.key;
    }
    console.log(this._selectedEmployeeService.details);
  }

}
