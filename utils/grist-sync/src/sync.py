import requests
from io import StringIO
import pandas as pd
from dotenv import dotenv_values
import os
import json


config = {
    **dotenv_values(".env.shared"),  # load shared development variables
    **dotenv_values(".env"),  # load sensitive variables
    **os.environ,  # override loaded values with environment variables
}

# Define your Grist credentials
GRIST_ACCESS_TOKEN = config["GRIST_ACCESS_TOKEN"]
GRIST_DOCUMENT_ID = config["GRIST_DOCUMENT_ID"]
GRIST_TABLE_NAME = config["GRIST_TABLE_NAME"]

# Grist API URL
grist_base_url = f"https://grist.numerique.gouv.fr/api/docs/{GRIST_DOCUMENT_ID}/tables/{GRIST_TABLE_NAME}/records"

# CSV Export URL
CSV_EXPORT_URL = config["CSV_EXPORT_URL"]

# Headers for authorization
headers = {"Authorization": f"Bearer {GRIST_ACCESS_TOKEN}"}

PIVOT_COLUMN = config["PIVOT_COLUMN"]
COLUMNS_TO_CHECK = config["COLUMNS_TO_CHECK"].split(",")


def get_grist_data(grist_base_url):
    """
    Fetches data from Grist

    Parameters
    ----------
    grist_base_url : str
        The base URL for the Grist API

    Returns
    -------
    pd.DataFrame
        A DataFrame containing the data from Grist
    """

    # Request to Grist API
    response = requests.get(grist_base_url, headers=headers)
    response_data = response.json()

    # Append the records to the list
    records = response_data.get("records", [])

    print(f"Found {len(records)} records in Grist")

    # Extract the data from the records
    data = []
    for record in records:
        record_data = record.get("fields", {})
        record_data["grist_record_id"] = record.get("id")
        data.append(record_data)

    # Convert the data to a DataFrame
    df = pd.DataFrame(data)

    return df


def get_csv_export_data(csv_export_url):
    """Download and read the CSV export from PCRS

    Parameters
    ----------
    csv_export_url : str
        The URL to download the CSV export from PCRS

    Returns
    -------
    pd.DataFrame
        A DataFrame containing the data from the CSV export
    """

    # Step 1: Download the CSV file
    response = requests.get(csv_export_url)

    # Check if the request was successful
    if response.status_code != 200:
        return f"Error: Unable to download CSV file, status code {response.status_code}"

    # Step 2: Read the CSV file
    csv_data = response.text

    # Step 3: Convert CSV data to DataFrame
    df = pd.read_csv(StringIO(csv_data))

    print(f"Found {len(df)} records in PCRS CSV export")

    return df


def synchronize_different_records(grist_df, pcrs_df):
    """Synchronize records with differences between Grist and PCRS

    For each record, check if any columns to check are different
    between Grist and PCRS. If they are different, update the record in Grist with the
    values from PCRS.

    Parameters
    ----------
    grist_df : pd.DataFrame
        The DataFrame containing the data from Grist

    pcrs_df : pd.DataFrame
        The DataFrame containing the data from the PCRS CSV export
    """

    print("Synchronizing different records...")

    # Ensure both DataFrames have the same PIVOT_COLUMN values
    common_ids = grist_df[PIVOT_COLUMN].isin(pcrs_df[PIVOT_COLUMN])
    grist_df = grist_df[common_ids]
    pcrs_df = pcrs_df[pcrs_df[PIVOT_COLUMN].isin(grist_df[PIVOT_COLUMN])]

    # Set index to PIVOT_COLUMN for both DataFrames
    grist_df = grist_df.set_index(PIVOT_COLUMN)
    pcrs_df = pcrs_df.set_index(PIVOT_COLUMN)

    # Align the DataFrames to ensure they have the same index
    grist_df, pcrs_df = grist_df.align(pcrs_df, join="inner", axis=0)

    # Identify records where columns differ
    different_records = grist_df[
        ~grist_df[COLUMNS_TO_CHECK].eq(pcrs_df[COLUMNS_TO_CHECK]).all(axis=1)
    ]

    if different_records.empty:
        print("No records found with differences")
        return

    print(f"Found {len(different_records)} records with differences")

    # Call Grist API to update the records
    updated_records = {"records": []}
    for index, row in different_records.iterrows():

        grist_record_id = row["grist_record_id"]

        # Prepare the updated fields from pcrs_df
        updated_data = pcrs_df.loc[index, COLUMNS_TO_CHECK].to_dict()

        updated_record = {
            "id": grist_record_id,
            "fields": updated_data,
        }
        print(updated_record)
        updated_records["records"].append(updated_record)

    # PATCH request instead of PUT to keep the existing fields not in PCRS
    response = requests.patch(grist_base_url, headers=headers, json=updated_records)

    if response.status_code != 200:
        print(
            f"Error updating record {grist_record_id}, status code {response.status_code}"
        )
        print(response.json())
    else:
        print(f"Successfully updated record {grist_record_id}")


def synchronize_missing_records(grist_df, pcrs_df):
    """Synchronize records missing in Grist

    For each record in PCRS that is missing in Grist, create a new record in Grist.

    Parameters
    ----------
    grist_df : pd.DataFrame
        The DataFrame containing the data from Grist

    pcrs_df : pd.DataFrame
        The DataFrame containing the data from the PCRS CSV export
    """

    print("Synchronizing missing records...")

    # Find records in PCRS that are missing in Grist
    missing_records = pcrs_df[~pcrs_df[PIVOT_COLUMN].isin(grist_df[PIVOT_COLUMN])]

    print(f"Found {len(missing_records)} records missing in Grist")

    if missing_records.empty:
        print("No missing records found")
        return

    # Call Grist API to create the missing records
    added_records = {"records": []}
    for _, row in missing_records.iterrows():

        # drop all the data for which we don't have a column in Grist
        data = row[COLUMNS_TO_CHECK].to_dict()
        data[PIVOT_COLUMN] = row[PIVOT_COLUMN]

        added_records["records"].append(
            {
                "fields": data,
            }
        )

        print(f"Creating new record with data: {data}")

    print(added_records)
    response = requests.post(grist_base_url, headers=headers, json=added_records)

    if response.status_code != 200:
        print(f"Error creating record, status code {response.status_code}")
        print(response.json())
    else:
        print(f"Successfully created record")


def synchronize_deleted_records(grist_df, pcrs_df):
    """Synchronize records deleted in PCRS

    For each record in Grist that is missing in PCRS, print the record

    Parameters
    ----------
    grist_df : pd.DataFrame
        The DataFrame containing the data from Grist

    pcrs_df : pd.DataFrame
        The DataFrame containing the data from the PCRS CSV export
    """

    print("Synchronizing deleted records...")

    # Find records in Grist that are missing in PCRS
    deleted_records = grist_df[~grist_df[PIVOT_COLUMN].isin(pcrs_df[PIVOT_COLUMN])]

    print(f"Found {len(deleted_records)} records missing in PCRS")

    if not deleted_records.empty:
        print(deleted_records.head())


# Main process
if __name__ == "__main__":

    print("Step 1: Loading current data from Grist...")

    grist_df = get_grist_data(grist_base_url)
    print()

    print("Step 2: Loading current data from pcrs CSV export...")

    pcrs_df = get_csv_export_data(CSV_EXPORT_URL)
    print()

    print("Step 3: Synchronize data between Grist and PCRS...")

    synchronize_different_records(grist_df, pcrs_df)
    print()

    synchronize_missing_records(grist_df, pcrs_df)
    print()

    synchronize_deleted_records(grist_df, pcrs_df)
    print()

    print("Synchronization completed!")
