import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.scss']
})
export class BienvenidoComponent implements OnInit {

  usuarioLogeado: boolean = false;

  constructor(
    private auth: AuthService,
  ) {}


  ngOnInit(): void {
    this.auth.usuarioLogeado().subscribe((usuario) => {
      this.usuarioLogeado = !!usuario?.email;
    });
  }

}
