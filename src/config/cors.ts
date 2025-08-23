import { CorsOptions } from "cors";

export const allowedOrigins = [
  "https://re-fe.vercel.app", // the actuall site when deployed.
  "http://localhost:4200",
  "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
