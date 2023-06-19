import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent {
  newAsset: any = {}; // Object to store the new asset data

  @Output() assetAdded = new EventEmitter<any>(); // Event emitter for notifying the parent component
  @Output() modalClosed = new EventEmitter<void>(); // Event emitter for notifying the modal closure

  openModal(): void {
    // Logic to open the modal
  }

  onSubmit(assetForm: any): void {
    if (assetForm.valid) {
      this.assetAdded.emit(this.newAsset); // Emit the new asset data to the parent component
      this.newAsset = {}; // Clear the form fields
    }
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}
