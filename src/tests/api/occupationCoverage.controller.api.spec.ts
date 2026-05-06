import { BadRequestException } from '@nestjs/common';
import { OccupationCoverageController } from '../../modules/occupationCoverage/occupationCoverage.controller';

describe('OccupationCoverageController (API controller unit tests)', () => {
  let service: any;
  let controller: OccupationCoverageController;

  const makeReq = (userId = 1) => ({ user: { userId } } as any);

  beforeEach(() => {
    service = {
      getCoverageByCamp: jest.fn(),
      getCoverageById: jest.fn(),
      getCriticalOccupations: jest.fn(),
      getOccupationsAtRisk: jest.fn(),
      getSuggestedReplacements: jest.fn(),
      autoAssignReplacement: jest.fn(),
    };
    controller = new OccupationCoverageController(service);
  });

  it('getCoverageByCamp returns service data', async () => {
    service.getCoverageByCamp.mockResolvedValue([{ id: 1 }]);
    await expect(controller.getCoverageByCamp('5')).resolves.toEqual([{ id: 1 }]);
  });

  it('getCoverageById returns service data', async () => {
    service.getCoverageById.mockResolvedValue({ id: 2 });
    await expect(controller.getCoverageById('5', '2')).resolves.toEqual({ id: 2 });
  });

  it('getCriticalOccupations returns service data', async () => {
    service.getCriticalOccupations.mockResolvedValue([{ id: 3 }]);
    await expect(controller.getCriticalOccupations('5')).resolves.toEqual([{ id: 3 }]);
  });

  it('getOccupationsAtRisk returns service data', async () => {
    service.getOccupationsAtRisk.mockResolvedValue([{ id: 4 }]);
    await expect(controller.getOccupationsAtRisk('5')).resolves.toEqual([{ id: 4 }]);
  });

  it('getSuggestedReplacements returns service data', async () => {
    service.getSuggestedReplacements.mockResolvedValue([{ id: 9 }]);
    await expect(controller.getSuggestedReplacements('5', '3')).resolves.toEqual([{ id: 9 }]);
  });

  it('autoAssignReplacement returns service result', async () => {
    service.autoAssignReplacement.mockResolvedValue({ success: true, message: 'ok' });
    const res = await controller.autoAssignReplacement('5', '3', makeReq(7));
    expect(service.autoAssignReplacement).toHaveBeenCalledWith(3, 5, 7);
    expect(res).toEqual({ success: true, message: 'ok' });
  });

  it('autoAssignReplacement rejects invalid user context', async () => {
    await expect(controller.autoAssignReplacement('5', '3', makeReq(0))).rejects.toThrow(
      BadRequestException,
    );
  });

  it('autoAssignReplacement wraps errors', async () => {
    service.autoAssignReplacement.mockRejectedValue(new Error('boom'));
    await expect(controller.autoAssignReplacement('5', '3', makeReq(1))).rejects.toThrow(
      BadRequestException,
    );
  });
});
