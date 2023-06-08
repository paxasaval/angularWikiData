import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzAvatarModule,
    NzTagModule
  ],
  exports:[
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzAvatarModule,
    NzTagModule


  ]
})
export class MaterialModule { }
