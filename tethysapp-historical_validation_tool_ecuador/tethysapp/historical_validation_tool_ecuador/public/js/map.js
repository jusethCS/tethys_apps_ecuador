// ------------------------------------------------------------------------------------------------------------ //
//                                          GLOBAL AND STATE VARIABLES                                          //
// ------------------------------------------------------------------------------------------------------------ //

// Server domain (DNS or IP:port)
const server = "http://localhost:8080";




// ------------------------------------------------------------------------------------------------------------ //
//                                              INITIALIZE THE MAP                                              //
// ------------------------------------------------------------------------------------------------------------ //

// Ajust the map to the window height
const height = $(window).height() - 50;
$("#map-container").height(height);

// Set the map container
var map = L.map("map-container", {
    zoomControl: false,
}).setView([-1.7, -83.6], 7);

// Add the base map
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Add the zoom control
L.control.zoom({ 
    position: "bottomright"
}).addTo(map);





// ------------------------------------------------------------------------------------------------------------ //
//                                     COLOR MARKER ACCORDING TO THE ALERT                                      //
// ------------------------------------------------------------------------------------------------------------ //

// Function to construct Icon Marker
function IconMarker(rp) {
  const IconMarkerR = new L.Icon({
    iconUrl: `${server}/static/historical_validation_tool_ecuador/images/icon_popup/${rp}.png`,
    shadowUrl: `${server}/static/historical_validation_tool_ecuador/images/icon_popup/marker-shadow.png`,
    iconSize: [9, 14],
    iconAnchor: [5, 14],
    popupAnchor: [1, -14],
    shadowSize: [14, 14],
  });
  return IconMarkerR;
}

// Icon markers for each return period
const IconR000 = IconMarker("0");       // RP: 0 years
const IconR002 = IconMarker("2");      // RP: 2 years
const IconR005 = IconMarker("5");        // RP: 5 years
const IconR010 = IconMarker("10");      // RP: 10 years
const IconR025 = IconMarker("25");         // RP: 25 years
const IconR050 = IconMarker("50");      // RP: 50 years
const IconR100 = IconMarker("100");       // RP: 100 years

// Customized icon function
function IconParse(feature, latlng) {
    switch (feature.properties.alerta) {
        case "R0":
            StationIcon = IconR000;
            break;
        case "R2":
            StationIcon = IconR002;
            break;
        case "R5":
            StationIcon = IconR005;
            break;
        case "R10":
            StationIcon = IconR010;
            break;
        case "R25":
            StationIcon = IconR025;
            break;
        case "R50":
            StationIcon = IconR050;
            break;
        case "R100":
            StationIcon = IconR100;
            break;
    }
    return L.marker(latlng, { icon: StationIcon });
}



// ------------------------------------------------------------------------------------------------------------ //
//                                            PANEL DATA INFORMATION                                            //
// ------------------------------------------------------------------------------------------------------------ //
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get_data_station(code, comid, name, river, basin, latitude, longitude, altitude, locality1, locality2, locality3){
    // Add data to the panel
    $("#panel-title-custom").html(`${code.toUpperCase()} - ${name.toUpperCase()}`)
    $("#station-comid-custom").html(`<b>COMID:</b> &nbsp ${comid}`)
    $("#station-river-custom").html(`<b>RIO:</b> &nbsp ${river.toUpperCase()}`)
    $("#station-basin-custom").html(`<b>CUENCA:</b> &nbsp ${basin.toUpperCase()}`)
    $("#station-latitude-custom").html(`<b>LATITUD:</b> &nbsp ${latitude.toUpperCase()}`)
    $("#station-longitude-custom").html(`<b>LONGITUD:</b> &nbsp ${longitude.toUpperCase()}`)
    $("#station-altitude-custom").html(`<b>ALTITUD:</b> &nbsp ${altitude.toUpperCase()} msnm`)
    $("#station-locality1-custom").html(`<b>PROVINCIA:</b> &nbsp ${locality1.toUpperCase()}`)
    $("#station-locality2-custom").html(`<b>CANTON:</b> &nbsp ${locality2.toUpperCase()}`)
    $("#station-locality3-custom").html(`<b>PARROQUIA:</b> &nbsp ${locality3.toUpperCase()}`)

    const loader = `<div class="loading-container" style="height: 350px; padding-top: 12px;"> 
                        <div class="loading"> 
                        <h2>LOADIND DATA</h2>
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span> 
                        </div>
                    </div>`;

    // Add the dynamic loader
    $("#hydrograph").html(loader)
    $("#visual-analisis").html(loader)
    $("#metrics").html(loader)
    $("#forecast").html(loader)
    $("#corrected-forecast").html(loader)

    // We need stop 300ms to obtain the width of the panel-tab-content
    await sleep(300);

    // Retrieve the data
    $.ajax({
        type: 'GET', 
        url: "get-historical-data",
        data: {
            codigo: code.toLowerCase(),
            comid: comid,
            nombre: name.toUpperCase(),
            width: `${$("#panel-tab-content").width()}`
        }
    }).done(function(response){
        
        $("#modal-body-panel-custom").html(response)
        
        $.ajax({
            type: 'GET', 
            url: "get-metrics",
        }).done(function(response){
            $("#metrics-table-panel").html(response)
        })

        $.ajax({
            type: 'GET', 
            url: "get-forecast-table",
        }).done(function(response){
            $("#forecast-table").html(response)
        })
        
        $.ajax({
            type: 'GET', 
            url: "get-corrected-forecast-table",
        }).done(function(response){
            $("#corrected-forecast-table").html(response)
        })
    })
}



// ------------------------------------------------------------------------------------------------------------ //
//                                          INFORMATION ABOUT STATIONS                                          //
// ------------------------------------------------------------------------------------------------------------ //

// Dinamic popups
function onEachFeature(feature, layer) {
    layer.bindPopup(
        "<div class='popup-container'>"+
            "<div class='popup-title'><b> DATOS DE LA ESTACION </b></div>"+
               "<table style='font-size:12px'>"+
                "<tbody>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>CODIGO: </th>"+
                        "<td class='popup-cell'>" + feature.properties.codigo.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>NOMBRE: </th>"+
                        "<td class='popup-cell'>" + feature.properties.nombre.toUpperCase().slice(0,20) + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>RIO: </th>"+
                        "<td class='popup-cell'>" + feature.properties.rio.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>CUENCA: </th>"+
                        "<td class='popup-cell'>" + feature.properties.cuenca.toUpperCase() + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>LATITUD: </th>"+
                        "<td class='popup-cell'>" + round10(parseFloat(feature.geometry.coordinates[1]), -4) + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>LONGITUD: </th>"+
                        "<td class='popup-cell'>" + round10(parseFloat(feature.geometry.coordinates[0]), -4) + "</td>"+
                    "</tr>"+
                    "<tr>"+
                        "<th class='popup-cell-title popup-cell'>ALTITUD: </th>"+
                        "<td class='popup-cell'>" + feature.properties.elevacion + " msnm</td>"+ 
                    "</tr>"+
                "</tbody>"+
            "</table>"+ 
            "<br>"+ 
            
            "<div data-bs-toggle='tooltip'>"+
                "<div data-bs-toggle='modal' data-bs-target='#panel-modal'>" + 
                    "<button style='font-size:14px !important;' class='btn btn-primary popup-button' onclick='get_data_station(" + 
                        '"' + feature.properties.codigo + '",' +
                        '"' + feature.properties.comid + '",' +
                        '"' + feature.properties.nombre + '",' + 
                        '"' + feature.properties.rio + '",' + 
                        '"' + feature.properties.cuenca + '",' + 
                        '"' + round10(parseFloat(feature.geometry.coordinates[1]), -4) + '",' + 
                        '"' + round10(parseFloat(feature.geometry.coordinates[0]), -4) + '",' + 
                        '"' + feature.properties.elevacion + '",' + 
                        '"' + feature.properties.provincia + '",' + 
                        '"' + feature.properties.canton + '",' + 
                        '"' + feature.properties.parroquia + '",' + 
                    ");' >"+
                        "<i class='fa fa-download'></i>&nbsp;Visualizar Datos"+
                    "</button>"+
                "</div>"+ 
            "</div>"+
        "</div>");
    layer.openPopup();
};



window.onload = function () {
  // Load drainage network
  fetch(
    `${server}/static/historical_validation_tool_ecuador/geojson/ecuador_geoglows_drainage.geojson`
  )
    .then((response) => (layer = response.json()))
    .then((layer) => {
      riv = L.geoJSON(layer, { style: { weight: 1 } }).addTo(map);
      map.fitBounds(riv.getBounds());
      //map.almostOver.addLayer(riv);
      //map.on('almost:click', function (e) {
      //    var layer = e.layer.feature.properties;
      //    console.log(layer)
      //});
    });

  // Load stations
  fetch("get-stations")
    .then((response) => (layer = response.json()))
    .then((layer) => {
        est_layer = layer.features.map(item => item.properties);
        
        // Filter by alert
        est_R000 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R0"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R000.addTo(map);

        est_R002 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R2"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R002.addTo(map);

        est_R005 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R5"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R005.addTo(map);

        est_R010 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R10"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R010.addTo(map);

        est_R025 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R25"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R025.addTo(map);

        est_R050 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R50"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R050.addTo(map);

        est_R100 = L.geoJSON(layer.features.filter(item => item.properties.alerta === "R100"), {
            pointToLayer: IconParse,
            onEachFeature: onEachFeature,
        });
        est_R100.addTo(map);

    });
};















