import psycopg2
import pandas as pd
from sqlalchemy import create_engine
  
# Establish connection
db= create_engine("postgresql+psycopg2://postgres:pass@localhost:5432/gess_streamflow")
conn = db.connect()

# Read the dataframe stations
data = pd.read_excel('Ecuador_Data_Streamflow.xlsx', index_col=0) 
df = pd.DataFrame(data)
df.columns = [x.lower() for x in df.columns]

# Insert to database
df.to_sql('observed_data', con=conn, if_exists='replace', index=True)

# Close connection
conn.close()


#dataFrame = pd.read_sql("select * from observed_data", conn);

# Progress: 34.447 %. Comid: 9023654


