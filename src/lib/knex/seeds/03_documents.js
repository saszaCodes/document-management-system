import faker from 'faker/locale/en';

const fakeData = [];
const numberOfEntries = 700;
for (let i = 0; i < numberOfEntries; i += 1) {
  const data = Math.random() > 0.3
    ? {
      title: faker.random.words(3),
      body: faker.lorem.paragraphs(5),
    }
    : {
      title: faker.random.words(3),
      body: faker.lorem.paragraphs(5),
      deleted_at: faker.date.past(),
    };
  fakeData.push(data);
}

export function seed(knex) {
  // Delete ALL existing entries from documents table
  return knex('documents').del()
    // Get ids from user_profiles table
    .then(() => {
      const userIds = knex.select('id').from('user_profiles');
      return userIds;
    })
    // Insert ids into fakeData object
    // (author_id entries can't be generated randomly by faker
    // because of foreign key constraint)
    .then((val) => {
      const numOfUsers = val.length;
      fakeData.forEach((el, index) => {
        // if there are more documents than users,
        // loop around user ids array
        el.author_id = val[index % numOfUsers].id;
      });
    })
    // Insert seed entries
    .then(() => knex('documents').insert(fakeData));
}
