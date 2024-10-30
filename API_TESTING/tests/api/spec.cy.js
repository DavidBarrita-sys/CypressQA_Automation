// cypress/integration/api_tests/nfl_scoreboard_spec.js

describe('NFL Scoreboard API Tests', () => {
  const baseUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

  it('Validates event results for weeks 1 to 18 in 2023', () => {
    for (let week = 1; week <= 18; week++) {
      cy.request(`${baseUrl}?dates=2023&seasontype=2&week=${week}`).then((response) => {
        expect(response.status).to.eq(200);
        const events = response.body.events;

        // Check that there are events in the response
        expect(events).to.not.be.empty;

        events.forEach((event) => {
          // Each event should have 2 competitors
          expect(event.competitions[0].competitors).to.have.length(2);

          event.competitions[0].competitors.forEach((team) => {
            // Each competitor (team) should have a score >= 0
            expect(parseInt(team.score)).to.be.gte(0);
          });
        });
      });
    }
  });

  it('Validates each team has 17 games by the end of 2023', () => {
    const teamGames = {};

    for (let week = 1; week <= 18; week++) {
      cy.request(`${baseUrl}?dates=2023&seasontype=2&week=${week}`).then((response) => {
        const events = response.body.events;

        events.forEach((event) => {
          event.competitions[0].competitors.forEach((team) => {
            const teamId = team.id;

            if (!teamGames[teamId]) {
              teamGames[teamId] = 0;
            }
            teamGames[teamId] += 1;
          });
        });
      });
    }

    cy.wrap(teamGames).should((teams) => {
      // Check that each team played exactly 17 games
      Object.values(teams).forEach((games) => {
        expect(games).to.eq(17);
      });
    });
  });

  it('Ensures no events exist beyond week 18 for 2023', () => {
    cy.request(`${baseUrl}?dates=2023&seasontype=2&week=19`).then((response) => {
      expect(response.status).to.eq(200);
      // Ensure the events array is empty
      expect(response.body.events).to.be.empty;
    });
  });
});
