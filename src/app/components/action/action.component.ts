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
  clockedIn: boolean;

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
    private _selectedEmployeesService: SelectedEmployeeService
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('userData')) {
      this._router.navigate(['/login']);
    }

    console.log('ACTION COMPONENT INIT');

    if (this._selectedEmployeesService.details.staffName) {
      this._databaseService.currentEmployee$.subscribe(res => {
        this.currentEmployeeDb = res;
      });
    }

    this.currentEmployeeDetails = this._selectedEmployeesService.details;

    try {
      if (this.currentEmployeeDb.clockedIn) {
        if (this.currentEmployeeDb.clockedIn === true ) {
          this.clockedIn = true;
        } else {
          this.clockedIn = false;
        }
      }
    } catch (error) {
      console.log(error);
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
      this._selectedEmployeesService.clockedIn.next(true);
      this._selectedEmployeesService.details.date = this.displayDate;
      this._selectedEmployeesService.details.clockInTime = this.setClockInTime();
      localStorage.setItem('userData', JSON.stringify(this._selectedEmployeesService.details));
    } else {
      this._selectedEmployeesService.clockedIn.next(false);
      this._selectedEmployeesService.details.clockOutTime = this.setClockOutTime();
      // this._afDb.list(`/worklog/${this._selectedEmployeesService.details.job}/${this._selectedEmployeesService.details.staffName}`)
      //   .push(this._selectedEmployeesService.details);
    }
  this.clockedIn = !this.clockedIn;
  }
}
