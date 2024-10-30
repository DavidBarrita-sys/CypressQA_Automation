/**
 * Endpoint: https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
 * Propósito: Validar la API para identificar posibles [bugs] 
 * Parámetros de consulta:
 *  - year: Año de la temporada (ej., 2024)
 *  - week: Semana de la temporada (ej., 1, 2, 3, ...)
 * Ejemplo: ?dates={year}&seasontype=2&week={week}
 */


describe('NFL Scoreboard API Tests', () => {
  const baseUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
  /**
 * Valida los resultados en la sección de eventos para las semanas 1 a 18 del año 2023.
 * Requisitos:
 *  - Cada registro debe contar con 2 equipos en el campo "competitors".
 *  - Cada equipo debe tener un puntaje (score) mayor o igual a 0.
 */
  it('Valida los resultados de eventos para las semanas 1 a 18 en 2023', () => {
    for (let week = 1; week <= 18; week++) {
      cy.request(`${baseUrl}?dates=2023&seasontype=2&week=${week}`).then((response) => {
        expect(response.status).to.eq(200);
        const events = response.body.events;

        expect(events).to.not.be.empty;

        events.forEach((event) => {
         
          expect(event.competitions[0].competitors).to.have.length(2);

          event.competitions[0].competitors.forEach((team) => {
            
            expect(parseInt(team.score)).to.be.gte(0);
          });
        });
      });
    }
  });

  it('Cada equipo tenga 17 partidos al finalizar el año 2023', () => {
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
      Object.values(teams).forEach((games) => {
        expect(games).to.eq(17);
      });
    });
  });

  it('No existan eventos/partidos desde la semana 19', () => {
    cy.request(`${baseUrl}?dates=2023&seasontype=2&week=19`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.events).to.be.empty;
    });
  });
});
