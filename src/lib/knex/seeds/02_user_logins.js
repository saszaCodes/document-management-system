import faker from 'faker/locale/en';

const fakeData = [];
const numberOfEntries = 500;
for (let i = 0; i < numberOfEntries; i += 1) {
  const data = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    last_login: faker.datatype.datetime(),
  };
  fakeData.push(data);
}

export function seed(knex) {
  // Delete ALL existing entries from user_logins table
  return knex('user_logins').del()
    // Get ids from user_profiles table
    .then(() => {
      const userIds = knex.select('id').from('user_profiles');
      return userIds;
    })
    // Insert ids into fakeData object
    // (user_profile_id entries can't be generated randomly by faker
    // because of foreign key constraint)
    .then((val) => {
      if (numberOfEntries !== val.length) {
        throw new Error('You are trying to create different number of entries there are entries in user_profiles. This is not allowed.');
      } else {
        fakeData.forEach((el, index) => {
          el.user_profile_id = val[index].id;
        });
      }
    })
    // Insert seed entries
    .then(() => knex('user_logins').insert(fakeData));
}
