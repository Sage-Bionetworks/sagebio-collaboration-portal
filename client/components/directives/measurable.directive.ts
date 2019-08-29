import { Directive, ElementRef } from '@angular/core';
import { Observable, fromEvent, merge, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map
} from 'rxjs/operators';

@Directive({
    selector: '[appMeasurable]'
})
export class MeasurableDirective {
    private resize$: Observable<Window>;

    constructor(private elem: ElementRef) {}

    ngOnInit() {
        this.resize$ = fromEvent<Window>(window, 'resize');
    }

    width(): Observable<number> {
        return merge(this.resize$, of(1))  // of added to fire at subscribe time
            .pipe(
                map(() => {
                    const bounds = <ClientRect>this.elem.nativeElement.getBoundingClientRect();
                    return bounds.width;
                }),
                // debounceTime(50),
                distinctUntilChanged()
            );
    }
}
