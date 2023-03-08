import {Component} from '@angular/core';
import {EndUser, EndUserConstants, EndUserLibraryInfoSW} from "euscp";
import {EndUserLibraryType} from "euscp/EndUserConstants";

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

  // Бібліотека для роботи з файловими ключами, що не потребує
// встановлення додатково ПЗ
  private euSignFile = new EndUser(
    undefined,
    EndUserConstants.EndUserLibraryType.JS);

// Бібліотека для роботи з аппаратними носіями, що потребує
// встановлення додатково ПЗ бібліотек web-підпису, web-розширення для браузера
  private euSignKeyMedia = new EndUser(
    undefined,
    EndUserConstants.EndUserLibraryType.SW);
  private keyMedias = [];

  public euSign = this.euSignKeyMedia;

  ngOnInit() {
    console.log("ngOnInit головного компонента");
    this.setLibraryType(EndUserConstants.EndUserLibraryType.SW);

  }

  setLibraryType(type: EndUserLibraryType) {
    console.log("Встановлення типу бібліотеки" + type);
    switch (type) {
      case EndUserConstants.EndUserLibraryType.JS:
        this.euSign = this.euSignFile;
        break;
      case EndUserConstants.EndUserLibraryType.SW:
        this.euSign = this.euSignKeyMedia;
        break;
    }

    this.initialize()
      .then(result => {
        if (this.euSign == this.euSignFile)
          return [];

        return this.euSign.GetKeyMedias();
      })
      .then(result => {
        // setKeyMedias(keyMedias);
        //
        // signBlock.style.display = 'block';
      })
      .catch(e => {
        let msg = (e.message || e);

        console.log("Initialize error: " + msg);

        alert('Виникла помилка при ініціалізації бібліотеки. ' +
          'Опис помилки: ' + msg);
      })

  }

  private initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (this.euSign == this.euSignFile) {
        this.euSign.IsInitialized()
          .then((result) => {
            if (result) {
              console.log("EndUser: already initialized");
              resolve();
              return;
            }

            console.log("EndUser: initializing...");
            return this.euSign.Initialize(this.euSettings)
          })
          .then((result) => {
            console.log("EndUser: initialized");
            resolve()
          })
          .catch(error => {
            console.log("EndUser: error"+error);
            // reject();
          });
      } else {
        // Перевірка чи встановлені необхідні модулі для роботи криптографічної бібліотеки
        this.euSign.GetLibraryInfo()
          .then(result => {
            if (!result.supported) {
              throw "Бібліотека web-підпису не підтримується " +
              "в вашому браузері або ОС";
            }

            if (!result.loaded && result instanceof EndUserLibraryInfoSW) {
              // Бібліотека встановлена, але потребує оновлення
              if (result.isNativeLibraryNeedUpdate) {
                throw "Бібліотека web-підпису потребує оновлення. " +
                "Будь ласка, встановіть оновлення за посиланням " +
                result.nativeLibraryInstallURL;
              }

              // Якщо браузер підтримує web-розширення рекомендується
              // додатково до нативних модулів встановлювати web-розширення
              // Увага! Встановлення web-розширень ОБОВ'ЯЗКОВЕ для ОС Linux та ОС Windows Server
              if (result.isWebExtensionSupported &&
                !result.isWebExtensionInstalled) {
                throw "Бібліотека web-підпису потребує встановлення web-розширення. " +
                "Будь ласка, встановіть web-розширення за посиланням " +
                result.webExtensionInstallURL + " та оновіть сторінку";
              }

              // Бібліотека (нативні модулі) не встановлені
              throw "Бібліотека web-підпису потребує встановлення. " +
              "Будь ласка, встановіть бібліотеку за посиланням " +
              result.nativeLibraryInstallURL + " та оновіть сторінку";
            }

            return this.euSign.IsInitialized();
          })
          .then((result) => {
            if (result) {
              console.log("EndUser: already initialized");
              resolve();
              return;
            }

            console.log("EndUser: initializing...");
            return this.euSign.Initialize(this.euSettings)
          }).then((result) => {
          console.log("EndUser: initialized");
          resolve()
        })
          .catch(error => {
            console.log("EndUser: error"+error);
          });
      }
    })
  }


}
