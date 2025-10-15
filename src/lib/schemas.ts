import * as z from "zod";

export const CategoryFormSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Category name is required" : "Category name must be a string",
    })
    .min(2, { error: "Category name must be at least 2 characters long." })
    .max(50, { error: "Category name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      error: "Only letters, numbers, and spaces are allowed in the category name.",
    }),

  image: z
    .array(
      z.object({
        url: z.string({
          error: (issue) =>
            issue.input === undefined ? "Image URL is required" : "Image URL must be a string",
        }),
      })
    )
    .length(1, { error: "Choose a category image" }),

  url: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Category URL is required" : "Category URL must be a string",
    })
    .min(2, { error: "Category URL must be at least 2 characters long." })
    .max(50, { error: "Category URL cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9_-]+$/, {
      error:
        "Only letters, numbers, hyphens, and underscores are allowed in the category URL, and consecutive hyphens or underscores are not allowed.",
    }),

  featured: z.boolean().default(false),
});
