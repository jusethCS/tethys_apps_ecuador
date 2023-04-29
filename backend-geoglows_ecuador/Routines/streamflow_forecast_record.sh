#!/bin/bash

# Enviromental variables
ROOT_PATH=~/tethys_apps_ecuador/backend-geoglows_ecuador/Streamflow
CONDA_ENV=geoglows_ecuador

# Change work directory
cd $ROOT_PATH

# Activate the conda enviroment
source ~/miniconda3/etc/profile.d/conda.sh
conda activate geoglows_ecuador

date +"%Y-%m-%d %H:%M:%S" >> ${ROOT_PATH}/forecast_records.log
python r_forecast_record_db.py >> ${ROOT_PATH}/forecast_records.log