// swagger/auth.js
module.exports = {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "User login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      email: { type: "string" },
                      name: { type: "string" },
                    },
                  },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        400: { description: "Bad request - missing credentials" },
        401: { description: "Unauthorized - invalid credentials" },
        500: { description: "Server error" },
      },
    },
  },
};
