import { ResolveFn } from '@angular/router';

export const overviewResolver: ResolveFn<boolean> = (route, state) => {
  console.log('overviewResolver', route, state);
  return true;
};
