import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WordpressService } from './wordpress.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private ws: WordpressService){}
  canActivate(): Observable<boolean>{
    return this.ws.validaUsuario()
  }

}
