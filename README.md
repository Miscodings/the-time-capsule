This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# The Time Capsule

A full-stack retro technology e-commerce marketplace built with **Next.js (App Router)**, **MongoDB**, **Stripe** and **Clerk**.  
Browse, search, and filter products by category and subcategory, add items to cart, and securely checkout using Stripe.

Retro Tech Market is intentionally designed with a **Windows 95–inspired UI aesthetic**. 
The goal was to visually match the era of the products being sold, reinforcing nostalgia through chunky buttons, bordered panels, pixel-like layouts, and muted system colors.

This project was created to:
- Experiment with **non-modern UI design** while maintaining modern UX
- Prove that themed, opinionated design can coexist with scalable web architecture
- Build a complete, production-ready e-commerce flow with personality

The result is a marketplace that feels authentic to the technology it sells.

---

## 🚀 Tech Stack

- **Next.js 13+ (App Router)**
- **React / TypeScript**
- **MongoDB + Mongoose**
- **Stripe Checkout + Webhooks**
- **Tailwind CSS**
- **Vercel (for deployment)**

---

## 📦 Features

- Product listing with search
- Category & subcategory filtering (URL-based)
- Cart system
- Stripe Checkout integration
- Stripe webhook handling
- Serverless API routes
- Fully client/server separated logic

---

## 🛠️ Requirements

- **Node.js 18+**
- **MongoDB Atlas or local MongoDB**
- **Stripe account**

---

## 📁 Environment Variables

Create a `.env.local` file in the root of the project:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

---

## 📁 To run:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
