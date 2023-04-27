#! /bin/bash
cd /home/juseth/backend/Streamflow
conda activate gess

# Once excecution rutine
python r_stations_db.py
python r_observed_data_db.py

# Monthly excecution rutine
python r_historical_simulation_db.py

# Daily excecution rutine
python r_forecast_db.py
python r_forecast_record_db.py

