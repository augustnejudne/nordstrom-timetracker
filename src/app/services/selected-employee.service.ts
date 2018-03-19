import {
  Injectable
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

interface Details {
  staffId?: string;
  staffName?: string;
  taskId?: string;
  task?: string;
  jobId?: string;
  job?: string;
  worktype?: string;
  co?: string;
  location?: {
    longitude: number;
    latitude: number;
  };
  date?: string;
  clockInTime?: string;
  clockOutTime?: string;
}


@Injectable()
export class SelectedEmployeeService {

  details: Details = {
    staffId: '',
    staffName: '',
    taskId: '',
    task: '',
    jobId: '',
    job: '',
    co: '',
    worktype: '',
    date: '',
    clockInTime: '',
    clockOutTime: '',
    location: {
      latitude: 0,
      longitude: 0
    }
  };

  clockedInSub = new BehaviorSubject<boolean>(false);

  checkDBStatus;

  constructor(
    private _afDb: AngularFireDatabase,
    private _router: Router
  ) {
    if (localStorage.getItem('userData')) {
      this.details = JSON.parse(localStorage.getItem('userData'));
    }
    if (localStorage.getItem('clockedIn')) {
      this.clockedInSub.next(JSON.parse(localStorage.getItem('clockedIn')));
    }

    if (!this.details.staffName) {
      this._router.navigate(['/login']);
    }
  }

  clockedIn() {
    return this.clockedInSub.asObservable();
  }

  clockInOut(state) {
    this.clockedInSub.next(state);
  }

}
