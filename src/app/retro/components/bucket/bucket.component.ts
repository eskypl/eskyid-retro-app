import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

import { FirebaseService } from '../../../shared/services/firebase/firebase.service'
import { ItemComponent } from '../item/item.component';

declare var firebase: any;

@Component({
  selector: 'ra-bucket',
  directives: [ ItemComponent ],
  styles: [`
    :host {
      display: block;
      min-width: 35rem;
      padding: 1rem 2.5rem 1rem 2.5rem;
      color:#f6f7f8;
    }
    .items {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .item-add {
      display: block;
      margin: 1.25rem 0 0 0;
      flex-basis: 16.875rem;
      min-height: 10rem;
      border-radius: 3px;
      overflow: hidden;
      border: 0;
      background: #2b465e;
      color: #fff;
      cursor: pointer;
      outline: none;
    }
    .icon-plus {
      transition: transform 0.5s ease;
    }
    .item-add:hover .icon-plus {
      transform: scale(1.5);
    }
    .bucket-name {
      text-align: center;
      line-height: 3.125rem;
    }
    .bucket-name .icon {
      display: inline-block;
      width: 3.125rem;
      height: 3.125rem;
      border-radius: 50%;
      background-color: #303b46;
      position: relative;
      top: -.9375rem;
      font-size: 1.25rem;
      margin-right: 1rem;
    }
    .bucket-name .icon::before {
      position: relative;
      top: .9375rem;
    }
    .item-add .icon {
      display: inline-block;
      width: 4.375rem;
      height: 4.375rem;
      border-radius: 50%;
      background-color: #1c2b39;
      color: #fff;
      position: relative;
      font-size: 2.313rem;
    }
    .item-add .icon::before {
      position:relative;
      top: .938rem;
    }
  `],
  template: `
    <h2 class="bucket-name">
        <span class="icon icon-{{icon}}" [style.color]="color"></span> {{name}}
    </h2>
    <div class="items">
        <ra-item *ngFor="let uid of itemUids" [uid]="uid" [style.background]="color"></ra-item>
        <button class="item-add" (click)="addItem()">
            <span class="icon icon-plus"></span>
        </button>
    </div>
  `
})
export class BucketComponent {
  @Input() name: string;
  @Input() color: string;
  @Input() icon: string;
  @Input() id:string = 'BucketId';

  itemUids:string[] = [];
  private _items:any = this.fb.ref('items');

  constructor(
      private fb:FirebaseService,
      private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._items.on('child_added', (snapshot) => {
      var item = snapshot.val();
      if(item.bucket === this.id){
        this.itemUids.push(snapshot.key);
      }
      this.ref.detectChanges();
    });
  }

  addItem() {
    this._items.push({
      bucket: this.id,
      text: '',
      votes: {
        [this.fb.currentUser.uid]: 0
      }
    });
  }
}
