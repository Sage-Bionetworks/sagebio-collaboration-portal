import { Component, Inject } from '@angular/core'
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material'

@Component({
    selector: 'confirmation-dialog',
    template: require('./confirmation-dialog.html'),
})
export class ConfirmationDialog {
    message = 'Are you sure?'
    confirmButton = {
        text: 'Yes',
        color: 'primary'
    }
    cancelButton = {
        text: 'No',
        color: 'warn'
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ConfirmationDialog>
    ) {
        if (data) {
            this.message = data.message || this.message
            if (data) {
                // Confirm
                this.confirmButton.text =
                    data.confirmButton.text || this.confirmButton.text
                this.confirmButton.color =
                    data.confirmButton.color || this.confirmButton.color

                // Cancel
                this.cancelButton.text =
                    data.cancelButton.text || this.cancelButton.text
                this.cancelButton.color =
                    data.cancelButton.color || this.cancelButton.color
            }
        }
    }

    onConfirmClick(): void {
        this.dialogRef.close(true)
    }
}
