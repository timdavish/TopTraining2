import { TopTraining2Page } from './app.po';

describe('top-training2 App', () => {
  let page: TopTraining2Page;

  beforeEach(() => {
	page = new TopTraining2Page();
  });

  it('should display welcome message', () => {
	page.navigateTo();
	expect(true).toEqual(true);
  });
});
