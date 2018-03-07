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
import { SelectedEmployeeService } from '../../services/selected-employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  employees: any[];
  selectedEmployee;

  constructor(
    private _databaseService: DatabaseService,
    private _selectedEmployeeService: SelectedEmployeeService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._databaseService.employeesRef$.subscribe(res => {
      this.employees = res.sort(this.compare);
      console.log(this.employees);
    });
  }

  compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  onSubmit(f) {
    this.selectedEmployee = this.employees.find(e => {
      return f.value.name === e.name;
    });
    if (f.value.password) {
      if (f.value.password === this.selectedEmployee.password) {
        this._selectedEmployeeService.details.staffId = this.selectedEmployee.key;
        this._selectedEmployeeService.details.staffName = this.selectedEmployee.name;
        this._router.navigate(['/details']);
      }
    }
  }

}
