#!/bin/bash

# Enviromental variables
ROOT_PATH=~/tethys_apps_ecuador/backend-geoglows_ecuador/Streamflow
CONDA_ENV=geoglows_ecuador

# Change to work directory
cd $ROOT_PATH

# Activate conda enviroment
conda activate $CONDA_ENV

# Print initial timestamp
date +"%Y-%m-%d %H:%M:%S" >> ${ROOT_PATH}/forecast_db.log

# Download forecast data
python r_forecast_db.py >> ${ROOT_PATH}/forecast_db.log

# Analize the forecast
python r_analysis_forecast.py >> ${ROOT_PATH}/forecast_db.log

# Finish the routine
echo -e "\n" >> ${ROOT_PATH}/forecast_db.log