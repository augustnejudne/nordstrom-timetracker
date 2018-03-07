import { TestBed, inject } from '@angular/core/testing';

import { SelectedEmployeeService } from './selected-employee.service';

describe('SelectedEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedEmployeeService]
    });
  });

  it('should be created', inject([SelectedEmployeeService], (service: SelectedEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
