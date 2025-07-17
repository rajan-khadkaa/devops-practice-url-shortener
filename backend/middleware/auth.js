const admin = require("firebase-admin");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    req.user = null; // Allow unauthenticated requests
    return next();
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Check email verification for non-Google users
    if (
      !decodedToken.email_verified &&
      decodedToken.provider_id !== "google.com"
    ) {
      return res
        .status(403)
        .json({
          error: "Email not verified. Please verify your email to continue.",
        });
    }
    // Fetch or create user in MongoDB
    let user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      user = new User({
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split("@")[0], // Fallback name
        profileImage:
          decodedToken.picture ||
          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        emailVerified: decodedToken.email_verified || false,
      });
      await user.save();
    }
    req.user = {
      uid: decodedToken.uid,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      emailVerified: user.emailVerified,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;

// const admin = require("firebase-admin");
// const Url = require("../models/Url");

// const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split("Bearer ")[1];
//   // console.log("user token received from frontend is: ", token);
//   if (!token) {
//     req.user = null; // Allow unauthenticated requests
//     return next();
//   }
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     // const userChosenDomain = Url.findOne((user_uid = decodedToken.uid));
//     req.user = {
//       uid: decodedToken.uid,
//       // preferred_domain: userChosenDomain.preferred_domain,
//     };
//     // req.user = { uid: decodedToken.uid };
//     // console.log("decoded users uid is: ", req.user.uid);
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// module.exports = verifyToken;
