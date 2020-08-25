import { Component, OnInit } from '@angular/core';
import { WordpressService } from './servicios/wordpress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'licencias';
  constructor(
    private wpS: WordpressService
  ){}

  ngOnInit(){
    /* this.wpS.postsPublicos().subscribe( (data) =>  {
      console.log(data)
    }) */
  }

}
