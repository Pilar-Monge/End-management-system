import type { CreateAdmissionRequestDTO } from './admissionRequest.model';

export type AdmissionFeatureVector = {
  age_years: number;
  health_level_score: number;
  physical_condition_score: number;
  experience_years: number;
  skills_score: number;
};

type AdmissionFeatureInput = Pick<
  CreateAdmissionRequestDTO,
  | 'name'
  | 'lastName1'
  | 'lastName2'
  | 'email'
  | 'desiredUsername'
  | 'birthDate'
  | 'photoUrl'
  | 'declaredHealthLevel'
  | 'previousExperience'
  | 'physicalCondition'
  | 'declaredSkills'
  | 'healthLevelScore'
  | 'physicalConditionScore'
  | 'experienceYears'
  | 'skillsScore'
>;

export function buildAdmissionFeatures(input: AdmissionFeatureInput): AdmissionFeatureVector {
  const ageYears = calculateAgeYears(input.birthDate);
  const healthLevelScore =
    input.healthLevelScore ?? scoreHealthLevel(input.declaredHealthLevel ?? null);
  const physicalConditionScore =
    input.physicalConditionScore ?? scorePhysicalCondition(input.physicalCondition ?? null);
  const experienceYears =
    input.experienceYears ?? extractExperienceYears(input.previousExperience ?? null);
  const skillsScore = input.skillsScore ?? scoreSkills(input.declaredSkills ?? null);

  return {
    age_years: ageYears,
    health_level_score: clampInt(healthLevelScore, 0, 10),
    physical_condition_score: clampInt(physicalConditionScore, 0, 10),
    experience_years: clampInt(experienceYears, 0, 60),
    skills_score: clampInt(skillsScore, 0, 10),
  };
}

function calculateAgeYears(birthDate: Date): number {
  const now = new Date();
  const b = new Date(birthDate);
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - b.getUTCMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < b.getUTCDate())) {
    age -= 1;
  }

  return Math.max(0, age);
}

function scoreHealthLevel(value: string | null): number {
  const t = normalizeText(value);

  if (hasAny(t, ['infected', 'bite', 'sepsis', 'critical', 'coma', 'necrosis'])) return 1;
  if (hasAny(t, ['severe', 'high fever', 'respiratory', 'chronic uncontrolled'])) return 3;
  if (hasAny(t, ['moderate', 'under treatment', 'stable'])) return 6;
  if (hasAny(t, ['good', 'healthy', 'no symptoms', 'fit', 'excellent'])) return 8;

  return 5;
}

function scorePhysicalCondition(value: string | null): number {
  const t = normalizeText(value);

  if (hasAny(t, ['immobile', 'cannot walk', 'severe injury', 'fracture', 'bedridden'])) return 1;
  if (hasAny(t, ['limited mobility', 'recovering', 'weak'])) return 4;
  if (hasAny(t, ['average', 'moderate', 'acceptable'])) return 6;
  if (hasAny(t, ['athletic', 'strong', 'endurance', 'excellent'])) return 9;

  return 5;
}

function extractExperienceYears(value: string | null): number {
  const t = normalizeText(value);
  const match = t.match(/(\d{1,2})\s*(years|year|ano|anos|a\u00f1o|a\u00f1os)/);
  const yearsText = match?.[1];
  if (yearsText) return Number.parseInt(yearsText, 10);

  if (hasAny(t, ['none', 'no experience', 'novice', 'beginner'])) return 0;
  if (hasAny(t, ['basic', 'some experience'])) return 2;
  if (hasAny(t, ['advanced', 'expert', 'veteran'])) return 8;

  return 1;
}

function scoreSkills(value: string | null): number {
  const t = normalizeText(value);
  if (!t) return 0;

  let score = 2;
  const criticalSkills = [
    'medic',
    'nurse',
    'doctor',
    'mechanic',
    'engineer',
    'hunter',
    'security',
    'farmer',
    'logistics',
    'cook',
    'radio',
  ];

  for (const skill of criticalSkills) {
    if (t.includes(skill)) score += 1;
  }

  const commaCount = (t.match(/,/g) ?? []).length;
  if (commaCount >= 3) score += 1;

  return clampInt(score, 0, 10);
}

function hasAny(text: string, keys: string[]): boolean {
  return keys.some((k) => text.includes(k));
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').toLowerCase().trim();
}

function clampInt(value: number, min: number, max: number): number {
  const n = Number.isNaN(value) ? min : Math.round(value);
  return Math.max(min, Math.min(max, n));
}
