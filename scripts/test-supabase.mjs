import axios from "axios";
import dotenv from "dotenv";
import dns from "node:dns";
dns.setDefaultResultOrder('ipv4first');

dotenv.config({ path: ".env" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const instance = axios.create({
    baseURL: `${SUPABASE_URL}/rest/v1`,
    headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    timeout: 10000,
});

async function test() {
    try {
        console.log("Fetching admission_enquiries...");
        const res1 = await instance.get("/admission_enquiries?select=*&limit=1");
        console.log("admission_enquiries status:", res1.status, res1.data);
    } catch (err) {
        console.error("admission_enquiries error:", err.response ? err.response.data : err.message);
    }

    try {
        console.log("\nFetching banners...");
        const res2 = await instance.get("/banners?select=*&limit=1");
        console.log("banners status:", res2.status, res2.data);
    } catch (err) {
        console.error("banners error:", err.response ? err.response.data : err.message);
    }

    try {
        console.log("\nFetching recent_events...");
        const res3 = await instance.get("/recent_events?select=*&limit=1");
        console.log("recent_events status:", res3.status, res3.data);
    } catch (err) {
        console.error("recent_events error:", err.response ? err.response.data : err.message);
    }
}

test();
