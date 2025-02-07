// Headers used for table and JSON mapping
const includedLowHeaders = ["title", "review", "letter grade", "year", "runtime", "director", "genre", "rotten tomatoes score", "oscars won"];
const includedCapHeaders = ["Title", "Review", "Grade", "Year", "Runtime", "Director", "Most Relevant Genre", "Rotten Tomatoes Score", "Oscars Won"];

// Get references to key UI elements
const container = document.getElementById("movie-table-container");
const searchBox = document.getElementById("search-box");
const sortSelect = document.getElementById("sort-select");

let movieData = []; // Stores the JSON movie data
let currentSortColumn = null;
let currentSortOrder = "asc"; // Default sorting order

// Function to build the table dynamically
function buildTable(data) {
    // Clear existing table if any
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

        // Create sorting arrow icon
        const icon = document.createElement("span");
        icon.classList.add("sort-icon");
        icon.innerHTML = "▲"; // Default up arrow
        th.appendChild(icon);

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

    // Reset all headers except the clicked one
    headers.forEach(th => {
        th.classList.remove("active-sort");
        th.style.backgroundColor = "#F4A460"; // Reset to peach color
        th.querySelector(".sort-icon").innerHTML = "▲"; // Reset arrows
    });

    // Determine sorting order
    if (currentSortColumn === column) {
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    } else {
        currentSortColumn = column;
        currentSortOrder = "asc";
    }

    // Apply active sorting style
    clickedHeader.classList.add("active-sort");
    clickedHeader.style.backgroundColor = "#ADD8E6"; // Baby blue when active
    clickedHeader.querySelector(".sort-icon").innerHTML = currentSortOrder === "asc" ? "▼" : "▲"; // Flip arrow

    // Sort movie data
    movieData.sort((a, b) => {
        let valA = a[column] || "";
        let valB = b[column] || "";

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

// Function to filter table based on search input
function filterTable() {
    const searchTerm = searchBox.value.toLowerCase();
    const filteredMovies = movieData.filter(film =>
        includedLowHeaders.some(header =>
            (film[header] || "").toLowerCase().includes(searchTerm)
        )
    );
    buildTable(filteredMovies);
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

// Event listeners
searchBox.addEventListener("input", filterTable);
sortSelect.addEventListener("change", handleDropdownSort);

// Fetch JSON data and build the table initially
fetch("movies.json")
    .then(response => response.json())
    .then(data => {
        movieData = data.films;
        buildTable(movieData);
    })
    .catch(error => console.error("Error loading JSON data:", error));
