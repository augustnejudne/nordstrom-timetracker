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
import {
  AngularFireDatabase,
  snapshotChanges
} from 'angularfire2/database';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  currentEmployeeDb;
  currentEmployeeDetails;
  clockedIn = false;

  /* ============================
  ======== DATE and TIME =======
  =============================*/
  date = new Date();
  year = this.date.getFullYear().toString();
  month = (this.date.getMonth() + 1).toString();
  day = this.date.getDate().toString();
  displayDate = `${this.month}/${this.day}/${this.year}`;


  constructor(
    private _afDb: AngularFireDatabase,
    private _router: Router,
    private _databaseService: DatabaseService,
    private _selectedEmployeeService: SelectedEmployeeService,
  ) {}

  ngOnInit() {
    this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/templog`).valueChanges().subscribe(res => {
      if (res) {
        // console.log(res);
        this._selectedEmployeeService.details = res;
      }
    });
    this.currentEmployeeDetails = this._selectedEmployeeService.details;

    this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/status`).valueChanges().subscribe(res => {
      if (res) {
        // this._selectedEmployeesService.clockInOut(true);
        // console.log(res);
        if (res === 'CLOCKED IN') {
          // console.log('res is CLOCKED IN');
          this._selectedEmployeeService.clockInOut(true);
        } else {
          // console.log('res is CLOCKED OUT');
          this._selectedEmployeeService.clockInOut(false);
        }
      } else {
        this._selectedEmployeeService.clockInOut(false);
        // console.log('status DOES NOT EXIST');
      }
    });

    this._selectedEmployeeService.clockedIn().subscribe(res => this.clockedIn = res);

    // if (localStorage.getItem('clockedIn')) {
    //   this.clockedIn = JSON.parse(localStorage.getItem('clockedIn'));
    // }

    if (!localStorage.getItem('userData')) {
      this._router.navigate(['/login']);
    }

    try {
      if (!this.currentEmployeeDetails.task) {
        // console.log('no task');
        this._router.navigate(['/details']);
      }
    } catch (error) {
      // console.log(error);
      this._router.navigate(['/details']);
    }

    if (this._selectedEmployeeService.details.staffName) {
      this._databaseService.currentEmployee$.subscribe(res => {
        this.currentEmployeeDb = res;
      });
    }

  }

  setClockInTime() {
    const time = new Date();
    let hours = time.getHours();
    let hoursString: string;
    if (hours > 12) {
      hours -= 12;
    }
    if (hours < 10) {
      hoursString = '0' + hours.toString();
    } else {
      hoursString = hours.toString();
    }
    const minutes = (time.getMinutes() < 10) ? '0' + time.getMinutes().toString() : time.getMinutes().toString();
    const ampm = (time.getHours() < 12) ? 'AM' : 'PM';
    return `${hoursString}:${minutes} ${ampm}`;
  }

  setClockOutTime() {
    const time = new Date();
    let hours = time.getHours();
    let hoursString: string;
    if (hours > 12) {
      hours -= 12;
    }
    if (hours < 10) {
      hoursString = '0' + hours.toString();
    } else {
      hoursString = hours.toString();
    }
    const minutes = (time.getMinutes() < 10) ? '0' + time.getMinutes().toString() : time.getMinutes().toString();
    const ampm = (time.getHours() < 12) ? 'AM' : 'PM';
    return `${hoursString}:${minutes} ${ampm}`;
  }


  toggleAction() {
    if (!this.clockedIn) {
      this._selectedEmployeeService.details.date = this.displayDate;
      this._selectedEmployeeService.details.clockInTime = this.setClockInTime();
      localStorage.setItem('userData', JSON.stringify(this._selectedEmployeeService.details));
      this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/status`).set('CLOCKED IN');
      this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/templog`).set(this.currentEmployeeDetails);
    } else {
      this._selectedEmployeeService.details.clockOutTime = this.setClockOutTime();
      this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/status`).set('CLOCKED OUT');
      this._afDb.list(`/worklog/${this._selectedEmployeeService.details.job}/${this._selectedEmployeeService.details.staffName}/`).push(this._selectedEmployeeService.details);
      // this._afDb.object(`/employees/${this._selectedEmployeeService.details.staffId}/templog`).remove();
      // this._afDb.list(`/worklog/${this._selectedEmployeesService.details.job}/${this._selectedEmployeesService.details.staffName}`)
      //   .push(this._selectedEmployeesService.details);
    }
  this.clockedIn = !this.clockedIn;
  this._selectedEmployeeService.clockInOut(this.clockedIn);
  localStorage.setItem('clockedIn', JSON.stringify(this.clockedIn));
  }
}
