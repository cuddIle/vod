from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))

vod_db = client.get_database("vod_db")

if "streams" in vod_db.list_collection_names():
    vod_db.create_collection("streaams")

if "users" in vod_db.list_collection_names():
    vod_db.create_collection("users")

