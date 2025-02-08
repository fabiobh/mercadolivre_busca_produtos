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
                "price": float(item["price"])  # Convert price to float
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
    query = "iphone_xs_max"
    try:
        # Fetch data from Mercado Livre API
        print("Fetching data from Mercado Livre...")
        data = fetch_mercadolibre_data(query)
        
        print(f"Found {len(data.get('results', []))} items")
        
        # Save data to Supabase
        print("Saving data to Supabase...")
        save_to_supabase(data, query)
        print("Data successfully saved to Supabase!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    main()