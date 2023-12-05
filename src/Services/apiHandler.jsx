import axios from "axios";
var API_KEY = window.localStorage.getItem('apikey')
var API_URL = 'https://2.intelx.io/'


class ApiHandlers {
  
  ///////////////////////////////////////////////////////////////////////
  //                        Intel Handler                              //
  ///////////////////////////////////////////////////////////////////////

  async initializeIntelData(data) {
    try {
      const searchParams = {
          term: data.main,
          maxresults: 1000,
          media: 0,
          sort: 2,
          terminate: []
      };
      const searchResponse = await axios.post(
          `${API_URL}intelligent/search`,
          searchParams,
          {
              headers: { 'x-key': API_KEY }
          }
      );
      const res = searchResponse.data;
      const id = res.id;
      return {
          id
      };
    } catch (error) {
        console.error(error.message);
        return [];
    }
  }

  async findIntelData(data) {
    try {
        const resultResponse = await axios.get(
            `${API_URL}intelligent/search/result`,
            {
                params: {
                    id: data.id,
                    limit: 16,
                    offset: data.offset,
                    statistics: 0,
                    previewlines: 8
                },
                headers: { 'x-key': API_KEY }
            }
        );

        const resultData = resultResponse.data;
        const records = resultData.records;
        const resultsWithPreviews = [];

        for (const record of records) {
            const result = {
                name: record.name,
                date: record.date,
                bucket_data: record.bucketh,
                bucket_id: record.bucket,
                storage_id: record.storageid,
                media_id: record.media
            };

            resultsWithPreviews.push(result);
        }

        return resultsWithPreviews;
    } catch (error) {
        console.error(error.message);
        return [];
    }
  }
  
  async findIntelPreview(data) {
    try {
        const previewResponse = await axios.get(
            `${API_URL}file/preview`,
            {
                params: {
                    sid: data.sid,
                    f: 0,
                    l: 8,
                    c: 1,
                    m: data.mid,
                    b: data.bid,
                    k: API_KEY
                },
                headers: { 'x-key': API_KEY }
            }
        );

        const preview = previewResponse.data;

        return preview;
    } catch (error) {
        console.error(error.message);
        return [];
    }
  }
  
  async readIntelData(data) {
    try {
        const response = await axios.get(
          `${API_URL}file/view`,
          {
            params: {
              f: 0,
              storageid: data.sid,
              bucket: data.btype,
              k: API_KEY,
              license: "api"
            },
            headers: {
              'x-key': API_KEY
            }
          }
        );

        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
  }
}

const service = new ApiHandlers();
export default service;