import {
  Injectable
} from '@angular/core';
import {
  AngularFireDatabase, AngularFireObject, AngularFireList
} from 'angularfire2/database';
import {
  Observable
} from 'rxjs/Observable';
import {
  SelectedEmployeeService
} from './selected-employee.service';

@Injectable()
export class DatabaseService {
  employeesRef$: AngularFireList < any[] > ;
  employees$: Observable < any [] >;
  currentEmployeeRef$: AngularFireObject < {} > ;
  currentEmployee$: Observable < {} >;
  jobsRef$: AngularFireList < {} > ;
  jobs$: Observable < any[] > ;
  tasksRef$: AngularFireList < {} > ;
  tasks$: Observable < any[] > ;

  constructor(
    private _afDb: AngularFireDatabase,
    private _selectedEmployeeService: SelectedEmployeeService
  ) {
    this.employeesRef$ = this._afDb.list('employees');
    this.employees$ = this.employeesRef$.snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          ...action.payload.val()
        }));
      });


    this.jobsRef$ = this._afDb.list('jobs');
    this.jobs$ = this.jobsRef$.snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          value: action.payload.val()
        }));
      });

    this.tasksRef$ = this._afDb.list('tasks');
    this.tasks$ = this.tasksRef$.snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          value: action.payload.val()
        }));
      });

      if (localStorage.getItem('userData')) {
        this.setCurrentEmployeeDB(this._selectedEmployeeService.details.staffId);
      }
  }

  setCurrentEmployeeDB(staffID) {
    this.currentEmployeeRef$ = this._afDb.object(`employees/${staffID}/`);
    this.currentEmployee$ = this.currentEmployeeRef$.valueChanges();
  }

}
