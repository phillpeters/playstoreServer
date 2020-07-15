const supertest = require(`supertest`);
const expect = require(`chai`).expect;
const app = require(`../app`);

describe(`GET /apps`, () => {
  it(`it should return an array of apps`, () => {
    return supertest(app)
      .get(`/apps`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys(
          `App`, `Category`, `Rating`, `Reviews`, `Size`, `Installs`, `Type`, `Price`,
          `Content Rating`, `Genres`, `Last Updated`, `Current Ver`, `Android Ver`
        );
      });
  });

  it(`should return 400 if genre is incorrect`, () => {
    return supertest(app)
      .get(`/apps`)
      .query({ genre: `MISTAKE` })
      .expect(400, `Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card`);
  });

  it(`should return 400 if sort is incorrect`, () => {
    return supertest(app)
      .get(`/apps`)
      .query({ sort: `MISTAKE` })
      .expect(400, `Sort must be one of rating or app`);
  });

  it(`should sort by rating`, () => {
    return supertest(app)
      .get(`/apps`)
      .query({ sort: `rating` })
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then(res => {
        expect(res.body).to.be.an(`array`);
        let sorted = true;
        for (let i = 0; i < res.body.length - 1; i++) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.rating < appAtI.rating) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it(`should sort by app`, () => {
    return supertest(app)
      .get(`/apps`)
      .query({ sort: `app` })
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then(res => {
        expect(res.body).to.be.an(`array`);
        let sorted = true;
        for (let i = 0; i < res.body.length - 1; i++) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.app < appAtI.app) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });
});