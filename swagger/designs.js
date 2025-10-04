module.exports = {
  "/designs": {
    get: {
      tags: ["Designs"],
      summary: "Get all designs with pagination and filtering",
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Page number (default 1)",
          required: false,
          schema: { type: "integer", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Number of items per page (default 50)",
          required: false,
          schema: { type: "integer", default: 50 },
        },
        {
          name: "product_id",
          in: "query",
          description: "Filter by product ID",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "email",
          in: "query",
          description: "Filter by email",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "name",
          in: "query",
          description: "Filter by design name",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "saree_style",
          in: "query",
          description: "Filter by saree style",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "jacquard_type",
          in: "query",
          description: "Filter by jacquard type",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "label",
          in: "query",
          description: "Filter by label",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "epi",
          in: "query",
          description: "Filter by EPI",
          required: false,
          schema: { type: "integer" },
        },
        {
          name: "ppi",
          in: "query",
          description: "Filter by PPI",
          required: false,
          schema: { type: "integer" },
        },
        {
          name: "hooks",
          in: "query",
          description: "Filter by number of hooks",
          required: false,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "List of designs with pagination and filters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  limit: { type: "integer" },
                  total: { type: "integer" },
                  filters: { type: "object" },
                  designs: {
                    type: "array",
                    items: { type: "object" },
                  },
                },
              },
            },
          },
        },
        500: { description: "Server error" },
      },
    },
    post: {
      tags: ["Designs"],
      summary: "Create a new design",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Design created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  design: { type: "object" },
                },
              },
            },
          },
        },
        500: { description: "Server error" },
      },
    },
  },
};
