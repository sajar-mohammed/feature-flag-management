import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import organizationRouter from "./routes/organization.route.js";
import featureFlagRouter from "./routes/featureFlag.route.js";
import featureCheckRouter from "./routes/featureCheck.route.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/organization", organizationRouter);

app.use("/api/feature-flags", featureFlagRouter);
app.use("/api/feature-check", featureCheckRouter);

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

export default app;