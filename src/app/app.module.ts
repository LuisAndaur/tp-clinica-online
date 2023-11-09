import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { LoginComponent } from './layouts/pages/login/login.component';
import { BienvenidoComponent } from './layouts/pages/bienvenido/bienvenido.component';
import { ErrorComponent } from './layouts/pages/error/error.component';
import { NavbarComponent } from './layouts/components/navbar/navbar.component';
import { SpinnerComponent } from './layouts/components/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AuthService } from './services/auth.service';
import { EspecialistaService } from './services/especialista.service';
import { FirestorageService } from './services/firestorage.service';
import { LocalStorageService } from './services/local-storage.service';
import { SpinnerService } from './services/spinner.service';
import { SwalService } from './services/swal.service';
import { TransformService } from './services/transform.service';
import { UsuarioService } from './services/usuario.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BienvenidoComponent,
    ErrorComponent,
    NavbarComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    AuthService,
    EspecialistaService,
    FirestorageService,
    LocalStorageService,
    SpinnerService,
    SwalService,
    TransformService,
    UsuarioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
