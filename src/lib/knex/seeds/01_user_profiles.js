import faker from 'faker/locale/en';

const fakeData = [];
for (let i = 0; i < 500; i += 1) {
  const data = Math.random() > 0.15
    ? {
      email: faker.internet.email(),
      fullname: faker.name.findName(),
    }
    : {
      email: faker.internet.email(),
      fullname: faker.name.findName(),
      deleted_at: faker.date.past(),
    };
  fakeData.push(data);
}

export function seed(knex) {
  // Delete ALL existing entries from tables with foreign keys corresponding to user_profiles table
  // and from the user_profiles table itself
  return knex('user_logins').del()
    .then(() => knex('documents').del())
    .then(() => knex('user_profiles').del())
    // Insert seed entries
    .then(() => knex('user_profiles').insert(fakeData));
}
