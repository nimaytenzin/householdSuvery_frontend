import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  successBeep() {
    const audio = new Audio();
    audio.src = 'assets/scan.mp3';
    audio.load();
    audio.play();
  }

  failureBeep() {
    const audio = new Audio();
    audio.src = 'assets/errorsound.mp3';
    audio.load();
    audio.play();
  }
}
