from backend.streaming_job import StreamingJob, StreamingJobSelector, StreamingJobUpdate
from pymongo import MongoClient

class StreamDal:
    def __init__(self, mongo_uri: str):
        self.client = MongoClient(mongo_uri)
        self.db = self.client.get_database("vod_db")
        self.streams_collection = self.db.get_collection("streams")

    def save_stream(self, stream: StreamingJob) -> None:
        self.streams_collection.insert_one(stream.model_dump())

    def get_all_streams(self) -> list[StreamingJob]:
        streams = self.streams_collection.find()
        return [StreamingJob(**stream) for stream in streams]
    
    def get_all_stream_ids(self) -> list[str]:
        streams = self.streams_collection.find()
        return [StreamingJob(**stream).id for stream in streams]
    
    def get_streams_by_selector(self, selector: StreamingJobSelector) -> list[StreamingJob]:
        streams = self.streams_collection.find(self._selector_to_query(selector))
        return [StreamingJob(**stream) for stream in streams]
    
    def update_stream_by_selector(self, selector: StreamingJobSelector, update: StreamingJobUpdate) -> None:
        self.streams_collection.update_many( 
            self._selector_to_query(selector),
            {"$set": update.model_dump_json(exclude_unset=True)}
        )
    
    @staticmethod
    def _selector_to_query(selector: StreamingJobSelector) -> dict:
        query = {}
        if selector.stream_name:
            query["stream_name"] = {"$in": selector.stream_name}
        if selector.username:
            query["username"] = {"$in": selector.username}
        if selector.destination:
            query["destination"] = {"$in": selector.destination}
        if selector.status:
            query["status"] = {"$in": [status.value for status in selector.status]}
            
        if selector.start_time_range is not None:
            time_query = {}
            if selector.start_time_range.start:
                time_query["$gte"] = selector.start_time_range.start
            if selector.start_time_range.end:
                time_query["$lte"] = selector.start_time_range.end
            if time_query:
                query["start"] = time_query

        if selector.end_time_range is not None:
            time_query = {}
            if selector.end_time_range.start:
                time_query["$gte"] = selector.end_time_range.start
            if selector.end_time_range.end:
                time_query["$lte"] = selector.end_time_range.end
            if time_query:
                query["start"] = time_query
                
        return query