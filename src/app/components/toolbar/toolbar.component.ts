import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedEmployeeService } from '../../services/selected-employee.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  clockedIn: boolean;

  constructor(
    private _router: Router,
    private _selectedEmployeeService: SelectedEmployeeService
  ) { }

  ngOnInit() {
    this._selectedEmployeeService.clockedIn.subscribe(res => this.clockedIn = res);
  }

  logout() {
    localStorage.removeItem('userData');
    this._router.navigate(['/login']);
  }

}
