import Primus from 'primus';
import primusEmit from 'primus-emit';
import { Injectable, OnDestroy } from '@angular/core';
import { noop, find, remove } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SocketService {
    private primus: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

    static parameters = [AuthService];
    constructor(private authService: AuthService) {
        this.authService.authInfo().subscribe(authInfo => {
            this.reconnect();
        }, err => console.log(err));
    }

    ngOnDestroy(): void {
        if (this.primus && this.primus.getValue()) {
            this.primus.getValue().end();
        }
    }

    /**
     * Initializes a connection with the primus server.
     */
    connect(): void {
        console.log('connecting to primus');
        const primus = (Primus as any).connect();
        primus.plugin('emit', primusEmit);

        // For convenience we use the private event `outgoing::url` to append the
        // authorization token in the query string of our connection URL.
        primus.on('outgoing::url', url => {
            console.log('outgoing::url', url);
            const token = this.authService.getToken();
            if (token) {
                url.query = `access_token=${token}`;
            }
        });

        // primus.on('unexpected-response', function(req, res) {
        //   console.log('primus unexpected-response', req);
        // });

        primus.on('error', function error(err) {
            console.error('Something horrible has happened', err);
        });

        // primus.on('open', function open() {
        //   console.log('Connection opened');
        // });

        if (process.env.NODE_ENV === 'development') {
            primus.on('data', function message(data) {
                console.log('Socket:', data);
            });
        }

        this.primus.next(primus);
    }

    /**
     * Returns the primus client.
     * @param {Observable<any>}
     */
    getPrimus(): Observable<any> {
        return this.primus.asObservable();
    }

    /**
     * Reconnects to the primus server.
     */
    reconnect(): void {
        if (this.primus.getValue()) {
            this.primus.getValue().end();
        }
        this.connect();
    }

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates(modelName, array, cb = noop): void {
        if (this.primus && this.primus.getValue()) {
            const primus = this.primus.getValue();
            /**
             * Syncs item creation/updates on 'model:save'
             */
            primus.on(`${modelName}:save`, item => {
                console.log('received new item', item);
                let oldItem = find(array, { _id: item._id });
                let index = array.indexOf(oldItem);
                let event = 'created';

                // replace oldItem if it exists
                // otherwise just add item to the collection
                if (oldItem) {
                    array.splice(index, 1, item);
                    event = 'updated';
                } else {
                    array.push(item);
                }

                cb(event, item, array);
            });

            /**
             * Syncs removed items on 'model:remove'
             */
            primus.on(`${modelName}:remove`, item => {
                console.log('AHAHA array', item);
                console.log('AHAHA item', item);
                remove(array, { _id: item._id });
                console.log('AHAHA after removal', array);
                cb('deleted', item, array);
            });
        }
    }

    // syncItem(modelName: string, cb = save): void {
    //   if (this.primus && this.primus.getValue()) {
    //       const primus = this.primus.getValue();
    //
    //       primus.on(`${modelName}:save`, item => {
    //
    //       });
    //
    //       primus.on(`${modelName}:remove`, item => {
    //
    //       });
    //   }
    // }


    syncItemSubject(modelName: string, subject: BehaviorSubject<any>): void {
        if (this.primus && this.primus.getValue()) {
            const primus = this.primus.getValue();

            primus.on(`${modelName}:save`, item => {
                subject.next(item);
            });

            primus.on(`${modelName}:remove`, item => {
                subject.next(null);
            });
        }
    }

    /**
     * Syncs the content (array) of the BehaviorSubject specified.
     */
    syncArraySubject(modelName: string, subject: BehaviorSubject<any[]>): void {
        if (this.primus && this.primus.getValue()) {
            const primus = this.primus.getValue();

            primus.on(`${modelName}:save`, item => {
                let items = subject.getValue();
                let oldItem = find(items, { _id: item._id });
                let index = items.indexOf(oldItem);
                if (oldItem) {
                    items.splice(index, 1, item);
                } else {
                    items.push(item);
                }
                subject.next(items);
                console.log(`${modelName}:save CATCHED`);
            });

            primus.on(`${modelName}:remove`, item => {
                let items = subject.getValue();
                remove(items, { _id: item._id });
                subject.next(items);
                console.log(`${modelName}:remove CATCHED`);
            });
        }
    }

    /**
     * Removes listeners for a models updates on the socket
     * @param modelName
     */
    unsyncUpdates(modelName): void {
        if (this.primus && this.primus.getValue()) {
            const primus = this.primus.getValue();
            primus.removeAllListeners(`${modelName}:save`);
            primus.removeAllListeners(`${modelName}:remove`);
        }
    }
}
