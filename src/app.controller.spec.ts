import { AppController } from './app.controller';

describe('AppController', () => {
  it('returns API running message', () => {
    const controller = new AppController();

    expect(controller.getRoot()).toEqual({ message: 'API running' });
  });
});