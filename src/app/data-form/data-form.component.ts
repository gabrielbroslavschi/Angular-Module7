import { HttpClient } from '@angular/common/http';
import { Component, booleanAttribute } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent {
  formulario!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // this.formulario = new FormGroup({
    //   nome: new  FormControl(null),
    //   email: new FormControl("usuario@email.com")
    // })

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),

      // Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    });
  }

  resetFormulario() {
    this.formulario.reset();
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.http
        .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .subscribe(
          (dados: any) => {
            console.log(dados);
            this.resetFormulario();
          },
          (error: any) => {
            alert(`erro`);
          }
        );
    }else{
      // this.formulario.controls
    }
  }

  verirficaValidTouched(campo: string) {
    return booleanAttribute(
      !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched
    );
  }

  verificarEmailInvalido() {
    const control = this.formulario.controls['email'];
    return booleanAttribute(
      control && control.value == null && control.touched
    );
  }

  aplicaCssErro(campo: string) {
    return {
      'class.has-error': this.verirficaValidTouched(campo),
      'class.has-feedback': this.verirficaValidTouched(campo),
    };
  }

  consultaCEP() {
    // Nova variável "cep" somente com dígitos.
    this.resetaDadosForm();
    let cep = this.formulario.get('endereco.cep')?.value.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.http
        .get(`//viacep.com.br/ws/${cep}/json`)
        .subscribe((dados: any) => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados: any) {
    this.formulario.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }
}
