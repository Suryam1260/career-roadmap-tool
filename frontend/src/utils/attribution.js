import { getDeviceType } from './platform';

class Attribution {
  constructor() {
    this._platform = 'mobile';
    this._product = 'homepage';
    this._experiment = '';
    this._attribution = {
      experiment: this._experiment,
      intent: '',
      platform: this._platform,
      product: this._product,
      program: null
    };
  }

  getAttribution() {
    return this.attribution;
  }

  setAttribution(intent, { program = null, ...data } = {}) {
    this.attribution = {
      ...this._attribution,
      intent,
      program,
      ...data
    };
  }

  setPlatform() {
    this._platform = getDeviceType();
  }

  setProduct(product) {
    this._product = product;
  }

  get attribution() {
    return this._attribution;
  }

  set attribution(attributes) {
    this._attribution = {
      ...attributes,
      experiment: this._experiment,
      platform: this._platform,
      product: this._product
    };
  }

  get experiment() {
    return this._experiment;
  }

  set experiment(experiment) {
    this._experiment = experiment;
  }

  get platform() {
    return this._platform;
  }

  get product() {
    return this._product;
  }
}

const attribution = new Attribution();
export default attribution;


