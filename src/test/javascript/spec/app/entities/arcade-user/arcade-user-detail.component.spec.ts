/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { ArcadeanalyticsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ArcadeUserDetailComponent } from '../../../../../../main/webapp/app/entities/arcade-user/arcade-user-detail.component';
import { ArcadeUserService } from '../../../../../../main/webapp/app/entities/arcade-user/arcade-user.service';
import { ArcadeUser } from '../../../../../../main/webapp/app/entities/arcade-user/arcade-user.model';

describe('Component Tests', () => {

    describe('ArcadeUser Management Detail Component', () => {
        let comp: ArcadeUserDetailComponent;
        let fixture: ComponentFixture<ArcadeUserDetailComponent>;
        let service: ArcadeUserService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ArcadeanalyticsTestModule],
                declarations: [ArcadeUserDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ArcadeUserService,
                    JhiEventManager
                ]
            }).overrideTemplate(ArcadeUserDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ArcadeUserDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ArcadeUserService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new ArcadeUser(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.arcadeUser).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
