import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';

type BaseCampUser = {
  username: string;
  email: string;
  identificationNumber: string;
  role: 'SYSTEM_ADMIN' | 'WORKER' | 'RESOURCE_MANAGEMENT' | 'TRAVEL_MANAGER' | 'VISITOR';
};

export async function runSeeder(dataSource: DataSource): Promise<void> {
  const existingCampRows = await dataSource.query('SELECT id FROM camp LIMIT 1');

  if (existingCampRows.length > 0) {
    console.log('[seeder] Skipped: camps already exist.');
    return;
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const passwordHash = await hash('Seed1234!', 10);
    const campNames = [
      'Alpha Bunker',
      'Sierra Base',
      'Delta Refuge',
      'Omega Fortress',
      'Echo Outpost',
    ];

    for (let index = 0; index < campNames.length; index += 1) {
      const campNumber = index + 1;

      const insertedCamp = await queryRunner.query(
        `
          INSERT INTO camp (
            name,
            foundation_date,
            session_inactivity_minutes,
            status,
            latitude,
            longitude
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `,
        [campNames[index], '2024-01-01', 20, 'ACTIVE', 9.934739, -84.087502],
      );

      const campId: number = insertedCamp[0].id;

      const usersForCamp: BaseCampUser[] = [
        {
          username: `admin_camp${campNumber}`,
          email: `admin@camp${campNumber}.com`,
          identificationNumber: `10000000${campNumber}`,
          role: 'SYSTEM_ADMIN',
        },
      ];

      if (campNumber === 1) {
        usersForCamp.push(
          {
            username: 'worker_camp1',
            email: 'worker@camp1.com',
            identificationNumber: '200000001',
            role: 'WORKER',
          },
          {
            username: 'resource_camp1',
            email: 'resource@camp1.com',
            identificationNumber: '200000002',
            role: 'RESOURCE_MANAGEMENT',
          },
          {
            username: 'travel_camp1',
            email: 'travel@camp1.com',
            identificationNumber: '200000003',
            role: 'TRAVEL_MANAGER',
          },
          {
            username: 'visitor_camp1',
            email: 'visitor@camp1.com',
            identificationNumber: '200000004',
            role: 'VISITOR',
          },
        );
      }

      for (const userData of usersForCamp) {
        const insertedRequest = await queryRunner.query(
          `
            INSERT INTO admission_request (
              name,
              last_name1,
              email,
              desired_username,
              birth_date,
              gender,
              status,
              camp_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `,
          [
            'Camp',
            'Admin',
            userData.email,
            userData.username,
            '1990-01-01',
            'MALE',
            'APPROVED',
            campId,
          ],
        );

        const requestId: number = insertedRequest[0].id;

        const insertedPerson = await queryRunner.query(
          `
            INSERT INTO person (
              name,
              last_name1,
              identification_number,
              birth_date,
              gender,
              current_status,
              camp_id,
              admission_request_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `,
          [
            'Camp',
            'Admin',
            userData.identificationNumber,
            '1990-01-01',
            'MALE',
            'ACTIVE',
            campId,
            requestId,
          ],
        );

        const personId: number = insertedPerson[0].id;

        await queryRunner.query(
          `
            INSERT INTO "system_user" (
              username,
              email,
              password_hash,
              role,
              status,
              camp_id,
              person_id,
              request_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
          [
            userData.username,
            userData.email,
            passwordHash,
            userData.role,
            'ACTIVE',
            campId,
            personId,
            requestId,
          ],
        );
      }
    }

    await queryRunner.commitTransaction();
    console.log('[seeder] Completed: initial camps and users were inserted.');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('[seeder] Failed: transaction rolled back.');
    throw error;
  } finally {
    await queryRunner.release();
  }
}
