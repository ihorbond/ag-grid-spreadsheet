import { TestBed } from '@angular/core/testing';

import { ListedPropertyTypeService } from './listed-property-type.service';

describe('ListedPropertyTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListedPropertyTypeService = TestBed.get(ListedPropertyTypeService);
    expect(service).toBeTruthy();
  });
});
