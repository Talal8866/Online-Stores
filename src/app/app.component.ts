import { Component } from '@angular/core';
import { AuthServiceService } from './auth/services/auth.service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SoukPlus';

  constructor(private service: AuthServiceService) { }

  // ngOnInit(): void {
  //   this.getuserdata()
  // }

  // getuserdata() {
  //   this.service.get_role().subscribe(res => {
  //     this.service.user.next(res);
  //   })
  // }
}
