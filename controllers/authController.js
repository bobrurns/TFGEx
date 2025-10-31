const { catchAsync } = require("../utils/catchAsync");

const { promisify } = require(`util`);

const jwt = require(`jsonwebtoken`);

const User = require(`../models/userModel`);
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expire: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === `production`) cookieOptions.secure = true;

  res.cookie(`jwt`, token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({ status: `success`, token, data: user });
  console.log(`cookie set`);
};

exports.logIn = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return next(new AppError(`Uesrname and password required`, 400));
  }

  const user = await User.findOne({ name: name }).select(`+password`);

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError(`Incorrect email or password`, 401));
  }
  console.log(`Admin login success: ${new Date().toLocaleString()}`);
  createSendToken(user, 200, res);
});

exports.logOut = catchAsync(async (req, res, next) => {
  res.cookie(`jwt`, `loggedout`, {
    expire: new Date(Date.now()) + 10 * 1000,
    httpOnly: true,
  });
  res.status(200).json({ status: `success` });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(`Bearer`)
  ) {
    token = req.headers.authorization.split(` `)[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(`You need to be logged in to access this content.`, 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_secret);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError(`User associated with this login token does not exist.`)
    );

  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(new AppError(`This is not the correct password.`, 401));

  req.user = freshUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_secret
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError(`You do not have permission to do this.`, 403));
    next();
  };
