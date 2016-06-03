import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service'
import {ActionComponent} from './action.component'

declare var firebase: any;

@Component({
  selector: 'ret-action-list',
  directives: [ActionComponent],
  providers: [FirebaseService],
  styles: [`
    :host {
      display: block;
      flex-grow: 1;
      padding: 1em 2.5em;
      color:#f6f7f8;
    }
  `],
  template: `<div>Items:
    <div class="ret-items">
        <ret-action *ngFor="let uid of actionUids" [uid]="uid" [itemId]="itemId" [style.background]="color"></ret-action>
        <button class="ret-item-add" (click)="addItem()">Add</button>
    </div>
  </div>
  `
})
export class ActionListComponent {
  itemId = "ITEM_ID";
  itemText = "Tu będzie tekst z itema";
  actionUids:string[] = [];
  private _actions:any = this.fb.ref(`actions/${this.itemId}`);

  constructor(
      private fb:FirebaseService,
      private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._actions.on('child_added', (snapshot) => {
      var action = snapshot.val();
      this.actionUids.push(snapshot.key);
      this.ref.detectChanges();
    });
  }

  addItem() {
    this._actions.push({
      text: '',
    });
  }
}