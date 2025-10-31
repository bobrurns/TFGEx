const express = require(`express`);
const morgan = require(`morgan`);
const app = express();
const helmet = require(`helmet`);
const globalErrorHandler = require(`./controllers/errorController`);
const storyRouter = require(`./routes/storyRouter`);
const adminRouter = require(`./routes/adminRouter`);
const path = require(`path`);
const viewRouter = require(`./routes/viewRouter`);
const AppError = require("./utils/appError");
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require("cookie-parser");
const rateLimit = require(`express-rate-limit`);
const hpp = require(`hpp`);

const mongoSanitize = require(`express-mongo-sanitize`);
const xss = require(`xss-clean`);

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `views`));

app.use(express.static(path.join(__dirname, `public`)));

// Set security headers.
app.use(helmet());

if (process.env.NODE_ENV === `development`) {
  app.use(morgan(`dev`));
}

// Rate Limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: `Request limit reached, try again in 1hr`,
});
app.use(`/api`, limiter);

app.use(express.json({ limit: `10kb` }));
app.use(cookieParser());
// app.use(mongoSanitize());

// XSS Protection
// app.use(xss());

app.use(
  hpp({
    whitelist: [
      "firstContact",
      "promised",
      "timeline",
      "realization",
      "financialImpact",
      "emotionalImpact",
      "communicationRecords",
      "financialRecords",
      "contractsAgreements",
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(`/`, viewRouter);
app.use(`/api/v1/stories`, storyRouter);
app.use(`/api/v1/admin__dashboard`, adminRouter);

app.use((req, res, next) => {
  next(new AppError(`Requested URL does not exist. (${req.originalUrl})`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
