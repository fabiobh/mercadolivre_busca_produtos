create table mercadolibre_products (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    query text not null,
    title text not null,
    permalink text not null,
    thumbnail text not null,
    price numeric not null
);