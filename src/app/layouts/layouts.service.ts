import { Injectable } from '@angular/core';

/**
 * The LayoutsService is responsible for managing the layout of the application.
 * It provides methods to get the current layout and to set a new layout.
 */
@Injectable({
  providedIn: 'root',
})
export class LayoutsService {
  #header = { visible: true };
  #footer = { visible: true };
  #sider = { visible: true };
  get header() {
    return this.#header;
  }
  get footer() {
    return this.#footer;
  }
  get sider() {
    return this.#sider;
  }
  constructor() {}
}
