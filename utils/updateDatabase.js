const axios = require("axios");

/*
    * @param required {data} the data to be sent to the database
    * @returns whatever the database returns
*/

async function UpdateDatabase(data) {
    try {
        const response = await axios.put(
            `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers`,
            data,
            {
                headers: {
                    Authorization: `${process.env.DATABASE_TOKEN}`,
                },
                withCredentials: true,
            },
        );

        return response;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = UpdateDatabase;