const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
//@route Get api/profile
//@desc Test Route
//@access Public

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(500).json({ msg: "there is no profile for this user" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Post api/profile
//@desc Test Route
//@access Public
router.post(
  "/",
  auth,
  [
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (skills) {
      profileFields.skills = req.body.skills
        .split(",")
        .map((skill) => skill.trim());
    }
    console.log(profileFields.skills);

    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update

        if (req.user.id.match(/^[0-9a-fA-F]{24}$/)) {
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
          // Yes, it's a valid ObjectId, proceed with `findById` call.
        }
      }

      //Create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(Profile);
    } catch (error) {
      console.error(error);
      resizeTo.status(500).send("server error");
    }
  }
);
//@route Get api/profile
//@desc Get All Profiles
//@access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});
//@route Get api/profile/user/:user_id
//@desc Get  Profiles by UserId
//@access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("server error");
  }
});

//@route  Delete api/profile
//@desc   Delete  Profiles and User
//@access Public

router.delete("/", auth, async (req, res) => {
  try {
    //Remove Profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });

    //Remove User
    await User.findOneAndRemove({
      _id: req.user.id,
    });
    res.json({ msg: "User Deleted " });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route  put api/profile/experience
//@desc   Add  Profile Experience
//@access Public
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is Required").not().isEmpty(),
      check("company", "Company is Required").not().isEmpty(),
      check("from", "From is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
