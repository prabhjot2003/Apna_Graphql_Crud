import App from "./app";
import { config } from "dotenv";
import { PORT } from "./env";

try {
  const result: any = config();
  if (result && result.parsed) {
    Object.keys(result.parsed).forEach((key) => {
      process.env[key] = result.parsed[key];
    });
  }
} catch (e) {
  
}
new App(Number(PORT)).listen();
