import Application = require("application");
import platform = require("platform");
import { Component , OnInit, ChangeDetectionStrategy} from "@angular/core";
import { User, LatLong, ListCities} from "./shared/user/user";
import { UserService } from "./shared/user/user.service";
import { PanGestureEventData, GestureStateTypes } from "ui/gestures";
import geolocation = require("nativescript-geolocation");
import { Observable as RxObservable } from "rxjs/Observable";

declare var java;
declare var android;

/* https://customlocation.cit.api.here.com/v1/search/bbox?layerId=30&bbox=48.9299%2C8.9883%3B47.4209%2C10.2957&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg
*/
@Component({
  selector: "my-app",
  providers : [UserService],
  templateUrl: "pages/login/login.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    user : User ;
    a : Number;
    isLoading : boolean = false;
    showLoading : boolean = false;
    people: ListCities[] = [];
    errorMessage: string = '';
    latiNew : LatLong ;
    public myItems: RxObservable<Array<ListCities>>;

    ngOnInit(){
        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest().then(() => {
            console.log('Test');
            this.myItems = this.userservice.getCityDetails();

                this.getLocation();
            },(e) => {
                 console.log("Error Native: " + e.message);
            });
        }
        else {
            this.getLocation();
        }
    }

    constructor(private userservice : UserService) {

        this.user = new User();
    }

    getLocation() {

console.log('in service');
        //Get cities


        var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10,  timeout: 20000})
        .then((loc) => {

            if (loc) {

                console.log("latitude: " + loc.latitude + 'longitute: '+loc.longitude);
                let lati = <LatLong>({
                    latitude : loc.latitude,
                    longitude : loc.longitude,
                });
                this.latiNew = loc;
                this.myItems = this.userservice.getCityDetails();
                console.dump(this.latiNew);
            }
        }, (e) => {
            console.log("Error: " + e.message);
        });

    }

    test() {
        this.isLoading = !this.isLoading;
        this.showLoading = !this.showLoading;
    }

    getCities() {

    }

    redirect() {
        if(Application.android){
            Application.android.currentContext.startActivityForResult(new android.content.Intent(android.provider.Settings.ACTION_SETTINGS), 0);
         }
    }
    test1(args: PanGestureEventData) {

         console.log("Pan deltaX:" + args.deltaX + "; deltaY:" + args.deltaY + ";");
        console.log((<any>args.object).className);
           let image = <any>args.object;
         image.animate({
                    translate: { x: args.deltaX, y: 0 },
                    duration: 100
                }).then(() => {
                                   //console.log("Animation finished.");
                               })
                               .catch((e) => {
                                   console.log(e.message);
                               });


    }
}
