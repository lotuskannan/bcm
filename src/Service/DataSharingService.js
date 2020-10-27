import { Subject } from 'rxjs';

const subject = new Subject();
const sharingService =  {
    sendMessage: message => subject.next({ text: message }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
}
 
export default sharingService;