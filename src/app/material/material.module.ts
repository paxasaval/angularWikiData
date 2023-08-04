import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzAvatarModule,
    NzTagModule,
    TagCloudModule,
    NzSpinModule,
    NzInputModule
  ],
  exports:[
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzAvatarModule,
    NzTagModule,
    TagCloudModule,
    NzSpinModule,
    NzInputModule

  ]
})
export class MaterialModule { }
