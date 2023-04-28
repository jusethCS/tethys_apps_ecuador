# Import libraries and dependencies
import os
import psycopg2
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Import enviromental variables
load_dotenv()
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_NAME = os.getenv('DB_NAME')

# Generate the conection token
token = "postgresql+psycopg2://{0}:{1}@localhost:5432/{2}".format(DB_USER, DB_PASS, DB_NAME)
  
# Establish connection
db= create_engine(token)
conn = db.connect()

# Read the dataframe stations
data = pd.read_excel('Ecuador_Data_Streamflow.xlsx', index_col=0) 
df = pd.DataFrame(data)
df.columns = [x.lower() for x in df.columns]

# Insert to database
df.to_sql('observed_data', con=conn, if_exists='replace', index=True)

# Close connection
conn.close()

