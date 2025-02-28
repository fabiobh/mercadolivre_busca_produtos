import os
import requests
from dotenv import load_dotenv
from supabase import create_client
import traceback

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

# Add debug prints
print(f"Supabase URL: {supabase_url}")
print(f"Supabase Key exists: {bool(supabase_key)}")

supabase = create_client(supabase_url, supabase_key)

def login():
    # in production is recommended to use RLS, to use RLS, is necessary to authenticate with email and password
    try:
        supabase_user = os.getenv("SUPABASE_USER")
        supabase_password = os.getenv("SUPABASE_PASSWORD")
        print("supabase_user: " + str(supabase_user))
        
    except Exception as e:
        print("Error validated user: " + str(e))

def login_check():
    try:
        # Try to fetch a single row from any table you have access to
        test = supabase.table('mercadolibre_products').select("*").limit(1).execute()
        print("Successfully authenticated with service role key")
    except Exception as e:
        print(f"Authentication failed: {str(e)}")
        raise

def fetch_mercadolibre_data(query, min_price=400, max_price=1000, category="MLB1055"):
    url = f"https://api.mercadolibre.com/sites/MLB/search"
    params = {
        "q": query,
        "price": f"{min_price}-{max_price}",
        "category": category
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # This will raise an exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Mercado Livre: {str(e)}")
        raise

def save_to_supabase(products_data, query):
    if not products_data.get("results"):
        print("No results found in the API response")
        return
    
    for item in products_data["results"]:
        try:
            data = {
                "query": query,
                "title": item["title"],
                "permalink": item["permalink"],
                "thumbnail": item["thumbnail"],
                "price": float(item["price"])
            }
            
            # Print the data being sent to Supabase
            print(f"\nTrying to save data:")
            print(f"Query: {data['query']}")
            print(f"Title: {data['title']}")
            print(f"Price: {data['price']}")
            
            result = supabase.table("mercadolibre_products").insert(data).execute()
            
            # Print the Supabase response
            print(f"Supabase response: {result}")
            print(f"Saved item: {data['title']}")
            
        except Exception as e:
            print(f"Error saving item {item.get('title', 'unknown')}")
            print(f"Error details: {str(e)}")
            print(f"Error type: {type(e)}")
            traceback.print_exc()
            continue

def main():
    print("do nothing")

def save_products(query, min_price, max_price, category):
    
    try:
        # Fetch data from Mercado Livre API
        print("Fetching data from Mercado Livre...")
        data = fetch_mercadolibre_data(query, min_price, max_price, category)
        
        print(f"Found {len(data.get('results', []))} items")
        
        # Save data to Supabase
        print("Saving data to Supabase...")
        save_to_supabase(data, query)
        print("Data successfully saved to Supabase!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()

def update_internal_data():
    try:
        # Get current timestamp
        from datetime import datetime
        current_timestamp = datetime.utcnow().isoformat()
        
        data = {
            "last_update": current_timestamp
        }
        
        # Insert data into internal_data_update table
        # Add at the beginning of your script, after creating the supabase client
        supabase.auth.sign_in_with_password({
            "email": os.getenv("SUPABASE_USER"),
            "password": os.getenv("SUPABASE_PASSWORD")
        })
        result = supabase.table("internal_data_update").insert(data).execute()
        print(f"Internal data update logged successfully at {current_timestamp}")
        return result
        
    except Exception as e:
        print(f"Error updating internal data: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()
        raise

if __name__ == "__main__":
    login()
    login_check()
    
    categoria_celular = "MLB1055"
    categoria_portateis_notebook = "MLB1652"
    save_products(query="iphone_xs_max", min_price=400, max_price=1000, category=categoria_celular)
    save_products(query="1035g1", min_price=700, max_price=1500, category=categoria_portateis_notebook)
    