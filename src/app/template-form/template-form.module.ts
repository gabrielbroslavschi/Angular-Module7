import { HttpClientModule } from '@angular/common/http'; 

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateFormComponent } from './template-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, SharedModule], 
  declarations: [TemplateFormComponent],
})
export class TemplateFormModule {}
