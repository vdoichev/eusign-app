import {CASettings} from "euscp/EndUserSettings";

export let CAs: { cmpCompatibility: number; address: string; cmpAddress: string; directAccess: boolean; tspAddressPort: string; qscdSNInCert: boolean; ocspAccessPointAddress: string; tspAddress: string; ocspAccessPointPort: string; issuerCNs: string[]; certsInKey: boolean }[];
CAs = [{
  "issuerCNs": ["КНЕДП ДПС",
    "КНЕДП ІДД ДПС",
    "КНЕДП - ІДД ДПС",
    "Акредитований центр сертифікації ключів ІДД ДФС",
    "Акредитований центр сертифікації ключів ІДД Міндоходів",
    "Акредитований центр сертифікації ключів ІДД ДПС"],
  "address": "acskidd.gov.ua",
  "ocspAccessPointAddress": "acskidd.gov.ua/services/ocsp/",
  "ocspAccessPointPort": "80",
  "cmpAddress": "acskidd.gov.ua",
  "tspAddress": "acskidd.gov.ua",
  "tspAddressPort": "80",
  "directAccess": true,
  "certsInKey": false,
  "cmpCompatibility": 0,
  "qscdSNInCert": false,
}];
