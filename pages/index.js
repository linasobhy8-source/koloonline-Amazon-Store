import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= SAFE ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x300?text=Koloonline";

function safeString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function safeNumber(value, fallback = 0) {
  return typeof value === "number"
    ? value
    : fallback;
}

/* ================= TREND SCORE ================= */

function calculateTrendScore(product) {
  return (
    safeNumber(product?.views) +
    safeNumber(product?.clicks) * 2 +
    safeNumber(product?.orders) * 5 +
    (product?.viralBoost ? 50 : 0)
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "white",
        padding: 60,
        borderRadius: 20,
        marginBottom: 20,
      }}
    >
      <h1>🔥 Discover Viral Amazon Deals</h1>

      <p style={{ color: "#cbd5e1" }}>
        AI-powered trending products
      </p>

      <div
        style={{
          display: "flex",
          gap: 15,
          marginTop: 20,
        }}
      >
        <Link
          href="/products"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          <span>🛒 Products</span>
        </Link>

        <Link
          href="/blog"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          <span>📚 Blog</span>
        </Link>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */

function ProductCard({ product }) {
  const title = safeString(
    product?.title,
    "Amazon Product"
  );

  const image =
    typeof product?.image === "string" &&
    product.image.startsWith("http")
      ? product.image
      : FALLBACK_IMAGE;

  const price = safeNumber(product?.price);

  const productId = safeString(product?.id);

  return (
    <Link
      href={`/product/${productId}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 15,
          borderRadius: 16,
        }}
      >
        <Image
          src={image}
          width={250}
          height={250}
          alt={title}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />

        <h3
          style={{
            font
