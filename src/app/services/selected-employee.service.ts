import {
  Injectable
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

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

  clockedIn = new Subject<boolean>();

  constructor() {
    if (localStorage.getItem('userData')) {
      this.details = JSON.parse(localStorage.getItem('userData'));
    }
  }

}
