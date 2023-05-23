import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise
        const db = client.db("tournamentsFranceDB")
        const data = await db.collection("tournaments").find({}).toArray()
        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
