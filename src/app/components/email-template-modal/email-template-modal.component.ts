
import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-email-template-modal',
  standalone: true,
  imports: [],
  templateUrl: './email-template-modal.component.html',
  styleUrl: './email-template-modal.component.scss'
})
export class EmailTemplateModalComponent {
  isOpen: WritableSignal<boolean> = signal(false);

  openModal() {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; 
  }

  closeModal() {
    this.isOpen.set(false);
    document.body.style.overflow = 'auto'; 
  }

}
