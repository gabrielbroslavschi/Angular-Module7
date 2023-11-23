import { HttpClientModule } from '@angular/common/http'; 

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateFormComponent } from './template-form.component';
import { FormDebugComponent } from '../form-debug/form-debug.component';
import { CampoControlErroComponent } from '../campo-control-erro/campo-control-erro.component';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule], 
  declarations: [TemplateFormComponent, FormDebugComponent, CampoControlErroComponent],
})
export class TemplateFormModule {}
