# Libraries and dependencies
import psycopg2
import pandas as pd
from sqlalchemy import create_engine
  
# Establish connection
db= create_engine("postgresql+psycopg2://postgres:pass@localhost:5432/gess_streamflow")
conn = db.connect()

# Read the dataframe stations
data = pd.read_excel('Ecuador_Stations_Streamflow.xlsx', index_col=0) 
df = pd.DataFrame(data)

# Insert to database
df.to_sql('stations', con=conn, if_exists='replace', index=False)

# Close connection
conn.close()