// ------------------------------------------------------------------------------------------------------------ //
//                                    DATA ON LOCALITIES AND BASIN DISTRICTS                                    //
// ------------------------------------------------------------------------------------------------------------ //

// Localities
let loc = [
    { name: "Azuay", file:"azuay.geojson"},
    { name: "Bolivar", file:"bolivar.geojson"},
    { name: "Cañar", file:"canar.geojson"},
    { name: "Carchi", file:"carchi.geojson"},
    { name: "Chimborazo", file:"chimborazo.geojson"},
    { name: "Cotopaxi", file:"cotopaxi.geojson"},
    { name: "El Oro", file:"el_oro.geojson"},
    { name: "Esmeraldas", file:"esmeraldas.geojson"},
    { name: "Galápagos", file:"galapagos.geojson"},
    { name: "Guayas", file:"guayas.geojson"},
    { name: "Imbabura", file:"imbabura.geojson"},
    { name: "Loja", file:"loja.geojson"},
    { name: "Los Ríos", file:"los_rios.geojson"},
    { name: "Manabí", file:"manabi.geojson"},
    { name: "Morona Santiago", file:"morona_santiago.geojson"},
    { name: "Napo", file:"napo.geojson"},
    { name: "Orellana", file:"orellana.geojson"},
    { name: "Pastaza", file:"pastaza.geojson"},
    { name: "Pinchincha", file:"pichincha.geojson"},
    { name: "Santa Elena", file:"santa_elena.geojson"},
    { name: "Santo Domingo", file:"santo_domingo.geojson"},
    { name: "Sucumbíos", file:"sucumbios.geojson"},
    { name: "Tungurahua", file:"tungurahua.geojson"},
    { name: "Zamora Chinchipe", file:"zamora_chinchipe.geojson"},
];
const loc_url = `${server}/static/historical_validation_tool_ecuador/geojson/loc/`


// River basin districts
let basin = [
    { name: "Demarcación Esmeraldas", file:"esmeraldas.geojson"},
    { name: "Demarcación Guayas", file:"guayas.geojson"},
    { name: "Demarcación Jubones", file:"jubones.geojson"},
    { name: "Demarcación Manabí", file:"manabi.geojson"},
    { name: "Demarcación Mira", file:"mira.geojson"},
    { name: "Demarcación Napo", file:"napo.geojson"},
    { name: "Demarcación Pastaza", file:"pastaza.geojson"},
    { name: "Demarcación Puyango-Catamayo", file:"puyango_catamayo.geojson"},
    { name: "Demarcación Santiago", file:"santiago.geojson"},
];
const basin_url = `${server}/static/historical_validation_tool_ecuador/geojson/basin/`


 


// ------------------------------------------------------------------------------------------------------------ //
//                                           MAP CONTROL - CONTAINER                                            //
// ------------------------------------------------------------------------------------------------------------ //

// Define the control panel container
var info = L.control({position:'bottomleft'}); 

// Configure the control panel container
info.onAdd = function (map) {
    // Generate options for Localities
    loc = loc.map((item) => {
            var option_custom = `<option value="${item.file}">${item.name}</option>`;
            return(option_custom);
          }).join("");
          
    // Generate options for River basin districts
    basin = basin.map((item) => {
        var option_custom = `<option value="${item.file}">${item.name}</option>`;
        return(option_custom);
      }).join("");
    
    // Create the control panel DOM
    this._div = L.DomUtil.create('div', 'control')
    this._div.innerHTML =  `<div class="control-group">
                                <label class="label-control" for="select-loc">Niveles de alerta:</label>
                                <div class="alert-panel-checkbox">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-002yr" checked>
                                        <label class="form-check-label" for="check-002yr">Periodo de retorno: 2 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-005yr" checked>
                                        <label class="form-check-label" for="check-005yr">Periodo de retorno: 5 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-010yr" checked>
                                        <label class="form-check-label" for="check-010yr">Periodo de retorno: 10 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-025yr" checked>
                                        <label class="form-check-label" for="check-025yr">Periodo de retorno: 25 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-050yr" checked>
                                        <label class="form-check-label" for="check-050yr">Periodo de retorno: 50 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-100yr" checked>
                                        <label class="form-check-label" for="check-100yr">Periodo de retorno: 100 años</label>
                                    </div>
                                </div>
                                <br>
                                <div class="control-group">
                                <label class="label-control" for="select-loc">Provincia:</label>
                                <select id="select-loc" required class="demo-default" placeholder="Seleccione una provincia." name="loc">
                                    <option value="">Seleccione una provincia.</option>
                                    ${loc}
                                </select>
                                <br>
                                <label class="label-control" for="select-basin">Demarcación Hidrográfica:</label>
                                <select id="select-basin" required class="demo-default" placeholder="Seleccione una demarcación hidrográfica." name="basin">
                                    <option value="">Seleccione una demarcación hidrográfica.</option>
                                    ${basin}
                                </select>
                                <br>
                                <label for="shpFile" class="label-control">Area geográfica:</label>
                                <input class="form-control" type="file" id="shpFile" accept=".shp">
                                <br>
                            </div>`;
    return this._div;
};

// Add the control panel container to the map
info.addTo(map);



// ------------------------------------------------------------------------------------------------------------ //
//                                     MAP CONTROL - SELECT BOXES AND ZOOM                                      //
// ------------------------------------------------------------------------------------------------------------ //

// Select box for ZOOM to localities (Provincias)
$('#select-loc').selectize({
    create: false,
    sortField: { field: 'text', direction: 'asc'},
    onChange: function(value, isOnInitialize) {
        // Retrieve geojson from REST API
        fetch(`${loc_url}${value}`)
        .then((response) => (layer = response.json()))
        .then((layer) => {
            // Remove the current layer
            if (typeof layerSHP !== 'undefined') {
                map.removeLayer(layerSHP)
            }
            // Add retrieved layer and fit to map
            layerSHP = L.geoJSON(layer, { style: { weight: 1 } }).addTo(map);
            map.fitBounds(layerSHP.getBounds());
        });
    }
});


// Select box for ZOOM to to basin district
$('#select-basin').selectize({
    create: true,
    sortField: { field: 'text', direction: 'asc'},
    onChange: function(value, isOnInitialize) {
        // Retrieve geojson from REST API
        fetch(`${basin_url}${value}`)
        .then((response) => (layer = response.json()))
        .then((layer) => {
            // Remove the current layer
            if (typeof layerSHP !== 'undefined') {
                map.removeLayer(layerSHP)
            }
            // Add retrieved layer and fit to map
            layerSHP = L.geoJSON(layer, { style: { weight: 1 } }).addTo(map);
            map.fitBounds(layerSHP.getBounds());
        });
    }
});



$("#shpFile").on("change",  function(){
    // Lee el archivo desde la entrada de archivos
    var file = document.getElementById('shpFile').files[0];
    // Crea un objeto FileReader para leer el archivo
    var reader = new FileReader();
    reader.onload = function(e) {
        // Convierte el archivo shapefile a GeoJSON usando shpjs
        shp(e.target.result).then(function(geojson) {
            // Crea una capa de Leaflet con los datos del archivo GeoJSON
            if (typeof layerSHP !== 'undefined') {
                map.removeLayer(layerSHP)
            }
            layerSHP = L.geoJSON(geojson, { style: { weight: 1 } }).addTo(map);
            map.fitBounds(layerSHP.getBounds());
        });
    };
  // Lee el archivo como una URL de datos
  reader.readAsDataURL(file);
});



