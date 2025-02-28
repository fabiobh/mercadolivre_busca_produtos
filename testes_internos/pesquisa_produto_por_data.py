import requests
from datetime import datetime

print("começar")

url = "https://api.mercadolibre.com/sites/MLB/search"
params = {
    'q': 'Samsung Galaxy S20',
    'price_min': 400,
    'price_max': 800
}
response = requests.get(url, params=params).json()
print("response")
print(response)
# Exibir a quantidade de resultados encontrados
print(f"Quantidade de resultados encontrados: {len(response['results'])}")
'''
for item in response['results']:
    item_id = item['id']
    item_details = requests.get(f"https://api.mercadolibre.com/items/{item_id}").json()
    data_criacao = item_details.get('date_created')
    # Comparar com a data desejada
    if data_criacao and data_criacao.startswith('2025-01-01'):
        print(f"Item {item_id} criado em 01/01/2025")   
'''
print("fim")