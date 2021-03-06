import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddIdentityComponent } from '../add-identity';
import { IssueIdentityComponent } from '../issue-identity';
import { IdentityIssuedComponent } from '../identity-issued';
import { AlertService } from '../services/alert.service';
import { IdentityService } from '../services/identity.service';

@Component({
  selector: 'identity',
  templateUrl: './identity.component.html',
  styleUrls: [
    './identity.component.scss'.toString()
  ]
})
export class IdentityComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private identityService: IdentityService
  ) {

  }

  ngOnInit(): Promise<any> {
    return this.loadIdentities();
  }

  identities: string[];
  currentIdentity: string = null;

  loadIdentities() {
    return this.identityService.getCurrentIdentities()
      .then((currentIdentities) => {
        this.identities = currentIdentities;

        return this.identityService.getCurrentIdentity();
      })
      .then((currentIdentity) => {
        this.currentIdentity = currentIdentity;
      })
      .catch((error) => {
        this.alertService.errorStatus$.next(error);
      });
  }

  addId() {
    this.modalService.open(AddIdentityComponent).result.then((result) => {
      return this.loadIdentities();
    }, (reason) => {
      this.alertService.errorStatus$.next(reason);
    });
  }

  issueNewId() {
    this.modalService.open(IssueIdentityComponent).result.then((result) => {
      if (result) {
        const modalRef = this.modalService.open(IdentityIssuedComponent);
        modalRef.componentInstance.userID = result.userID;
        modalRef.componentInstance.userSecret = result.userSecret;

        return modalRef.result;
      }
    }, (reason) => {
      this.alertService.errorStatus$.next(reason);
    })
    .then(() => {
      return this.loadIdentities();
    }, (reason) => {
      this.alertService.errorStatus$.next(reason);
    });
  }

  setCurrentIdentity(newIdentity: string) {
    this.identityService.setCurrentIdentity(newIdentity)
    this.currentIdentity = newIdentity;
  }

}
