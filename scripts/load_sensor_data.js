function load_sensor_data() {
  var sensor_id;
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == "sensor_id")
      {
          sensor_id = sParameterName[1];
      }
  }
  document.getElementById("table_content").innerHTML = "parsing url...";
  //var URL = require("./api-url.js").url;
  //var request = URL + "?sensor_id=original-things-uno";
  var request = "https://api.snacks.charlottetown.ca/v1/data?sensor_id="+sensor_id;
  document.getElementById("table_content").innerHTML = request;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', request, true);
  //xhr.send({sensor_id:"original-things-uno"});
  xhr.send();
  xhr.onreadystatechange = processRequest;
  function processRequest(e)
  {
    if (xhr.readyState == 4 && xhr.status == 200)
    {
      //var table = buildHtmlTable(xhr.responseText);
      //document.getElementById("table_content").innerHTML = table;
      var data = JSON.parse(xhr.responseText);
      var col = [];
      for (var i = 0; i < data.length; i++) {
          for (var key in data[i]) {
              if (col.indexOf(key) === -1) {
                  col.push(key);
              }
          }
      }
      document.getElementById("table_content").innerHTML = "calculating columns...";

      // CREATE DYNAMIC TABLE.
      var table = document.createElement("table");

      document.getElementById("table_content").innerHTML = "creating table...";
      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

      var tr = table.insertRow(-1);                   // TABLE ROW.

      document.getElementById("table_content").innerHTML = "...";
      for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");      // TABLE HEADER.
          th.innerHTML = col[i];
          tr.appendChild(th);
      }

      document.getElementById("table_content").innerHTML = "adding data to rows...";

      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (var i = 0; i < data.length; i++) {

          tr = table.insertRow(-1);

          for (var j = 0; j < col.length; j++) {
              var tabCell = tr.insertCell(-1);
              tabCell.innerHTML = data[i][col[j]];
          }
      }

      document.getElementById("table_content").innerHTML = "Creating container...";
      // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
      var divContainer = document.getElementById("table_content");
      divContainer.innerHTML = "";
      divContainer.appendChild(table);
    }
    else
    {
      document.getElementById("table_content").innerHTML = "Please connect to the internet "+xhr.status.toString();
    }
  }
}

window.onload = load_sensor_data;
