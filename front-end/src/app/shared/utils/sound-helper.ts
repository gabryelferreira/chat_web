import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SoundHelper {

    private notificationSound: HTMLAudioElement;

    constructor() {
        this.initializeNotificationSound();
    }

    private initializeNotificationSound() {
        this.notificationSound = new Audio();
        this.notificationSound.src = "/assets/sounds/notification.mp3";
        this.notificationSound.load();
    }

    playNotificationSound() {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play();
    }

}