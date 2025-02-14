import { Observable, AjaxResponse } from 'rxjs';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/ajax';
import {DirectLine, Activity} from './directline';

// var observable = Observable.create((observer: any) => {
//     observer.next('Hello World');
//     observer.next('Hello Again!');
//     observer.complete();
//     observer.next('Bye');
// }).map((a: any)=> "this is mapped! " + a);
//observable.map(a => "this is mapped! " + a);

let directLine = new DirectLine({
    token: 'blahblah',
    domain: 'http://localhost:5000',
});

// var observable: Observable<string> = Observable.ajax({
//     method: 'GET',
//     url: 'http://localhost:5000/api/redirect',
//     responseType: 'Text'
// })
// // .map(ajaxResponse =>  JSON.stringify(ajaxResponse.response));
// // .map(ajaxResponse =>  (ajaxResponse.response as any[]).map(a => a.id) as unknown as string);
// .map(ajaxResponse => {
//     console.log(ajaxResponse);
//     return ajaxResponse.response as string});

// observable.subscribe(
//     (x:any) => logItem(x),
//     (error: any) => logItem('Error: ' + error),
//     () => logItem('Completed')
// );

directLine.activity$.subscribe(
    (x:Activity) => logItem("Activity Received"),
    (error: any) => logItem('Error: ' + error),
    () => logItem('Completed')
);

const a = Observable.create((observer: any) => {
    // observer.next(1);
    // observer.error(2);
    // setTimeout(() => observer.error(3), 10);
    // observer.next(4);
    observer.next(1);
    observer.error(2);
    observer.next(5);
    observer.error(4);
});


// a
// .retryWhen((e$: any) => {
//     return e$.delay(100).mergeMap((e: any) => console.log(e));
// })
// .subscribe({
//     next(value: any) {  logItem(value); },
//     error(err: any) { logItem(err); }
// })

a
.retryWhen((error$: any) => {
    console.log('retry called')
    return error$.mergeMap((e: any) => {
    console.log('merge map called');
    return e;})})
.subscribe((x: any) => logItem(x),
(error: any) => logItem('Error: ' + error),
() => logItem('Completed')
)

function logItem(val:any) {
    var node = document.createElement('li');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("list").appendChild(node);
}

