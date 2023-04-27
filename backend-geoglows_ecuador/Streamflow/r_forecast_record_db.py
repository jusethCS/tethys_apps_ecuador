# Libraries and dependencies
import psycopg2
import pandas as pd
from sqlalchemy import create_engine


# Function to retrieve data from GESS API
def get_data(comid):
    url = 'https://geoglows.ecmwf.int/api/ForecastRecords/?reach_id={0}&return_format=csv'.format(comid)
    status = False
    while not status:
      try:
        outdf = pd.read_csv(url, index_col=0)
        status = True
      except:
        print("Trying to retrieve data...")
    # Filter and correct data
    outdf[outdf < 0] = 0
    outdf.index = pd.to_datetime(outdf.index)
    outdf.index = outdf.index.to_series().dt.strftime("%Y-%m-%d %H:%M:%S")
    outdf.index = pd.to_datetime(outdf.index)
    return(outdf)


# Function to insert data to database
def insert_data(db, comid):
    # Get historical data
    historical = get_data(comid)
    # Establish connection
    conn = db.connect()
    # Insert to database
    table = 'fr_{0}'.format(comid)
    try:
        historical.to_sql(table, con=conn, if_exists='replace', index=True)
    except:
       print("Error to insert data in comid={0}".format(comid))
    # Close conection
    conn.close()   



# Read comids
data = pd.read_excel('Ecuador_Geoglows_Drainage.xlsx', index_col=0)

# Setting the connetion to db
db= create_engine("postgresql+psycopg2://postgres:pass@localhost:5432/gess_streamflow")


n = len(data.COMID) + 1

for i in range(1,n):
    # State variable
    comid = data.COMID[i]
    # Progress
    prog = round(100 * i/n, 3)
    print("Progress: {0} %. Comid: {1}".format(prog, comid))
    try:
        insert_data(db, comid)
    except:
        insert_data(db, comid)




