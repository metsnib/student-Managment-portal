import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** List all students, newest first. Requires sign-in. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    return await ctx.db
      .query("students")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

/**
 * Fetch a single student by id. Returns null when the id is unknown or the
 * caller is signed out. Requires sign-in.
 */
export const getById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    return (await ctx.db.get(args.id)) ?? null;
  },
});

/** Total student count for the dashboard stat card. Requires sign-in. */
export const count = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    return (await ctx.db.query("students").collect()).length;
  },
});

/** Add a student. Validates input and enforces unique email. Requires sign-in. */
export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    program: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const program = args.program.trim();

    if (name.length < 2) throw new Error("Name must be at least 2 characters.");
    if (!emailRegex.test(email)) throw new Error("Enter a valid email address.");
    if (program.length < 2) throw new Error("Program must be at least 2 characters.");
    if (!Number.isInteger(args.year) || args.year < 1 || args.year > 6) {
      throw new Error("Year must be a whole number between 1 and 6.");
    }

    const existing = await ctx.db
      .query("students")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) throw new Error("A student with this email already exists.");

    return await ctx.db.insert("students", {
      name,
      email,
      program,
      year: args.year,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

/** Remove a student by id. Requires sign-in. */
export const remove = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    await ctx.db.delete(args.id);
  },
});
