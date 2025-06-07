const { Client } = require("pg");

const client = new Client({
    connectionString:
        "postgresql://minhtetthar:5ZqL8JoEX5xNF419RnMd6MUyqrJKErwD@dpg-d12ad1c9c44c7384ips0-a.singapore-postgres.render.com/driftchat_postgres_db",
    ssl: { rejectUnauthorized: false },
});

async function testDB() {
    try {
        await client.connect();
        console.log("Connected to Render Postgres DB successfully!");
    } catch (err) {
        console.error("Failed to connect:", err);
    } finally {
        await client.end();
    }
}

testDB();
