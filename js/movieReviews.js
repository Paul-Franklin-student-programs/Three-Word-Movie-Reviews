// Select headers to include in the table
const includedLowHeaders = ["title", "review", "letter grade", "year", "runtime", "director", "genre", "rotten tomatoes score", "oscars won"];

const includedCapHeaders = ["Title", "Review", "Grade", "Year", "Runtime", "Director", "Most Relevant Genre", "Rotten Tomatoes Score", "Oscars Won"]

// Get a reference to the container where the table will be injected
const container = document.getElementById("movie-table-container");

// Function to build the HTML table and inject it into the DOM
function buildTable(data) {
  const table = document.createElement("table"); // Creating the table in memory
  const thead = table.createTHead();
  const tbody = table.createTBody();

  // Build table headers
  const headerRow = thead.insertRow();
  includedCapHeaders.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  // Populate table rows with data
  data.films.forEach(film => {
    const row = tbody.insertRow();
    includedLowHeaders.forEach(header => {
      const cell = row.insertCell();
      cell.textContent = film[header] || "N/A"; // Add N/A if the data is missing
    });
  });

  // Inject table into the HTML
  container.appendChild(table);
}

// Fetch JSON data from an external file and build the table
fetch("movies.json")
  .then(response => response.json())
  .then(data => buildTable(data))
  .catch(error => console.error("Error loading JSON data:", error));
