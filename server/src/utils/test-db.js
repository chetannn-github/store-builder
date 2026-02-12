const { Client } = require('pg');

// HARDCODED CONFIG FOR store-f8627f
const dbConfig = {
    // Agar tum K8s cluster ke andar se chala rahe ho toh ye:
    host: 'store-f8627f-db.store-f8627f.svc.cluster.local', 
    // Agar cluster ke bahar ho toh tumhe NodePort/Proxy use karni padegi
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'medusa-store'
};

async function testFetch() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("✅ Connection Successful!");

        const query = "SELECT id, token FROM api_key WHERE title LIKE '%Default%' LIMIT 1;";
        const res = await client.query(query);

        if (res.rows.length > 0) {
            console.log("🔥 Token Found:", res.rows[0].token);
        } else {
            console.log("⚠️ Table empty hai ya token nahi mila.");
        }
    } catch (err) {
        console.error("❌ Connection Failed:", err.message);
    } finally {
        await client.end();
    }
}

testFetch();