import { Observable, AjaxResponse } from 'rxjs';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/ajax';

// var observable = Observable.create((observer: any) => {
//     observer.next('Hello World');
//     observer.next('Hello Again!');
//     observer.complete();
//     observer.next('Bye');
// }).map((a: any)=> "this is mapped! " + a);
//observable.map(a => "this is mapped! " + a);

var observable: Observable<string> = Observable.ajax({
    method: 'GET',
    url: 'http://localhost:5000/api/redirect',
    responseType: 'Text'
})
// .map(ajaxResponse =>  JSON.stringify(ajaxResponse.response));
// .map(ajaxResponse =>  (ajaxResponse.response as any[]).map(a => a.id) as unknown as string);
.map(ajaxResponse => {
    console.log(ajaxResponse);
    return ajaxResponse.response as string});

observable.subscribe(
    (x:any) => logItem(x),
    (error: any) => logItem('Error: ' + error),
    () => logItem('Completed')
);

function logItem(val:any) {
    var node = document.createElement('li');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("list").appendChild(node);
}

