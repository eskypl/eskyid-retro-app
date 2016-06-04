import {Component, Output, OnInit, ChangeDetectorRef, EventEmitter} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-participants-selector',
  styles: [`
    :host {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 32px;
      background-color: #ffffff;
      border-radius: 3px;
      color: #182531;
      z-index: 100;
    }
    .close {
      text-align: center;
      line-height: 20px;
      width: 24px;
      height: 24px;
      font-weight: 700;
      position: absolute;
      right: 4px;
      top: 4px;
      cursor: pointer;
      border-radius: 50%;
    }
    .close:hover {
      background-color: #f6f7f8;
    }
    .label {
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .participant {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 8px;
      padding: 8px;
      border-radius: 5px;
      cursor: pointer;
    }
    .participant:hover {
      background-color: #f6f7f8;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 16px;
    }
    .name {
      font-size: 14px;
      font-weight: 700;
    }
  `],
  template: `
    <div class="close" (click)="onClose()">x</div>
    <div class="label">Choose a teammate:</div>
    <div class="participant" *ngFor="let participant of participants" (click)="onSelect(participant)">
      <img [src]="participant.photoURL"/>
      <div class="name">{{participant.name}}</div>
    </div>
  `
})
export class ParticipantsSelectorComponent {
  @Output() close = new EventEmitter();
  @Output() select = new EventEmitter();

  participants = [];

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref('participants').on('child_added', (snapshot) => {
      this.participants.push({
        uid: snapshot.key,
        name: snapshot.val().name,
        photoURL: snapshot.val().photoURL
      });
      this.ref.detectChanges();
    });
  }

  onClose() {
    this.close.emit(null);
  }

  onSelect(participant) {
    this.select.emit(participant);
  }
}
