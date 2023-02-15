import { Component } from '@angular/core';
import {EndUser, EndUserConstants} from "euscp";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eusign-app';

  // Налаштування бібліотеки
  euSettings = {
    language: "uk",
    encoding: "utf-8",
    httpProxyServiceURL: "Server/ProxyHandler.php",
    directAccess: true,
    CAs: "src/assets/Data/CAs.json",
    CACertificates: "Data/CACertificates.p7b",
    allowedKeyMediaTypes: [
      "е.ключ ІІТ Алмаз-1К",
      "е.ключ ІІТ Кристал-1",
      "ID-карта громадянина (БЕН)",
      "е.ключ ІІТ Алмаз-1К (PKCS#11)",
      "е.ключ ІІТ Кристал-1 (PKCS#11)"
    ]
  };

  endUser = new EndUser('', EndUserConstants.EndUserLibraryType.SW);

  private initialize(): boolean {
    console.log("Ініціалізація бібліотек");
    this.endUser.GetLibraryInfo().
    then(result => {
      if (!result.supported) {
        console.log("Бібліотека web-підпису не підтримується " +
          "в вашому браузері або ОС");
      }

      if (!result.loaded) {
        // Бібліотека встановлена, але потребує оновлення
        console.log("Бібліотека встановлена, але потребує оновлення");
      }
      console.log("this.endUser.IsInitialized()");
      return this.endUser.IsInitialized();
    }).
    then(result =>  {
        if (result) {
          console.log("EndUser: already initialized");
          return;
        }

        console.log("EndUser: initializing...");
        return this.endUser.Initialize(this.euSettings);
      }).
    catch(error=>{
      console.log(error);
      return false;
    });
    console.log("Бібліотека ще не ініціалізована");
    return false;
  }

  ngOnInit() {
    console.log("ngOnInit головного компонента");
    this.initialize();
  }
}
