import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  DatabaseService
} from '../../services/database.service';
import {
  SelectedEmployeeService
} from '../../services/selected-employee.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  defaultCO = 'No';
  defaultWorkType = 'Field';
  jobs;
  loaded = false;
  storedJob;
  staffName;
  tasks;
  worktypes = ['Field', 'Shop', 'Delivery', 'PM'];

  constructor(
    private _afDb: AngularFireDatabase,
    private _databaseService: DatabaseService,
    private _selectedEmployeeService: SelectedEmployeeService,
    private _router: Router
  ) {
    navigator.geolocation.getCurrentPosition((position) => {
      this._selectedEmployeeService.details.location.latitude = position.coords.latitude;
      this._selectedEmployeeService.details.location.longitude = position.coords.longitude;
    });

    // this.pre = JSON.parse(localStorage.getItem('userData'));
    // console.log(this.pre);
  }

  ngOnInit() {
    // if (!localStorage.getItem('userData')) {
    //   this._router.navigate(['/login']);
    // } else {

    // }
    this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/templog`).valueChanges().subscribe(res => {
      if (res) {
        this._router.navigate(['/']);
      }
    });


    this.staffName = this._selectedEmployeeService.details.staffName;

    this._databaseService.jobs$.subscribe(res => {
      this.jobs = res.sort(this.compare);
      this.loaded = true;
    });

    this._databaseService.tasks$.subscribe(res => {
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
  }

  onSubmit(f) {
    // this._selectedEmployeeService.details.location.latitude;
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
    localStorage.setItem('userData', JSON.stringify(this._selectedEmployeeService.details));
    this._router.navigate(['/']);
  }
}
