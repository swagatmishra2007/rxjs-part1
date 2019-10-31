import { Observable, observable, empty } from 'rxjs';
import {map, retryWhen, tap, flatMap} from 'rxjs/operators';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/dom/ajax';
// import {DirectLine, Activity} from './directline';
// import { of } from 'rxjs/observable/of';

// var observable = Observable.create((observer: any) => {
//     observer.next('Hello World');
//     observer.next('Hello Again!');
//     observer.complete();
//     observer.next('Bye');
// }).map((a: any)=> "this is mapped! " + a);
//observable.map(a => "this is mapped! " + a);

// let directLine = new DirectLine({
//     token: 'blahblah',
//     domain: 'http://localhost:5000',
// });

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

// directLine.activity$.subscribe(
//     (x:Activity) => logItem("Activity Received"),
//     (error: any) => logItem('Error: ' + error),
//     () => logItem('Completed')
// );

// const a = Observable.create((observer: any) => {
//     // observer.next(1);
//     // observer.error(2);
//     // setTimeout(() => observer.error(3), 10);
//     // observer.next(4);
//     observer.next(1);
//     observer.error(-1);
//     observer.complete();
//     // observer.next(5);
//     // observer.error(4);
// });


// // a
// // .retryWhen((e$: any) => {
// //     return e$.delay(100).mergeMap((e: any) => console.log(e));
// // })
// // .subscribe({
// //     next(value: any) {  logItem(value); },
// //     error(err: any) { logItem(err); }
// // })

// a
// .retryWhen((error$: any) => {
//     console.log('retry called')
//     return error$.mergeMap((e: any) => {
//     console.log('merge map called');
//     return Observable.of([e]);})})
// .subscribe((x: any) => logItem(x),
// (error: any) => logItem('Error: ' + error),
// () => logItem('Completed')
// )
interface Server {
    CarsData: Array<{
        id: number,
        name: string,
        responseStatus: string
    }>,
    getData: ((this: Server) => Observable<{id:number, name:string}>)
};

const server: Server = {
    CarsData: [
        {
            id: 1,
            name: 'porche',
            responseStatus: '200' 
        },
        {
            id:2,
            name: 'tesla',
            responseStatus: '500' 
        },
        {
            id:3,
            name: 'honda',
            responseStatus: '500' 
        },
    ],
    getData(){
        // return Observable.of(...this.CarsData)
        // .map((item) =>{
        //      if(!item.responseStatus.startsWith('2')){
        //          throw item.responseStatus;
        //      }
        //      return item;
        // });
        return Observable.create((subscriber: any) => {
            // for(let a of this.CarsData){
            //     if(a.responseStatus === '500'){
            //         // throw a.responseStatus;
            //         console.log("raising error with " + a.responseStatus);
            //         subscriber.error(a.responseStatus);
            //         // throw a.responseStatus;
            //     }
            //     // else
            //     // {
            //     console.log("calling next with " + JSON.stringify(a));
            //     subscriber.next(a);
                // }
                subscriber.next(this.CarsData[0]);
                subscriber.next(this.CarsData[1]);
                subscriber.error('blah');
                subscriber.next(this.CarsData[2]);
                subscriber.error('blah');
            });
            // subscriber.next(this.CarsData[0]);
            // subscriber.error(1);
            // subscriber.error(2);
        // });
        // return Observable.from(this.CarsData)
        // .map((item) => {
        //      if(!item.responseStatus.startsWith('2')){
        //          throw item.responseStatus;
        //      }
        //      return item;
        // })
    }
}

server
.getData()
.pipe(
    retryWhen(errors => {
        // return errors.pipe(tap(() => console.log('retrying')))
        // return empty();
        // return errors.pipe(
        //     flatMap(error => empty())
        // )
        return errors;
    })
)

// .retryWhen(error$ => {
//     console.log('retry called ' +  Math.random());
//     return error$.flatMap(error => {
//     console.log("map is called " + error);
//     // console.log('map called ' +  Math.random());
// // return Observable.empty();
//     //return Observable.of(5);
//     // return Observable.throw("an error occurred");
//     return Observable.empty();
// })})
.subscribe(
    (x) => logItem("subscriber " + JSON.stringify(x)),
    (error) => logItem("error: " + error),
    () => logItem('Completed!')
);

function logItem(val:any) {
    var node = document.createElement('li');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("list").appendChild(node);
}

