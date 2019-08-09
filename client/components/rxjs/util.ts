import { of, forkJoin, defer, Subject, from } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

export function forkJoinWithProgress(arrayOfObservables) {
    return defer(() => {
        let counter = 0;
        const percent$ = new Subject();

        const modilefiedObservablesList = arrayOfObservables.map(
            (item, index) => item.pipe(
                finalize(() => {
                    const percentValue = ++counter * 100 / arrayOfObservables.length;
                    percent$.next(percentValue);
                })
            )
        );

        const finalResult$ = (modilefiedObservablesList.length > 0 ?
            forkJoin(modilefiedObservablesList) : of([]))
            .pipe(
                tap(() => {
                    percent$.next(100);
                    percent$.complete();
                })
            );

        return of([finalResult$, percent$.asObservable()]);
    });
}
