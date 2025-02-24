// Headers used for table and JSON mapping
const includedLowHeaders = ["title", "review", "letter grade", "year", "runtime", "director", "genre", "rotten tomatoes score", "oscars won"];
const includedCapHeaders = ["Title", "Review", "Grade", "Year", "Runtime", "Director", "Most Relevant Genre", "Rotten Tomatoes Score", "Oscars Won"];

// Get references to key UI elements
const container = document.getElementById("movie-table-container");
const sortSelect = document.getElementById("sort-select");

let movieData = []; // Stores the JSON movie data
let currentSortColumn = null;
let currentSortOrder = "asc"; // Default sorting order

// Function to build the table dynamically
function buildTable(data) {
    // Save reference to the currently active column before rebuilding
    const activeColumn = document.querySelector("th.active-sort")?.dataset.column;

    // Clear existing table
    container.innerHTML = "";

    const table = document.createElement("table");
    const thead = table.createTHead();
    const tbody = table.createTBody();

    // Build table headers
    const headerRow = thead.insertRow();
    includedCapHeaders.forEach((header, index) => {
        const th = document.createElement("th");
        th.textContent = header;
        th.dataset.column = includedLowHeaders[index];

        th.classList.add("default-sort");

        // Restore active class if it's the selected column
        if (th.dataset.column === activeColumn) {
            th.classList.remove("default-sort");
            th.classList.add("active-sort");
        }

        // Click event for sorting
        th.addEventListener("click", () => {
            toggleSort(th.dataset.column, th);
        });

        headerRow.appendChild(th);
    });

    // Populate table rows
    data.forEach(film => {
        const row = tbody.insertRow();
        includedLowHeaders.forEach(header => {
            const cell = row.insertCell();
            cell.textContent = film[header] || "N/A"; // Default to N/A if missing data
        });
    });

    container.appendChild(table);
}

// Function to toggle sorting of columns
function toggleSort(column, clickedHeader) {

    const headers = document.querySelectorAll("th");


        headers.forEach(th => {
            th.classList.remove("active-sort", "default-sort");  // Remove active class from all
            th.classList.add("default-sort");    // Ensure default style is applied
        });




        // Apply active class only to the clicked column
        clickedHeader.classList.remove("default-sort");  // Remove default color
        clickedHeader.classList.add("active-sort");      // Highlight selected column


    // Determine sorting order
    if (currentSortColumn === column) {
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    } else {
        currentSortColumn = column;
        currentSortOrder = "asc";
    }

    const gradeValues = {
        "A+": 13, "A": 12, "A-": 11,
        "B+": 10, "B": 9, "B-": 8,
        "C+": 7, "C": 6, "C-": 5,
        "D+": 4, "D": 3, "D-": 2,
        "F": 1
    };

    // Sort movie data
    movieData.sort((a, b) => {
        let valA = a[column] || "";
        let valB = b[column] || "";

        if (column === "letter grade") {
            valA = gradeValues[valA];
            valB = gradeValues[valB];
        }

        if (column === "rotten tomatoes score") {
            valA = valA.replace("%", "");
            valB = valB.replace("%", "");
        }

        if (column === "runtime") {
          valA = valA.replace(" minutes", "");
          valB = valB.replace(" minutes", "");
        }


        // Convert numbers for numerical sorting
        if (!isNaN(valA) && !isNaN(valB)) {
            valA = Number(valA);
            valB = Number(valB);
        } else {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
        }

        return currentSortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    buildTable(movieData);
}



// Function to handle dropdown sorting
function handleDropdownSort() {
    const selectedColumn = sortSelect.value;
    if (!selectedColumn) return;

    // Toggle sort order when selecting the same column again
    if (currentSortColumn === selectedColumn) {
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    } else {
        currentSortColumn = selectedColumn;
        currentSortOrder = "asc";
    }

    const clickedHeader = document.querySelector(`[data-column="${selectedColumn}"]`);
    if (clickedHeader) {
        toggleSort(selectedColumn, clickedHeader);
    }
}

// Event listener
sortSelect.addEventListener("change", handleDropdownSort);

// Fetch JSON data and build the table initially
fetch("movies.json")
    .then(response => response.json())
    .then(data => {
        movieData = data.films;
        buildTable(movieData);
    })
    .catch(error => console.error("Error loading JSON data:", error));
