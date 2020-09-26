import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WordpressService } from 'src/app/servicios/wordpress.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})

export class NavbarComponent implements OnInit {
  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;
  loggueado: boolean;
  usuario
  constructor(
    private router: Router,
    private ws: WordpressService
    ) { }

  ngOnInit(): void {
  this.ws.activo.subscribe((res) => {
    console.log("ACTIVO", res)
    this.loggueado = res,
    this.usuario = this.ws.usuario
  })

  }

  logout(){
    //alert('chauu')
    this.ws.logout()

  }
  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
}








}
