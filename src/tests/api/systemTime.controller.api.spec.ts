import { SystemTimeController } from '../../modules/systemTime/systemTime.controller';

describe('SystemTimeController (API controller unit tests)', () => {
  it('getServerTime returns service output', () => {
    const service = { getServerTime: jest.fn().mockReturnValue({ now: '2026-01-01' }) };
    const controller = new SystemTimeController(service as any);

    expect(controller.getServerTime()).toEqual({ now: '2026-01-01' });
    expect(service.getServerTime).toHaveBeenCalled();
  });
});
