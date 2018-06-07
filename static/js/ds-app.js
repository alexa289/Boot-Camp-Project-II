// Set all references to the elements of the DOM
var $tbody = document.querySelector("tbody");
var $titleInput = document.querySelector("#title");
var $pointsInput = document.querySelector("#points");
var $priceInput = document.querySelector("#price");
var $varietyInput = document.querySelector('#variety');
var $countryInput = document.querySelector("#country");
var $twitterInput = document.querySelector("#twitter_handle");
var $searchBtn = document.querySelector("#search");
var $recordCounter = document.querySelector("#recordCounter");
var $pages = document.querySelector("#pages");
var $loadBtn = document.querySelector("#load");
var $nextBtn = document.querySelector("#next");
var $prevBtn = document.querySelector("#prev");

// Create addEventListeners on each click
$searchBtn.addEventListener("click", handleSearchButtonClick);
$loadBtn.addEventListener("click", handleReloadButtonClick);
$nextBtn.addEventListener("click", handleNextButtonClick);
$prevBtn.addEventListener("click", handlePrevButtonClick);
$pages.addEventListener("change", handlePagesChange);

// Initialize  variables
var filteredData = dataSet;
var resetData = dataSet;
var count = 0;

// Create Event handler functions
// Set handleNextButtonClick to increment per count and render the Table
function handleNextButtonClick() {
    count++;
    renderTable();
}
// Set handlePrevButtonClick decrements per count and render the Table
function handlePrevButtonClick() {
    count--;
    renderTable();
}

// Set handlePagesChange to render table when new record count is selected
function handlePagesChange() {
    renderTable();
}

// handleSearchButtonClick handles search button click:
//    cleans input data by trimming blanks

function handleSearchButtonClick() {
    var filterTitle = $titleInput.value.trim();
    var filterPoints = $pointsInput.value.trim();
    var filterPrice = $priceInput.value.trim();
    var filterVariety = $varietyInput.value.trim().toLowerCase();
    var filterCountry = $countryInput.value.trim().toLowerCase();
    var filterTwitter = $twitterInput.value.trim();

//    check for non-empty search fields and add dataSet to filter

    if (filterTitle != "") {
        filteredData = dataSet.filter(function (data) {
        var dataTitle = data.title;
        return dataTitle === filterTitle;
    });

    };

    if (filterPoints != "") {
        filteredData = dataSet.filter(function (data) {
        var dataPoints = data.points;
        return dataPoints >= filterPoints;
    });
    };

    if (filterPrice != "") {
        filteredData = dataSet.filter(function (data) {
            var dataPrice = data.price;
            return dataPrice <= filterPrice;
        });
    };

    if (filterVariety != "") {
        filteredData = dataSet.filter(function (data) {
            var dataVariety = data.variety.toLowerCase();
            return dataVariety === filterVariety;
        });
    };


    if (filterCountry != "") {
        filteredData = dataSet.filter(function (data) {
            var dataCountry = data.country.toLowerCase();
            return dataCountry === filterCountry;
        });
    };

    if (filterTwitter != "") {
        filteredData = dataSet.filter(function (data) {
            var dataTwitter = data.taster_twitter_handle;
            return dataTwitter === filterTwitter;
        });
    };

// render the table
    renderTable();
};

// handleReloadButtonClick 
function handleReloadButtonClick() {
    //reset count
    count = 0;
    //empty value when reload page
    filteredData = dataSet;
    $titleInput.value = '';
    $pointsInput.value = '';
    $priceInput.value = '';
    $varietyInput.value = '';
    $countryInput.value = '';
    $twitterInput.value = '';
    
// render table
    renderTable();
}

// define function to reload page
function resetForm() {
    document.getElementById("#WineForm").reset();
}

renderTable();

// Create function to renderTable 
function renderTable() {
    // set previously rendered table to blank
    $tbody.innerHTML = "";

    // Get number of records to be rendered by defining the #pages
    var pages = Number(document.getElementById("pages").value);

    // Initialize start/end variables
    var start = count * pages + 1;
    var end = start + pages - 1;
    //create lpaceholder for button
    var btn;

    // Set the records to be displayed for end of data and state of the Next>>> button
    if (end > filteredData.length) {
      end = filteredData.length;
      btn = document.getElementById("next");
      btn.disabled = true;
    }
    else {
      btn = document.getElementById("next");
      btn.disabled = false;
    }

    // Set the records to be displayed for <<<Previous button
    if (start == 1) {
      btn = document.getElementById("prev");
      btn.disabled = true;
    }
    else {
      btn = document.getElementById("prev");
      btn.disabled = false;
    }

    // Display record counts and load records into table by filtering the dataSet
    $recordCounter.innerText = "From Record: " + start + " to: " + end + " of " + filteredData.length;
    // Loop through rows to load the number of records to be specified
    for (var i = 0; i < pages; i++) {
        var item = filteredData[i+(count * pages)];
        var fields = Object.keys(item);
        var $row = $tbody.insertRow(i);
        // Loop through fields to inset new cells for specified records
        for (var j = 0; j < fields.length; j++) {
            var field = fields[j];
            var $cell = $row.insertCell(j);
            $cell.innerText = item[field];
        }
    }
}
        //Define local varialbles
        var index;      // cell index
        var toggleBool; // sorting asc, desc 
        
        //Define sorting function
        function sorting(tbody, index) {
            this.index = index;
            if (toggleBool) {
                toggleBool = false;
            } else {
                toggleBool = true;
            };

            var datas = new Array();
            var tbodyLength = tbody.rows.length;
            for (var i = 0; i < tbodyLength; i++) {
                datas[i] = tbody.rows[i];
            };

        // sort by cell[index] 
        datas.sort(compareCells);
            for (var i = 0; i < tbody.rows.length; i++) {
                // rearrange table rows by sorted rows
                tbody.appendChild(datas[i]);
            };
        };

        //compare cells by index
        function compareCells(a, b) {
            var aVal = a.cells[index].innerText;
            var bVal = b.cells[index].innerText;

            aVal = aVal.replace(/\,/g, '');
            bVal = bVal.replace(/\,/g, '');

            if (toggleBool) {
                var temp = aVal;
                aVal = bVal;
                bVal = temp;
            };

            if (aVal.match(/^[0-9]+$/) && bVal.match(/^[0-9]+$/)) {
                return parseFloat(aVal) - parseFloat(bVal);
            }
            else {
                if (aVal < bVal) {
                    return -1;
                } else if (aVal > bVal) {
                    return 1;
                } else {
                    return 0;
                };
            };
        };

// Provides initial render on open
renderTable();

