import {
  Injectable
} from '@angular/core';
import {
  AngularFireDatabase
} from 'angularfire2/database';
import {
  Observable
} from 'rxjs/Observable';

@Injectable()
export class DatabaseService {
  employeesRef$: Observable < any[] > ;
  jobsRef$: Observable < any[] > ;
  tasksRef$: Observable < any[] > ;

  constructor(
    private _afDb: AngularFireDatabase
  ) {
    this.employeesRef$ = this._afDb.list('employees').snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          ...action.payload.val()
        }));
      });

    this.jobsRef$ = this._afDb.list('jobs').snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          value: action.payload.val()
        }));
      });

    this.tasksRef$ = this._afDb.list('tasks').snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          value: action.payload.val()
        }));
      });
  }

}
