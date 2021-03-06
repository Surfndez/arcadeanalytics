import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Contract } from './contract.model';
import { ContractService } from './contract.service';

@Injectable({ providedIn: 'root' })
export class ContractPopupService {

    private ngbModalRef: BsModalRef;

    constructor(
        private modalService: BsModalService,
        private router: Router,
        private contractService: ContractService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<BsModalRef> {
        return new Promise<BsModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.contractService.find(id).subscribe((contract: Contract) => {
                    this.ngbModalRef = this.contractModalRef(component, contract);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.contractModalRef(component, new Contract());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    contractModalRef(component: Component, contract: Contract): BsModalRef {
        const modalRef = this.modalService.show(component, { backdrop: 'static'});
        modalRef.content.contract = contract;
        this.modalService.onHide.subscribe((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
