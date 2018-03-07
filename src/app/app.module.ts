// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment.prod';

// COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ActionComponent } from './components/action/action.component';
import { DetailsComponent } from './components/details/details.component';

// SERVICES
import { DatabaseService } from './services/database.service';
import { SelectedEmployeeService } from './services/selected-employee.service';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: ActionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details', component: DetailsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ActionComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DatabaseService,
    SelectedEmployeeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
