#!/bin/bash

# Environmental variables
DIR_PATH=~/tethys_apps_ecuador/backend-geoglows_ecuador/Streamflow
CONDA_ENV=geoglows_ecuador

# Change work directory
cd $DIR_PATH

# Activate the conda enviroment
source ~/miniconda3/etc/profile.d/conda.sh
conda activate geoglows_ecuador

# Download and analyze geoglows forecasts
date +"%Y-%m-%d %H:%M:%S" >> ${DIR_PATH}/forecast_db.log
python r_forecast_db.py >> ${DIR_PATH}/forecast_db.log
python r_analysis_forecast.py >> ${DIR_PATH}/forecast_db.log