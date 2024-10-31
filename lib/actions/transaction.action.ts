'use server'


import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import Transaction from "../database/models/transaction.model";
import connectToDatabase from "../database/mongoose";
import { updateCredits } from "./user.action";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {

    const strip = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const amount = Number(transaction.amount) * 100;

    const session = await strip.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: transaction.plan,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        metadata: {
            buyerId: transaction.buyerId,
            credits: transaction.credits,
            plan: transaction.plan,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
}

export async function createTransaction(transaction: CreateTransactionParams) {
    try {

        await connectToDatabase();

        const newTransaction = await Transaction.create({
            ...transaction,
            buyer: transaction.buyerId
        });

        await updateCredits(transaction.buyerId, transaction.credits);

        return JSON.parse(JSON.stringify(newTransaction));

    } catch (error) {
        handleError(error)
    }
}