import {Injectable} from '@angular/core';
import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';

@Injectable({
    providedIn: 'root'
})
export class TextToSpeechService {

    constructor(public tts: TextToSpeech) {
    }

    directionsTextToSpeech(directions) {
        this.tts.speak(directions)
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
    }

}
