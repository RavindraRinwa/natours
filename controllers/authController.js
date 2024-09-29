const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const signToken = (id) => {
  //payload(data),jwt secret,jwt expire time
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); //User.save(Wrong code because by this anyone make himself admin without any security flow)
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  // console.log(newUser);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password !', 400));
  }
  //2)Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //3)If everything ok,send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access'),
      401
    );
  }
  //2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)Check if user still exits
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exit', 401)
    );
  }
  //4)Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password ! please login again',
        401
      )
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  //2)Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  //save the document
  await user.save({ validateBeforeSave: false });
  //3)send it to user's email
  const resetURL = `${req.protocol}:// ${req.get(
    'host'
  )} / api / v1 / users / resetPassword/${resetToken}`;
  const message = `Forgot your password ? Submit a PATCH requset with your new password and passwordConfirm to:${resetURL}.\nIf you did't forget your password ,please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There is error sending the email.Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2)If token has not expired and there is user,set the new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3)Update changedPasswordAt property for the user
  //4)Log the user in,send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
