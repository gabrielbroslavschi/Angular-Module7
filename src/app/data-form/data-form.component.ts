import { estados } from './../shared/models/estados';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { DropdownService } from './../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, booleanAttribute } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent {
  formulario!: FormGroup;
  // estados!: estados[];
  estados!: Observable<estados[]>;
  cargos!: any[];
  tecnologias!: any[];
  newsLetterOp!: any[];

  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private consultaCepService: ConsultaCepService
  ) {}

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstadosBr();

    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsLetterOp = this.dropdownService.getNewsLetter();

    // this.dropdownService.getEstadosBr()
    // .subscribe((dados: any) => {
    //   this.estados = dados;
    //   console.log(dados);
    // });

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
      cargo: [null],
      tecnologias: [null],
      newsLetter: ['sim'],
      termos: [false, Validators.pattern('true')],
      frameworks: this.buildFrameworks(),

      // Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    });
  }

  buildFrameworks() {
    const values = this.frameworks.map((valor: any) => {
      new FormControl(false);
    });

    return this.formBuilder.array(values);
  }

  resetFormulario() {
    this.formulario.reset();
  }

 

  onSubmit() {
    let valueSubmit = Object.assign({}, this.formulario.value);
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v: any, i: any) => (v ? this.frameworks[i] : null))
        .filter((v: any) => v !== null),
    });

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
    } else {
      // this.formulario.controls
      this.verificaValidacoesForm(this.formulario);
      // this.dropdownService.getEstadosBr().map((dados: any) => {
      //   console.log(dados);
      // });
    }
  }

  verificaValidacoesForm(formGroups: FormGroup) {
    Object.keys(formGroups.controls).forEach((campo: any) => {
      const controle = formGroups.get(campo);
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
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
    let cep = this.formulario.get('endereco.cep')?.value;

    if (cep != null && cep !== '') {
      this.consultaCepService.consultaCEP(cep)?.subscribe((dados: any) => {
        this.populaDadosForm(dados);
      });
    }

    return of({});
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

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Plenao', desc: 'Dev Pl' };

    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 === obj2;
  }

  setarTecnologias() {
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript']);
  }
}
