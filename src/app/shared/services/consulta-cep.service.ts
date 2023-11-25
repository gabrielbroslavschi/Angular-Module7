import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(valor: string){
    let cep = valor.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      return this.http
        .get(`//viacep.com.br/ws/${cep}/json`)
    }

    return null;
  }
}
