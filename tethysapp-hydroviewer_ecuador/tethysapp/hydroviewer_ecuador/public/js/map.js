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
//                                            PANEL DATA INFORMATION                                            //
// ------------------------------------------------------------------------------------------------------------ //
const sleep = ms => new Promise(r => setTimeout(r, ms));

var global_comid;

async function get_data_station(comid){
    // Updating the
    global_comid = comid
    
    // Add data to the panel
    $("#station-comid-custom").html(`<b>COMID:</b> &nbsp ${comid}`)

    loader = `<div class="loading-container" style="height: 350px; padding-top: 12px;"> 
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
        url: "get-data",
        data: {
            comid: comid,
            width: `${$("#panel-tab-content").width()}`
        }
    }).done(function(response){
        $("#modal-body-panel-custom").html(response)
    })
}





// ------------------------------------------------------------------------------------------------------------ //
//                                         ADDING THE DRAINAGE NETWORK                                          //
// ------------------------------------------------------------------------------------------------------------ //

window.onload = function () {
  // Load drainage network
  fetch(
    `${server}/static/hydroviewer_ecuador/geojson/ecuador_geoglows_drainage.geojson`
  )
    .then((response) => (layer = response.json()))
    .then((layer) => {
      // Adding the drainage network to the map
      riv = L.geoJSON(layer, {
        style: {
          weight: 1, 
          color: "#4747C9" 
        }
      }).addTo(map);
      // Fit the map to the river bounds
      map.fitBounds(riv.getBounds());
      // Buffer to select rivers
      map.almostOver.addLayer(riv);
      // On click function
      map.on('almost:click', function (e) {
          var comid = e.layer.feature.properties.COMID;
          console.log(comid);
          $("#panel-modal").modal("show")
          get_data_station(comid)
      });
    });
}; 
 
 













