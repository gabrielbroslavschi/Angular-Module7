import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {


  constructor(private http: HttpClient) {}


  onSubmit(form: any){
    console.log(form)

    this.http.post("https://httpbin.org/post", JSON.stringify(form.value)).subscribe((dados: any) => {
      console.log(dados);
    })
  }

  verirficaValidTouched(campo: any){
    return !campo.valid && campo.touched;
  }

  aplicaCSSErro(campo: any){
    return {
      'class.has-error':this.verirficaValidTouched(campo),
      'class.has-feedback':this.verirficaValidTouched(campo)
    }
  }

  consultaCEP(cep:any,  form: any){
    // Nova variável "cep" somente com dígitos.
    this.resetaDadosForm(form);
    cep = cep.value.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.http.get(`//viacep.com.br/ws/${cep}/json`)
      .subscribe((dados:any) =>this.populaDadosForm(dados, form));
    }

    
  }

  populaDadosForm(dados: any, formulario: any){
    // formulario.setValue({
    //   "nome": formulario.value.nome,
    //   "email": formulario.value.email,
    //   "endereco": {
    //     "cep": dados.cep,
    //     "numero": "",
    //     "complemento": dados.complemento,
    //     "rua": dados.logradouro,
    //     "bairro": dados.bairro,
    //     "cidade": dados.localidade,
    //     "estado": dados.uf
    //   }
    // })

    formulario.form.patchValue({
      "endereco": {
        "cep": dados.cep,
        "complemento": dados.complemento,
        "rua": dados.logradouro,
        "bairro": dados.bairro,
        "cidade": dados.localidade,
        "estado": dados.uf
      }
    })
  }

  resetaDadosForm(formulario: any){
    formulario.form.patchValue({
      "endereco": {
        "complemento": null,
        "rua": null,
        "bairro": null,
        "cidade": null,
        "estado": null
      }
    })
  }
  
}
