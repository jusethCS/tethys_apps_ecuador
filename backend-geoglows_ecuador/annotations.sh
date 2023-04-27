conda create -n gess python=3.9.*
conda activate gess

conda install -c conda-forge mamba                     
conda install -c anaconda psycopg2
conda install -c anaconda pandas
conda install -c anaconda sqlalchemy
conda install -c anaconda openpyxl
mamba install -c conda-forge geoglows
mamba install -c anaconda lxml
 

# Para instalar psycopg2 se necesita (En caso de errores)
sudo apt install build-essential
sudo apt-get install python3-dev
pip install cmake


### Crear la base de datos
DROP DATABASE gess_streamflow;
CREATE DATABASE gess_streamflow;
