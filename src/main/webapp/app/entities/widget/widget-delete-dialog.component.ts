import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalRef } from 'ngx-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Widget } from './widget.model';
import { WidgetPopupService } from './widget-popup.service';
import { WidgetService } from './widget.service';
import {NotificationService} from '../../shared/services/notification.service';
import { WidgetEventBusService } from '../../shared';
import { WidgetConnectionRemovedMessage, WidgetConnectionRemovedMessageContent, MessageType } from '.';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-widget-delete-dialog',
    templateUrl: './widget-delete-dialog.component.html'
})
export class WidgetDeleteDialogComponent {

    widget: Widget;
    hasConnectedWidgets: boolean;
    widgetSharedAlert: string = `the current widget is shared, if you remove this widget
    it won't be available anymore in all the pages where is now embedded.`;

    constructor(
        private widgetService: WidgetService,
        public bsModalRef: BsModalRef,
        private eventManager: JhiEventManager,
        private notificationService: NotificationService,
        protected widgetEventBusService: WidgetEventBusService
    ) {
    }

    clear() {
        this.bsModalRef.hide();
    }

    confirmDelete(id: number) {

        let content: WidgetConnectionRemovedMessageContent;
        if (this.widget.primaryWidgetId) {
            content = {
                primaryWidgetId: this.widget.primaryWidgetId,
                secondaryWidgetId: this.widget.id
            };
        }
        this.widgetService.delete(id).subscribe((response) => {
                this.eventManager.broadcast({
                    name: 'widgetListModification',
                    eventOccurred: 'widget-removed',
                    description: 'Deleted a Widget',
                    content: id
                });
                if (content) {
                    // we are deleting a secondary widget
                    this.widgetEventBusService.publish(MessageType.WIDGET_CONNECTION_REMOVED, new WidgetConnectionRemovedMessage(content));
                }
                this.bsModalRef.hide();
            },
            (error: HttpErrorResponse) => {
                const err = error.error;
                this.notificationService.push('error', 'Widget deletion failed', err['title']);
                this.bsModalRef.hide();
            });
    }
}

@Component({
    selector: 'jhi-widget-delete-popup',
    template: ''
})
export class WidgetDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private widgetPopupService: WidgetPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.queryParams.subscribe((params) => {
            this.widgetPopupService
                .open(WidgetDeleteDialogComponent as Component, params['id'], undefined, params['hasConnectedWidgets']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
