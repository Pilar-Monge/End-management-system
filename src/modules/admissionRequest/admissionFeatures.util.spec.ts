import { buildAdmissionFeatures } from './admissionFeatures.util';
import type { CreateAdmissionRequestDTO } from './admissionRequest.model';

describe('buildAdmissionFeatures', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-26T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const baseInput: CreateAdmissionRequestDTO = {
    name: 'John',
    lastName1: 'Doe',
    email: 'john@example.com',
    desiredUsername: 'johnny',
    birthDate: new Date('2000-05-01T00:00:00.000Z'),
    gender: 'MALE',
    campId: 1,
  };

  it('derives all features from text fields when scores are missing', () => {
    const result = buildAdmissionFeatures({
      ...baseInput,
      declaredHealthLevel: 'Healthy and fit with no symptoms',
      physicalCondition: 'Athletic with excellent endurance',
      previousExperience: '3 years in field operations',
      declaredSkills: 'medic, engineer, logistics, cook',
    });

    expect(result).toEqual({
      age_years: 25,
      health_level_score: 8,
      physical_condition_score: 9,
      experience_years: 3,
      skills_score: 7,
    });
  });

  it('uses explicit numeric values and clamps out-of-range values', () => {
    const result = buildAdmissionFeatures({
      ...baseInput,
      healthLevelScore: 19,
      physicalConditionScore: -3,
      experienceYears: 72,
      skillsScore: Number.NaN,
    });

    expect(result).toEqual({
      age_years: 25,
      health_level_score: 10,
      physical_condition_score: 0,
      experience_years: 60,
      skills_score: 0,
    });
  });

  it('detects experience years from common keywords when numeric pattern is absent', () => {
    const none = buildAdmissionFeatures({ ...baseInput, previousExperience: 'no experience' });
    const basic = buildAdmissionFeatures({ ...baseInput, previousExperience: 'basic knowledge' });
    const advanced = buildAdmissionFeatures({
      ...baseInput,
      previousExperience: 'advanced veteran profile',
    });

    expect(none.experience_years).toBe(0);
    expect(basic.experience_years).toBe(2);
    expect(advanced.experience_years).toBe(8);
  });

  it('defaults to neutral values for unknown descriptors', () => {
    const result = buildAdmissionFeatures({
      ...baseInput,
      declaredHealthLevel: 'unclear state',
      physicalCondition: 'noisy wording',
      previousExperience: 'random text',
      declaredSkills: null,
    });

    expect(result.health_level_score).toBe(5);
    expect(result.physical_condition_score).toBe(5);
    expect(result.experience_years).toBe(1);
    expect(result.skills_score).toBe(0);
  });
});
