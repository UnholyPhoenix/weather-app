import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  successMsg: boolean;

  constructor(private authService: AuthenticationService, private location: Location) {}

  ngOnInit(): void {
    this.successMsg = false;
    this.userForm = new FormGroup({
      userName: new FormControl(this.authService.credentials.username, Validators.required),
      appId: new FormControl(this.authService.credentials.apiId, Validators.required)
    });
  }

  cancel(): void {
    this.location.back();
  }

  update(): void {
    let currCredentials = this.authService.credentials;
    currCredentials.username = this.userForm.get('userName').value;
    currCredentials.apiId = this.userForm.get('appId').value;
    this.authService.setCredentials(currCredentials);
    this.successMsg = true;
  }
}
